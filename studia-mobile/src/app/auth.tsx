// app/auth.tsx
// Navigate from explore.tsx with:  router.push({ pathname: "/auth", params: { role } });
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { createRef, useCallback, useEffect, useRef, useState, type RefObject } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppButton } from "@/components/ui/app-button";
import { Banner, Field, OtpInput, PasswordMeter, type BannerType } from "@/components/auth/auth-parts";
import { C } from "@/constants/studia-colors";
import { isOtp, isStrongPassword, validateAll, type FieldErrors, type FieldKey } from "@/lib/auth-validation";
import {
  completeGoogleProfile,
  isAuthError,
  login,
  loginWithGoogle,
  register,
  requestPasswordReset,
  resendOtp,
  resetPassword,
  verifyOtp,
  type OtpInfo,
  type OtpPurpose,
  type Role,
  type Session,
} from "@/services/auth-service";

const STUDIA_LOGO = require("@/assets/images/studia-mobile-logo.png");
const OMSC_LOGO = require("@/assets/images/omsc.logo.png");

const BANNER_MS = 4500;
const HOME_ROUTE = "/" as Href; // TODO: replace with your home / tabs route

type Mode = "login" | "signup" | "verify" | "forgot" | "reset" | "profile";
type Form = Record<FieldKey, string>;
type OtpCtx = { email: string; purpose: OtpPurpose };

const EMPTY_FORM: Form = {
  fullName: "", section: "", department: "", email: "", phone: "", password: "", confirm: "",
};

const FIELD_ORDER: Record<"signup" | "profile", Record<Role, FieldKey[]>> = {
  signup: {
    student: ["fullName", "section", "email", "phone", "password", "confirm"],
    instructor: ["fullName", "department", "email", "phone", "password", "confirm"],
  },
  profile: {
    student: ["fullName", "section", "phone"],
    instructor: ["fullName", "department", "phone"],
  },
};

const makeRefs = (): Record<FieldKey, RefObject<TextInput | null>> => ({
  fullName: createRef<TextInput>(), section: createRef<TextInput>(), department: createRef<TextInput>(),
  email: createRef<TextInput>(), phone: createRef<TextInput>(), password: createRef<TextInput>(),
  confirm: createRef<TextInput>(),
});

const OTP_COPY: Record<OtpPurpose, string> = {
  signup: "Enter the code we sent to verify your email.",
  google_login: "For your security, enter the code we sent to your Google email.",
  google_signup: "Verify your Google email to continue.",
  reset: "Enter the code to reset your password.",
};

export default function Auth() {

  

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const params = useLocalSearchParams<{ role?: string }>();
  // Never trust the route param blindly: anything that is not "instructor" is a student.
  const role: Role = params.role === "instructor" ? "instructor" : "student";

  const compact = height < 700;
  const topPad = insets.top + (compact ? 8 : 14);
  const bottomPad = Math.max(insets.bottom, 16) + 8;

  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState<Form>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [active, setActive] = useState<FieldKey | null>(null);
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState<{ id: number; type: BannerType; text: string } | null>(null);

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | undefined>();
  const [otpCtx, setOtpCtx] = useState<OtpCtx | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const [profileToken, setProfileToken] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const refs = useRef(makeRefs()).current;
  const otpRef = useRef<TextInput>(null);
  const busyRef = useRef(false);
  const mounted = useRef(true);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (bannerTimer.current) clearTimeout(bannerTimer.current);
    };
  }, []);

  /* ---------- helpers ---------- */

  const showBanner = useCallback((type: BannerType, text: string) => {
    if (bannerTimer.current) clearTimeout(bannerTimer.current);
    setBanner({ id: Date.now(), type, text });
    bannerTimer.current = setTimeout(() => {
      if (mounted.current) setBanner(null);
    }, BANNER_MS);
  }, []);

  const setField = (key: FieldKey, value: string) => {
    setForm((f) => ({ ...f, [key]: key === "section" ? value.toUpperCase() : value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e)); // typing also clears the error
  };

  const clearError = (key: FieldKey) => setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));

  const applyErrors = (errs: FieldErrors, order: FieldKey[]) => {
    setErrors(errs);
    const first = order.find((k) => errs[k]);
    if (first) refs[first].current?.focus();
  };

  const goMode = (next: Mode) => {
    setMode(next);
    setErrors({});
    setOtp("");
    setOtpError(undefined);
    setActive(null);
    setForm((f) => ({ ...f, password: "", confirm: "" })); // never keep secrets between screens
  };

  const bind = (key: FieldKey) => ({
    ref: refs[key],
    value: form[key],
    error: errors[key],
    onChangeText: (v: string) => setField(key, v),
    onClearError: () => clearError(key),
    onFocus: () => setActive(key),
    onBlur: () => setActive((cur) => (cur === key ? null : cur)),
  });

  const next = (key: FieldKey) => () => refs[key].current?.focus();

  const handleError = (e: unknown) => {
    if (!isAuthError(e)) {
      showBanner("error", "Something went wrong. Please try again."); // no internals leaked to the UI
      return;
    }
    if (__DEV__) console.warn("[auth]", e.code); // code only: never log emails, passwords or OTPs

    if (e.fields) applyErrors(e.fields, FIELD_ORDER.signup[role]);

    if (e.code === "OTP_INVALID" || e.code === "OTP_LOCKED") {
      setOtpError(e.message);
      setOtp("");
      setTimeout(() => otpRef.current?.focus(), 50);
    } else if (e.code === "OTP_EXPIRED" && mode === "verify") {
      setOtpError(e.message);
      setOtp("");
      setResendIn(0);
    }
    if (e.code === "EMAIL_NOT_VERIFIED") {
      void sendVerificationAgain();
      return;
    }
    if (e.code === "ACCOUNT_PENDING") goMode("login");
    showBanner("error", e.message);
  };

  /** Single-flight wrapper: blocks double taps and never updates state after unmount. */
  const guard = async (fn: () => Promise<void>) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      if (mounted.current) handleError(e);
    } finally {
      busyRef.current = false;
      if (mounted.current) setBusy(false);
    }
  };

  const onAuthenticated = (session: Session) => {
    // TODO: persist session.accessToken with expo-secure-store (never AsyncStorage), then navigate.
    router.replace(HOME_ROUTE);
    void session;
  };

  const startOtp = (email: string, purpose: OtpPurpose, info: OtpInfo, message?: string) => {
    setOtpCtx({ email, purpose });
    setDevCode(info.devCode ?? null);
    setResendIn(info.resendInSec);
    goMode("verify");
    showBanner("info", message ?? `We sent a 6-digit code to ${email}.`);
    setTimeout(() => otpRef.current?.focus(), 300);
  };

  /* ---------- actions ---------- */

  const submitLogin = () =>
    guard(async () => {
      const errs = validateAll(["email", "password"], form, { role, strict: false });
      if (Object.keys(errs).length) {
        applyErrors(errs, ["email", "password"]);
        showBanner("error", "Please fix the highlighted fields.");
        return;
      }
      onAuthenticated(await login({ email: form.email, password: form.password, role }));
    });

  const sendVerificationAgain = async () => {
    try {
      const info = await resendOtp(form.email, "signup");
      if (mounted.current) startOtp(form.email.trim().toLowerCase(), "signup", info);
    } catch (e) {
      if (mounted.current) handleError(e);
    }
  };

  const submitSignup = () =>
    guard(async () => {
      const keys = FIELD_ORDER.signup[role];
      const errs = validateAll(keys, form, { role });
      if (Object.keys(errs).length) {
        applyErrors(errs, keys);
        showBanner("error", "Please fix the highlighted fields.");
        return;
      }
      const res = await register({
        role,
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        section: form.section,
        department: form.department,
        phone: form.phone,
      });
      startOtp(res.email, "signup", res);
    });

  const submitGoogle = () =>
    guard(async () => {
      const res = await loginWithGoogle(role);
      startOtp(res.email, res.purpose, res);
    });

  const submitOtp = (code: string) =>
    guard(async () => {
      if (!otpCtx) return;
      if (!isOtp(code)) {
        setOtpError("Enter the 6-digit code.");
        return;
      }
      const res = await verifyOtp({ email: otpCtx.email, purpose: otpCtx.purpose, code });
      if (res.kind === "session") {
        onAuthenticated(res.session);
      } else if (res.kind === "needs_profile") {
        setProfileToken(res.profileToken);
        goMode("profile");
        setForm((f) => ({ ...f, fullName: res.fullName, email: otpCtx.email }));
        showBanner("success", "Email verified. Complete your profile to finish.");
      } else {
        setResetToken(res.resetToken);
        goMode("reset");
        showBanner("success", "Code verified. Set your new password.");
      }
    });

  const submitResend = () =>
    guard(async () => {
      if (!otpCtx || resendIn > 0) return;
      const info = await resendOtp(otpCtx.email, otpCtx.purpose);
      setDevCode(info.devCode ?? null);
      setResendIn(info.resendInSec);
      setOtp("");
      setOtpError(undefined);
      showBanner("success", "A new code was sent.");
    });

  const submitProfile = () =>
    guard(async () => {
      const keys = FIELD_ORDER.profile[role];
      const errs = validateAll(keys, form, { role });
      if (Object.keys(errs).length || !profileToken) {
        applyErrors(errs, keys);
        showBanner("error", "Please fix the highlighted fields.");
        return;
      }
      onAuthenticated(
        await completeGoogleProfile({
          profileToken,
          role,
          fullName: form.fullName,
          section: form.section,
          department: form.department,
          phone: form.phone,
        }),
      );
    });

  const submitForgot = () =>
    guard(async () => {
      const errs = validateAll(["email"], form, { role });
      if (errs.email) {
        applyErrors(errs, ["email"]);
        showBanner("error", errs.email);
        return;
      }
      const info = await requestPasswordReset(form.email);
      // Same message whether or not the account exists.
      startOtp(
        form.email.trim().toLowerCase(),
        "reset",
        info,
        "If an account exists for that email, we sent a 6-digit code.",
      );
    });

  const submitReset = () =>
    guard(async () => {
      const errs = validateAll(["password", "confirm"], form, { role });
      if (Object.keys(errs).length || !resetToken) {
        applyErrors(errs, ["password", "confirm"]);
        showBanner("error", "Please fix the highlighted fields.");
        return;
      }
      await resetPassword({ resetToken, newPassword: form.password });
      setResetToken(null);
      goMode("login");
      showBanner("success", "Password updated. You can log in now.");
    });

  /* ---------- timers / navigation ---------- */

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const goBack = () => {
    if (busy) return;
    switch (mode) {
      case "verify":
        goMode(otpCtx?.purpose === "signup" ? "signup" : otpCtx?.purpose === "reset" ? "forgot" : "login");
        break;
      case "forgot":
      case "reset":
      case "profile":
        goMode("login");
        break;
      default:
        router.back();
    }
  };

  /* ---------- render ---------- */

  const HERO: Record<Mode, { title: string; sub: string }> = {
    login: { title: "Welcome back", sub: `Log in to your ${role} account.` },
    signup: { title: "Create account", sub: `Sign up as ${role === "student" ? "a student" : "an instructor"}.` },
    verify: { title: "Verify your email", sub: OTP_COPY[otpCtx?.purpose ?? "signup"] },
    forgot: { title: "Forgot password?", sub: "Enter your email and we will send you a code." },
    reset: { title: "New password", sub: "Choose a strong password you have not used before." },
    profile: { title: "Almost done", sub: "Tell us a bit more so your account is ready." },
  };

  const showMeter = active === "password" && !isStrongPassword(form.password);
  const roleField: FieldKey = role === "student" ? "section" : "department";
  const hero = HERO[mode];

  const roleFieldNode = (
    <Field
      {...bind(roleField)}
      label={role === "student" ? "Section" : "Department"}
      placeholder={role === "student" ? "e.g. BSIT 3-A" : "e.g. College of Computing"}
      autoCapitalize={role === "student" ? "characters" : "words"}
      maxLength={role === "student" ? 20 : 80}
      returnKeyType="next"
      onSubmitEditing={next(mode === "profile" ? "phone" : "email")}
    />
  );

  const phoneNode = (last: boolean) => (
    <Field
      {...bind("phone")}
      label="Mobile number"
      optional
      placeholder="09123456789"
      keyboardType="phone-pad"
      autoComplete="tel"
      textContentType="telephoneNumber"
      maxLength={16}
      returnKeyType={last ? "done" : "next"}
      onSubmitEditing={last ? submitProfile : next("password")}
    />
  );

  const emailNode = (last: boolean, onDone: () => void) => (
    <Field
      {...bind("email")}
      label="Email"
      placeholder="you@school.edu.ph"
      keyboardType="email-address"
      autoCapitalize="none"
      autoCorrect={false}
      autoComplete="email"
      textContentType="emailAddress"
      maxLength={254}
      returnKeyType={last ? "done" : "next"}
      onSubmitEditing={last ? onDone : next(mode === "login" ? "password" : "phone")}
    />
  );

  return (
    <View style={s.root}>
      {banner ? <Banner key={banner.id} type={banner.type} text={banner.text} top={insets.top + 8} /> : null}

      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          style={s.flex}
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
        >
          {/* Hero */}
          <View style={[s.hero, { paddingTop: topPad, paddingBottom: compact ? 22 : 30 }]}>
            <View style={s.blobA} />
            <View style={s.blobB} />
            <Pressable
              onPress={goBack}
              hitSlop={12}
              style={[s.back, { top: topPad }]}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={22} color={C.white} />
            </Pressable>
            <View style={[s.logoRing, compact && s.logoRingCompact]}>
              <Image source={STUDIA_LOGO} style={[s.logo, compact && s.logoCompact]} contentFit="contain" alt="Studia logo" />
            </View>
            <Text style={[s.heroTitle, compact && s.heroTitleCompact]}>{hero.title}</Text>
            <Text style={s.heroSub}>{hero.sub}</Text>
          </View>

          {/* Card */}
          <View style={s.card}>
            {mode === "login" || mode === "signup" ? (
              <View style={s.tabs} accessibilityRole="tablist">
                {(["login", "signup"] as const).map((m) => (
                  <Pressable
                    key={m}
                    disabled={busy}
                    onPress={() => goMode(m)}
                    style={[s.tab, mode === m && s.tabActive]}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: mode === m }}
                  >
                    <Text style={[s.tabText, mode === m && s.tabTextActive]}>
                      {m === "login" ? "Log in" : "Sign up"}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}

            {/* LOGIN */}
            {mode === "login" ? (
              <>
                {emailNode(false, submitLogin)}
                <Field
                  {...bind("password")}
                  label="Password"
                  secure
                  placeholder="Your password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="current-password"
                  textContentType="password"
                  maxLength={64}
                  returnKeyType="done"
                  onSubmitEditing={submitLogin}
                />
                <Pressable onPress={() => goMode("forgot")} hitSlop={8} style={s.linkRight} accessibilityRole="button">
                  <Text style={s.link}>Forgot password?</Text>
                </Pressable>
                <AppButton label={busy ? "Please wait…" : "Log in"} onPress={submitLogin} disabled={busy} />
              </>
            ) : null}

            {/* SIGNUP */}
            {mode === "signup" ? (
              <>
                <Field
                  {...bind("fullName")}
                  label="Full name"
                  placeholder="Juan Dela Cruz"
                  autoCapitalize="words"
                  autoComplete="name"
                  textContentType="name"
                  maxLength={80}
                  returnKeyType="next"
                  onSubmitEditing={next(roleField)}
                />
                {roleFieldNode}
                {emailNode(false, submitSignup)}
                {phoneNode(false)}
                <Field
                  {...bind("password")}
                  label="Password"
                  secure
                  placeholder="Create a password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  maxLength={64}
                  returnKeyType="next"
                  onSubmitEditing={next("confirm")}
                />
                {showMeter ? <PasswordMeter password={form.password} /> : null}
                <Field
                  {...bind("confirm")}
                  label="Confirm password"
                  secure
                  placeholder="Re-enter your password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  maxLength={64}
                  returnKeyType="done"
                  onSubmitEditing={submitSignup}
                />
                <AppButton label={busy ? "Please wait…" : "Create account"} onPress={submitSignup} disabled={busy} />
              </>
            ) : null}

            {/* GOOGLE (login + signup only) */}
            {mode === "login" || mode === "signup" ? (
              <>
                <View style={s.divider}>
                  <View style={s.dividerLine} />
                  <Text style={s.dividerText}>or</Text>
                  <View style={s.dividerLine} />
                </View>
                <Pressable
                  onPress={submitGoogle}
                  disabled={busy}
                  accessibilityRole="button"
                  accessibilityLabel="Continue with Google"
                  style={({ pressed }) => [s.google, pressed && !busy && { opacity: 0.85 }, busy && { opacity: 0.6 }]}
                >
                  <Ionicons name="logo-google" size={18} color={C.text} />
                  <Text style={s.googleText}>Continue with Google</Text>
                </Pressable>
                <Text style={s.switchText}>
                  {mode === "login" ? "New to STUDIA? " : "Already have an account? "}
                  <Text style={s.link} onPress={() => !busy && goMode(mode === "login" ? "signup" : "login")}>
                    {mode === "login" ? "Create an account" : "Log in"}
                  </Text>
                </Text>
              </>
            ) : null}

            {/* VERIFY OTP */}
            {mode === "verify" ? (
              <>
                <View style={s.mailBadge}>
                  <Ionicons name="mail-open" size={26} color={C.primary} />
                </View>
                <Text style={s.centerText}>
                  Code sent to <Text style={s.bold}>{otpCtx?.email}</Text>
                </Text>
                <OtpInput
                  ref={otpRef}
                  value={otp}
                  onChange={(v) => {
                    setOtp(v);
                    if (otpError) setOtpError(undefined);
                  }}
                  onComplete={submitOtp}
                  onClearError={() => setOtpError(undefined)}
                  error={otpError}
                  disabled={busy}
                />
                <AppButton
                  label={busy ? "Verifying…" : "Verify"}
                  onPress={() => submitOtp(otp)}
                  disabled={busy || otp.length !== 6}
                />
                <View style={s.resendRow}>
                  <Text style={s.muted}>Did not get it? </Text>
                  <Pressable onPress={submitResend} disabled={busy || resendIn > 0} hitSlop={8} accessibilityRole="button">
                    <Text style={[s.link, resendIn > 0 && { color: C.muted }]}>
                      {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                    </Text>
                  </Pressable>
                </View>
                {__DEV__ && devCode ? (
                  <View style={s.devBox}>
                    <Text style={s.devText}>DEV ONLY (mock): your code is {devCode}</Text>
                  </View>
                ) : null}
              </>
            ) : null}

            {/* FORGOT */}
            {mode === "forgot" ? (
              <>
                {emailNode(true, submitForgot)}
                <AppButton label={busy ? "Please wait…" : "Send code"} onPress={submitForgot} disabled={busy} />
              </>
            ) : null}

            {/* RESET */}
            {mode === "reset" ? (
              <>
                <Field
                  {...bind("password")}
                  label="New password"
                  secure
                  placeholder="Create a new password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  maxLength={64}
                  returnKeyType="next"
                  onSubmitEditing={next("confirm")}
                />
                {showMeter ? <PasswordMeter password={form.password} /> : null}
                <Field
                  {...bind("confirm")}
                  label="Confirm new password"
                  secure
                  placeholder="Re-enter your password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  maxLength={64}
                  returnKeyType="done"
                  onSubmitEditing={submitReset}
                />
                <AppButton label={busy ? "Please wait…" : "Update password"} onPress={submitReset} disabled={busy} />
              </>
            ) : null}

            {/* GOOGLE PROFILE (new Google accounts, after OTP) */}
            {mode === "profile" ? (
              <>
                <View style={s.emailChip}>
                  <Ionicons name="logo-google" size={16} color={C.primary} />
                  <Text style={s.emailChipText} numberOfLines={1}>{form.email}</Text>
                  <Ionicons name="checkmark-circle" size={16} color={C.green} />
                </View>
                <Field
                  {...bind("fullName")}
                  label="Full name"
                  autoCapitalize="words"
                  autoComplete="name"
                  maxLength={80}
                  returnKeyType="next"
                  onSubmitEditing={next(roleField)}
                />
                {roleFieldNode}
                {phoneNode(true)}
                <AppButton label={busy ? "Please wait…" : "Finish setup"} onPress={submitProfile} disabled={busy} />
              </>
            ) : null}
          </View>

          <View style={[s.footer, { paddingBottom: bottomPad }]}>
            <Image source={OMSC_LOGO} style={s.footerLogo} contentFit="contain" accessible={false} />
            <Text style={s.footerText}>Occidental Mindoro State University – Mamburao Campus</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  root: { flex: 1, backgroundColor: C.surface },
  scrollContent: { flexGrow: 1 },

  hero: {
    backgroundColor: C.primaryDark,
    alignItems: "center",
    paddingHorizontal: 24,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: "hidden",
    gap: 6,
  },
  blobA: { position: "absolute", width: 240, height: 240, borderRadius: 120, backgroundColor: C.primary, opacity: 0.45, top: -90, right: -70 },
  blobB: { position: "absolute", width: 170, height: 170, borderRadius: 85, backgroundColor: C.lavender, opacity: 0.12, bottom: -60, left: -50 },
  back: {
    position: "absolute", left: 16, width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center", zIndex: 2,
  },
  logoRing: {
    width: 76, height: 76, borderRadius: 38, backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center", marginTop: 6,
  },
  logoRingCompact: { width: 58, height: 58, borderRadius: 29, marginTop: 2 },
  logo: { width: 54, height: 54 },
  logoCompact: { width: 40, height: 40 },
  heroTitle: { color: C.white, fontSize: 24, lineHeight: 32, fontFamily: "Poppins_700Bold", textAlign: "center", marginTop: 4 },
  heroTitleCompact: { fontSize: 21, lineHeight: 28 },
  heroSub: { color: C.lavender, fontSize: 13, lineHeight: 19, fontFamily: "Poppins_400Regular", textAlign: "center", maxWidth: 320 },

  card: { width: "100%", maxWidth: 560, alignSelf: "center", padding: 22, gap: 14 },

  tabs: { flexDirection: "row", padding: 4, borderRadius: 14, backgroundColor: C.lavenderSoft },
  tab: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 11 },
  tabActive: { backgroundColor: C.white },
  tabText: { color: C.muted, fontSize: 13.5, fontFamily: "Poppins_600SemiBold" },
  tabTextActive: { color: C.primaryDark },

  linkRight: { alignSelf: "flex-end", marginTop: -4 },
  link: { color: C.primary, fontSize: 13, fontFamily: "Poppins_600SemiBold" },

  divider: { flexDirection: "row", alignItems: "center", gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { color: C.muted, fontSize: 12.5, fontFamily: "Poppins_400Regular" },
  google: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 15,
    borderRadius: 14, borderWidth: 1, borderColor: C.border, backgroundColor: C.white,
  },
  googleText: { color: C.text, fontSize: 15, fontFamily: "Poppins_600SemiBold" },

  switchText: { color: C.muted, fontSize: 13, textAlign: "center", fontFamily: "Poppins_400Regular" },

  mailBadge: {
    alignSelf: "center", width: 56, height: 56, borderRadius: 18, backgroundColor: C.lavenderSoft,
    alignItems: "center", justifyContent: "center",
  },
  centerText: { color: C.muted, fontSize: 13, textAlign: "center", fontFamily: "Poppins_400Regular" },
  bold: { color: C.text, fontFamily: "Poppins_600SemiBold" },
  resendRow: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  muted: { color: C.muted, fontSize: 13, fontFamily: "Poppins_400Regular" },
  devBox: { padding: 10, borderRadius: 12, borderWidth: 1, borderStyle: "dashed", borderColor: C.orange, backgroundColor: "#FFF6EC" },
  devText: { color: C.orange, fontSize: 12, textAlign: "center", fontFamily: "Poppins_600SemiBold" },

  emailChip: {
    flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 14,
    backgroundColor: C.lavenderSoft, borderWidth: 1, borderColor: C.lavender,
  },
  emailChipText: { flex: 1, color: C.text, fontSize: 13.5, fontFamily: "Poppins_600SemiBold" },

  footer: { alignItems: "center", gap: 8, paddingTop: 8, paddingHorizontal: 24, marginTop: "auto" },
  footerLogo: { width: 34, height: 34 },
  footerText: { color: C.muted, fontSize: 11.5, textAlign: "center", fontFamily: "Poppins_400Regular" },
});