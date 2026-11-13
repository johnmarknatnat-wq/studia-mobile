// services/auth-service.ts
// MOCK backend. Every exported function is async and maps 1:1 to a REST endpoint, so later you
// replace the body with fetch("/auth/...") and keep the UI untouched. Install: npx expo install expo-crypto
//
// Endpoint map:
//   login                  -> POST /auth/login
//   register               -> POST /auth/register            (creates UNVERIFIED user + sends OTP)
//   verifyOtp              -> POST /auth/verify-otp
//   resendOtp              -> POST /auth/resend-otp
//   loginWithGoogle        -> POST /auth/google              (send the Google ID TOKEN, not the email)
//   completeGoogleProfile  -> POST /auth/google/complete
//   requestPasswordReset   -> POST /auth/forgot-password
//   resetPassword          -> POST /auth/reset-password
//
// Suggested SQL (MySQL / XAMPP):
//   users(id CHAR(36) PK, role ENUM('student','instructor'), full_name VARCHAR(80),
//         email VARCHAR(254) NOT NULL, UNIQUE KEY uq_users_email (email),   -- <- duplicate-email guard
//         password_hash VARCHAR(255) NULL, google_id VARCHAR(64) NULL UNIQUE,
//         section VARCHAR(20) NULL, department VARCHAR(80) NULL, phone VARCHAR(13) NULL,
//         email_verified TINYINT(1) DEFAULT 0, status ENUM('active','pending_approval') DEFAULT 'active',
//         created_at DATETIME)
//   otp_codes(id, email, purpose, code_hash, expires_at, attempts, sent_at, consumed_at)

import * as Crypto from "expo-crypto";

import {
  isStrongPassword,
  normalizeEmail,
  normalizeName,
  normalizePhone,
  normalizeSection,
  validateAll,
  type FieldErrors,
  type FieldKey,
  type Role,
} from "@/lib/auth-validation";

export type { Role };

/* ---------- Config ---------- */

const LATENCY_MS = 600;
const OTP_TTL_MS = 5 * 60_000;
const OTP_RESEND_MS = 30_000;
const OTP_MAX_ATTEMPTS = 5;
const LOGIN_MAX_FAILS = 5;
const LOGIN_LOCK_MS = 60_000;
const TOKEN_TTL_MS = 10 * 60_000;

/** Instructors can grant themselves powers if anyone can self-register. Turn on once you have an admin screen. */
export const REQUIRE_INSTRUCTOR_APPROVAL = false;

/* ---------- Types ---------- */

export type OtpPurpose = "signup" | "google_login" | "google_signup" | "reset";

export type AuthErrorCode =
  | "VALIDATION"
  | "INVALID_CREDENTIALS"
  | "EMAIL_TAKEN"
  | "ROLE_MISMATCH"
  | "EMAIL_NOT_VERIFIED"
  | "ACCOUNT_PENDING"
  | "OTP_INVALID"
  | "OTP_EXPIRED"
  | "OTP_LOCKED"
  | "RATE_LIMITED"
  | "NETWORK"
  | "UNKNOWN";

export class AuthError extends Error {
  code: AuthErrorCode;
  fields?: FieldErrors;
  constructor(code: AuthErrorCode, message: string, fields?: FieldErrors) {
    super(message);
    Object.setPrototypeOf(this, AuthError.prototype); // keeps `instanceof` reliable after transpiling
    this.name = "AuthError";
    this.code = code;
    this.fields = fields;
  }
}

export const isAuthError = (e: unknown): e is AuthError =>
  e instanceof AuthError || (typeof e === "object" && e !== null && (e as { name?: string }).name === "AuthError");

export type User = {
  id: string;
  role: Role;
  fullName: string;
  email: string;
  section?: string;
  department?: string;
  phone?: string;
  authProvider: "password" | "google";
  emailVerified: boolean;
  status: "active" | "pending_approval";
  createdAt: string;
};

export type Session = { user: User; accessToken: string; expiresAt: number };

export type OtpInfo = { resendInSec: number; expiresInSec: number; devCode?: string };

export type VerifyResult =
  | { kind: "session"; session: Session }
  | { kind: "needs_profile"; profileToken: string; fullName: string }
  | { kind: "reset_token"; resetToken: string };

export type RegisterInput = {
  role: Role;
  fullName: string;
  email: string;
  password: string;
  section?: string;
  department?: string;
  phone?: string;
};

/* ---------- Mock storage (replace with your database) ---------- */

type UserRow = User & { passwordHash: string | null; googleId?: string };

const users = new Map<string, UserRow>(); // key = normalized email (the UNIQUE index in SQL)
const otps = new Map<string, { code: string; expiresAt: number; attempts: number; sentAt: number }>();
const failures = new Map<string, { count: number; lockedUntil: number }>();
const pendingGoogle = new Map<string, { fullName: string; googleId: string }>();
const profileTokens = new Map<string, { email: string; expiresAt: number }>();
const resetTokens = new Map<string, { email: string; expiresAt: number }>();

const SEEDS = [
  {
    password: "Student@123",
    user: {
      id: "u-seed-1", role: "student" as const, fullName: "Juan Dela Cruz", email: "student@omsc.edu.ph",
      section: "BSIT 3-A", authProvider: "password" as const, emailVerified: true,
      status: "active" as const, createdAt: "2026-01-01T00:00:00.000Z",
    },
  },
  {
    password: "Instructor@123",
    user: {
      id: "u-seed-2", role: "instructor" as const, fullName: "Maria Santos", email: "instructor@omsc.edu.ph",
      department: "College of Computing", authProvider: "password" as const, emailVerified: true,
      status: "active" as const, createdAt: "2026-01-01T00:00:00.000Z",
    },
  },
];

let seeding: Promise<void> | null = null;
function ensureSeed() {
  seeding ??= (async () => {
    for (const s of SEEDS) {
      users.set(s.user.email, { ...s.user, passwordHash: await hashPassword(s.user.email, s.password) });
    }
  })();
  return seeding;
}

// Mock Google account. Real flow: expo-auth-session -> idToken -> backend verifies it with Google.
const MOCK_GOOGLE = { googleId: "google-mock-001", email: "mock.user@gmail.com", fullName: "Mock Google User" };

/* ---------- Helpers ---------- */

const latency = () => new Promise<void>((r) => setTimeout(r, LATENCY_MS));

function randomOtp() {
  const b = Crypto.getRandomBytes(4); // CSPRNG, never Math.random() for codes or tokens
  const n = ((b[0] << 24) | (b[1] << 16) | (b[2] << 8) | b[3]) >>> 0;
  return String(n % 1_000_000).padStart(6, "0");
}

const randomToken = () =>
  Array.from(Crypto.getRandomBytes(24), (x) => x.toString(16).padStart(2, "0")).join("");

// Mock only, so the mock "DB" does not hold plaintext passwords. The real server uses argon2id / bcrypt.
// NEVER hash passwords on the client in production.
const hashPassword = (email: string, pw: string) =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${email}:${pw}`);

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const toUser = (row: UserRow): User => {
  const { passwordHash, googleId, ...user } = row;
  void passwordHash;
  void googleId;
  return user;
};

const newSession = (row: UserRow): Session => ({
  user: toUser(row),
  accessToken: randomToken(), // TODO: real JWT / opaque token from the server
  expiresAt: Date.now() + 60 * 60_000,
});

function assertValid(keys: readonly FieldKey[], values: Partial<Record<FieldKey, string>>, role: Role, strict: boolean) {
  const fields = validateAll(keys, values, { role, strict });
  if (Object.keys(fields).length) throw new AuthError("VALIDATION", "Please fix the highlighted fields.", fields);
}

function assertRole(row: UserRow, role: Role) {
  if (row.role !== role) {
    throw new AuthError("ROLE_MISMATCH", `This account is registered as ${row.role}. Go back and choose ${row.role}.`);
  }
}

function assertActive(row: UserRow) {
  if (row.status === "pending_approval") {
    throw new AuthError("ACCOUNT_PENDING", "Your instructor account is waiting for administrator approval.");
  }
}

function assertNotLocked(email: string) {
  const f = failures.get(email);
  if (f && f.lockedUntil > Date.now()) {
    const s = Math.ceil((f.lockedUntil - Date.now()) / 1000);
    throw new AuthError("RATE_LIMITED", `Too many attempts. Try again in ${s}s.`);
  }
}

function recordFailure(email: string) {
  const f = failures.get(email) ?? { count: 0, lockedUntil: 0 };
  f.count += 1;
  if (f.count >= LOGIN_MAX_FAILS) {
    f.count = 0;
    f.lockedUntil = Date.now() + LOGIN_LOCK_MS;
  }
  failures.set(email, f);
}

function issueOtp(email: string, purpose: OtpPurpose): OtpInfo {
  const key = `${email}|${purpose}`;
  const now = Date.now();
  const prev = otps.get(key);
  if (prev && now - prev.sentAt < OTP_RESEND_MS) {
    const s = Math.ceil((OTP_RESEND_MS - (now - prev.sentAt)) / 1000);
    throw new AuthError("RATE_LIMITED", `Please wait ${s}s before requesting another code.`);
  }
  const code = randomOtp();
  otps.set(key, { code, expiresAt: now + OTP_TTL_MS, attempts: 0, sentAt: now }); // new code replaces the old one
  // TODO(backend): send the email here and store only a HASH of the code. Also cap sends per email/IP per day.
  return { resendInSec: OTP_RESEND_MS / 1000, expiresInSec: OTP_TTL_MS / 1000, devCode: __DEV__ ? code : undefined };
}

function createUser(p: {
  role: Role; fullName: string; email: string; passwordHash: string | null; provider: "password" | "google";
  section?: string; department?: string; phone?: string; googleId?: string;
}): UserRow {
  const status = p.role === "instructor" && REQUIRE_INSTRUCTOR_APPROVAL ? "pending_approval" : "active";
  const row: UserRow = {
    id: `u-${randomToken().slice(0, 12)}`,
    role: p.role,
    fullName: p.fullName,
    email: p.email,
    section: p.role === "student" ? p.section : undefined,
    department: p.role === "instructor" ? p.department : undefined,
    phone: p.phone || undefined,
    authProvider: p.provider,
    emailVerified: p.provider === "google",
    status,
    createdAt: new Date().toISOString(),
    passwordHash: p.passwordHash,
    googleId: p.googleId,
  };
  users.set(p.email, row);
  return row;
}

const roleKeys = (role: Role): FieldKey[] => (role === "student" ? ["section"] : ["department"]);

/* ---------- Public API ---------- */

export async function login(input: { email: string; password: string; role: Role }): Promise<Session> {
  await latency();
  await ensureSeed();
  assertValid(["email", "password"], input, input.role, false);
  const email = normalizeEmail(input.email);

  assertNotLocked(email);
  const hash = await hashPassword(email, input.password); // hash even for unknown emails: similar timing
  const row = users.get(email);

  if (!row || !row.passwordHash || !safeEqual(row.passwordHash, hash)) {
    recordFailure(email);
    // One generic message for "no such email" and "wrong password" (no account enumeration).
    throw new AuthError(
      "INVALID_CREDENTIALS",
      "Incorrect email or password. If you signed up with Google, use “Continue with Google”.",
    );
  }
  failures.delete(email);
  assertRole(row, input.role);
  if (!row.emailVerified) throw new AuthError("EMAIL_NOT_VERIFIED", "Please verify your email to continue.");
  assertActive(row);
  return newSession(row);
}

export async function register(input: RegisterInput): Promise<OtpInfo & { email: string }> {
  await latency();
  await ensureSeed();
  assertValid(["fullName", ...roleKeys(input.role), "email", "phone", "password"], input, input.role, true);

  const email = normalizeEmail(input.email);
  const existing = users.get(email);
  if (existing?.emailVerified) {
    // Trade-off: this reveals that the email is registered. It is required by the spec ("duplicate account"),
    // so protect the real endpoint with rate limiting + CAPTCHA.
    throw new AuthError("EMAIL_TAKEN", "An account with this email already exists. Try logging in.", {
      email: "This email is already registered.",
    });
  }

  const row = createUser({
    role: input.role,
    fullName: normalizeName(input.fullName),
    email,
    passwordHash: await hashPassword(email, input.password),
    provider: "password",
    section: normalizeSection(input.section ?? ""),
    department: normalizeName(input.department ?? ""),
    phone: normalizePhone(input.phone ?? "") ?? "",
  });
  void row; // an unverified re-registration overwrites the old unverified row (same key)

  return { ...issueOtp(email, "signup"), email };
}

export async function resendOtp(emailRaw: string, purpose: OtpPurpose): Promise<OtpInfo> {
  await latency();
  await ensureSeed();
  const email = normalizeEmail(emailRaw);

  if (purpose === "reset") return requestPasswordReset(email, true);

  const ok =
    (purpose === "signup" && users.get(email)?.emailVerified === false) ||
    (purpose === "google_login" && users.has(email)) ||
    (purpose === "google_signup" && pendingGoogle.has(email));
  if (!ok) throw new AuthError("OTP_EXPIRED", "This session expired. Please start again.");
  return issueOtp(email, purpose);
}

export async function verifyOtp(input: { email: string; purpose: OtpPurpose; code: string }): Promise<VerifyResult> {
  await latency();
  await ensureSeed();
  const email = normalizeEmail(input.email);
  const key = `${email}|${input.purpose}`;
  const entry = otps.get(key);

  if (!entry) throw new AuthError("OTP_EXPIRED", "No active code. Request a new one.");
  if (Date.now() > entry.expiresAt) {
    otps.delete(key);
    throw new AuthError("OTP_EXPIRED", "This code has expired. Request a new one.");
  }
  if (entry.attempts >= OTP_MAX_ATTEMPTS) {
    otps.delete(key);
    throw new AuthError("OTP_LOCKED", "Too many wrong codes. Request a new one.");
  }
  if (!safeEqual(entry.code, input.code)) {
    entry.attempts += 1;
    const left = OTP_MAX_ATTEMPTS - entry.attempts;
    if (left <= 0) {
      otps.delete(key);
      throw new AuthError("OTP_LOCKED", "Too many wrong codes. Request a new one.");
    }
    throw new AuthError("OTP_INVALID", `Wrong code. ${left} ${left === 1 ? "attempt" : "attempts"} left.`);
  }
  otps.delete(key); // single use

  switch (input.purpose) {
    case "signup": {
      const row = users.get(email);
      if (!row) throw new AuthError("OTP_EXPIRED", "This session expired. Please start again.");
      row.emailVerified = true;
      assertActive(row);
      return { kind: "session", session: newSession(row) };
    }
    case "google_login": {
      const row = users.get(email);
      if (!row) throw new AuthError("OTP_EXPIRED", "This session expired. Please start again.");
      assertActive(row);
      return { kind: "session", session: newSession(row) };
    }
    case "google_signup": {
      const g = pendingGoogle.get(email);
      if (!g) throw new AuthError("OTP_EXPIRED", "This session expired. Please start again.");
      const profileToken = randomToken();
      profileTokens.set(profileToken, { email, expiresAt: Date.now() + TOKEN_TTL_MS });
      return { kind: "needs_profile", profileToken, fullName: g.fullName };
    }
    case "reset": {
      const resetToken = randomToken();
      resetTokens.set(resetToken, { email, expiresAt: Date.now() + TOKEN_TTL_MS });
      return { kind: "reset_token", resetToken };
    }
  }
}

export async function loginWithGoogle(role: Role): Promise<OtpInfo & { email: string; purpose: OtpPurpose }> {
  await latency();
  await ensureSeed();
  // TODO(real): const idToken = await GoogleSignin.signIn(); send idToken to the backend, which verifies it with
  // Google and reads email / sub from the VERIFIED token. Never trust an email string sent by the client.
  const g = MOCK_GOOGLE;
  const email = normalizeEmail(g.email);
  const existing = users.get(email);

  if (existing) {
    assertRole(existing, role); // before sending any OTP
    return { ...issueOtp(email, "google_login"), email, purpose: "google_login" };
  }
  pendingGoogle.set(email, { fullName: g.fullName, googleId: g.googleId });
  return { ...issueOtp(email, "google_signup"), email, purpose: "google_signup" };
}

export async function completeGoogleProfile(input: {
  profileToken: string;
  role: Role;
  fullName: string;
  section?: string;
  department?: string;
  phone?: string;
}): Promise<Session> {
  await latency();
  assertValid(["fullName", ...roleKeys(input.role), "phone"], input, input.role, true);

  const t = profileTokens.get(input.profileToken);
  if (!t || t.expiresAt < Date.now()) {
    profileTokens.delete(input.profileToken);
    throw new AuthError("OTP_EXPIRED", "This session expired. Please start again.");
  }
  const g = pendingGoogle.get(t.email);
  if (!g) throw new AuthError("OTP_EXPIRED", "This session expired. Please start again.");
  if (users.get(t.email)?.emailVerified) throw new AuthError("EMAIL_TAKEN", "An account with this email already exists.");

  profileTokens.delete(input.profileToken); // single use
  pendingGoogle.delete(t.email);
  const row = createUser({
    role: input.role,
    fullName: normalizeName(input.fullName),
    email: t.email,
    passwordHash: null,
    provider: "google",
    googleId: g.googleId,
    section: normalizeSection(input.section ?? ""),
    department: normalizeName(input.department ?? ""),
    phone: normalizePhone(input.phone ?? "") ?? "",
  });
  assertActive(row);
  return newSession(row);
}

/** Always resolves the same way whether or not the email exists (no account enumeration). */
export async function requestPasswordReset(emailRaw: string, skipLatency = false): Promise<OtpInfo> {
  if (!skipLatency) await latency();
  await ensureSeed();
  const email = normalizeEmail(emailRaw);
  const generic: OtpInfo = { resendInSec: OTP_RESEND_MS / 1000, expiresInSec: OTP_TTL_MS / 1000 };

  if (!users.has(email)) return generic;
  try {
    return issueOtp(email, "reset");
  } catch (e) {
    if (isAuthError(e) && e.code === "RATE_LIMITED") return generic; // swallow: throttling must not leak existence
    throw e;
  }
}

export async function resetPassword(input: { resetToken: string; newPassword: string }): Promise<void> {
  await latency();
  if (!isStrongPassword(input.newPassword)) {
    throw new AuthError("VALIDATION", "Please fix the highlighted fields.", {
      password: "Password does not meet all requirements.",
    });
  }
  const t = resetTokens.get(input.resetToken);
  if (!t || t.expiresAt < Date.now()) {
    resetTokens.delete(input.resetToken);
    throw new AuthError("OTP_EXPIRED", "This reset session expired. Start again.");
  }
  const row = users.get(t.email);
  if (!row) throw new AuthError("OTP_EXPIRED", "This reset session expired. Start again.");

  resetTokens.delete(input.resetToken); // single use
  row.passwordHash = await hashPassword(t.email, input.newPassword);
  row.emailVerified = true;
  failures.delete(t.email);
  // TODO(backend): invalidate every existing session / refresh token for this user.
}


// src/app/auth.tsx
// src/components/auth/auth-parts.tsx
// src/services/auth-service.ts        <- move it here
// src/lib/auth-validation.ts          <- create this folder and file if it's missing