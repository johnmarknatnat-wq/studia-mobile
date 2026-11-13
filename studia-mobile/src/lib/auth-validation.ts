// // lib/auth-validation.ts
// // Pure functions, no React. The mock service re-runs these so that "client-side only"
// // validation never becomes the only line of defence. Port the same rules to the backend.

// export type Role = "student" | "instructor";

// export type FieldKey =
//   | "fullName"
//   | "section"
//   | "department"
//   | "email"
//   | "phone"
//   | "password"
//   | "confirm";

// export type FieldErrors = Partial<Record<FieldKey, string>>;

// export const LIMITS = { name: 80, email: 254, password: 64 } as const;

// /* ---------- Normalizers (always run these before saving / comparing) ---------- */

// export const normalizeEmail = (v: string) => v.trim().toLowerCase();
// export const normalizeName = (v: string) => v.trim().replace(/\s+/g, " ");
// export const normalizeSection = (v: string) => v.trim().replace(/\s+/g, " ").toUpperCase();

// /** Returns "+639XXXXXXXXX", "" (empty / not provided) or null (invalid). */
// export function normalizePhone(v: string): string | null {
//   const c = v.replace(/[\s-]/g, "");
//   if (!c) return "";
//   if (/^09\d{9}$/.test(c)) return `+63${c.slice(1)}`;
//   if (/^\+639\d{9}$/.test(c)) return c;
//   return null;
// }

// /* ---------- Password strength ---------- */

// export const PASSWORD_RULES = [
//   { id: "len", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
//   { id: "lower", label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
//   { id: "upper", label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
//   { id: "num", label: "One number", test: (p: string) => /\d/.test(p) },
//   { id: "sym", label: "One symbol (e.g. ! @ # $)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
// ] as const;

// export const passwordScore = (p: string) => PASSWORD_RULES.filter((r) => r.test(p)).length;

// export const isStrongPassword = (p: string) =>
//   p.length <= LIMITS.password && passwordScore(p) === PASSWORD_RULES.length;

// /* ---------- Field rules ---------- */

// const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// // Explicit ranges instead of \p{L}: avoids relying on Unicode property escapes in Hermes.
// const NAME_RE = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ'’.\- ]{1,79}$/;
// const SECTION_RE = /^[A-Z0-9][A-Z0-9 \-]{1,19}$/;
// const DEPARTMENT_RE = /^[A-Za-z0-9À-ÿ&,.'’\- ]{2,80}$/;

// export const isEmail = (v: string) => v.length <= LIMITS.email && EMAIL_RE.test(v);
// export const isOtp = (v: string) => /^\d{6}$/.test(v);

// type Ctx = {
//   role: Role;
//   /** Needed to validate "confirm". */
//   password?: string;
//   /** false on the login screen: we only check "not empty", never reveal password rules. */
//   strict?: boolean;
// };

// export function validateField(key: FieldKey, raw: string, ctx: Ctx): string | null {
//   const strict = ctx.strict ?? true;
//   switch (key) {
//     case "fullName": {
//       const v = normalizeName(raw);
//       if (!v) return "Full name is required.";
//       return NAME_RE.test(v) ? null : "Use letters only (2 to 80 characters).";
//     }
//     case "section": {
//       const v = normalizeSection(raw);
//       if (!v) return "Section is required.";
//       return SECTION_RE.test(v) ? null : "Enter your section, e.g. BSIT 3-A.";
//     }
//     case "department": {
//       const v = normalizeName(raw);
//       if (!v) return "Department is required.";
//       return DEPARTMENT_RE.test(v) ? null : "Enter a valid department name.";
//     }
//     case "email": {
//       const v = normalizeEmail(raw);
//       if (!v) return "Email is required.";
//       return isEmail(v) ? null : "Enter a valid email address.";
//     }
//     case "phone":
//       return normalizePhone(raw) === null ? "Use a PH mobile number, e.g. 09123456789." : null;
//     case "password": {
//       if (!raw) return "Password is required.";
//       if (raw.length > LIMITS.password) return `Password is too long (max ${LIMITS.password}).`;
//       if (strict && !isStrongPassword(raw)) return "Password does not meet all requirements.";
//       return null;
//     }
//     case "confirm": {
//       if (!raw) return "Please confirm your password.";
//       return raw === (ctx.password ?? "") ? null : "Passwords do not match.";
//     }
//   }
// }

// export function validateAll(
//   keys: readonly FieldKey[],
//   values: Partial<Record<FieldKey, string>>,
//   ctx: Ctx,
// ): FieldErrors {
//   const errors: FieldErrors = {};
//   for (const k of keys) {
//     const msg = validateField(k, values[k] ?? "", { ...ctx, password: values.password ?? ctx.password });
//     if (msg) errors[k] = msg;
//   }
//   return errors;
// }
