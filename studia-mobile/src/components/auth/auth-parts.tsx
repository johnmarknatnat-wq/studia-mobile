// components/auth/auth-parts.tsx
import { Ionicons } from "@expo/vector-icons";
import { forwardRef, useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Pressable,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

import { C } from "@/constants/studia-colors";
import { PASSWORD_RULES, passwordScore } from "@/lib/auth-validation";

/* ───────────── Banner (parent auto-dismisses it) ───────────── */

export type BannerType = "error" | "success" | "info";

const BANNER_STYLE: Record<BannerType, { bg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  error: { bg: C.red, icon: "alert-circle" },
  success: { bg: C.green, icon: "checkmark-circle" },
  info: { bg: C.primary, icon: "mail" },
};

export function Banner({ type, text, top }: { type: BannerType; text: string; top: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [text, anim]);

  const { bg, icon } = BANNER_STYLE[type];
  return (
    <Animated.View
      pointerEvents="none"
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
      style={[
        s.banner,
        {
          top,
          backgroundColor: bg,
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-14, 0] }) }],
        },
      ]}
    >
      <Ionicons name={icon} size={20} color={C.white} />
      <Text style={s.bannerText}>{text}</Text>
    </Animated.View>
  );
}

/* ───────────── Field ───────────── */

type FieldProps = Omit<TextInputProps, "style" | "secureTextEntry" | "onPressIn"> & {
  label: string;
  error?: string;
  secure?: boolean;
  optional?: boolean;
  /** Called when the person taps the field, so the parent can clear its red error. */
  onClearError?: () => void;
};

export const Field = forwardRef<TextInput, FieldProps>(function Field(
  { label, error, secure, optional, onClearError, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <View style={s.fieldWrap}>
      <Text style={s.label}>
        {label}
        {optional ? <Text style={s.optional}> (optional)</Text> : null}
      </Text>

      <View style={[s.inputRow, focused && s.inputFocused, !!error && s.inputError]}>
        <TextInput
          ref={ref}
          {...rest}
          style={s.input}
          placeholderTextColor={C.muted}
          secureTextEntry={!!secure && !visible}
          accessibilityLabel={label}
          // onPressIn = a real tap. Programmatic focus() (used to jump to the first invalid field)
          // does not fire it, so the red state stays until the person actually touches the field.
          onPressIn={onClearError}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
        />
        {secure ? (
          <Pressable
            onPress={() => setVisible((v) => !v)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={visible ? "Hide password" : "Show password"}
          >
            <Ionicons name={visible ? "eye-off-outline" : "eye-outline"} size={20} color={C.muted} />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <View style={s.errRow} accessibilityLiveRegion="polite">
          <Ionicons name="alert-circle" size={14} color={C.red} />
          <Text style={s.errText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
});

/* ───────────── Password strength meter ───────────── */

const SCORE_COLOR = [C.border, C.red, C.red, C.orange, C.gold, C.green];
const SCORE_LABEL = ["", "Very weak", "Weak", "Fair", "Good", "Strong"];

/** Parent decides when to show it (field active and password not yet strong). */
export function PasswordMeter({ password }: { password: string }) {
  const score = passwordScore(password);
  const color = SCORE_COLOR[score];

  return (
    <View style={s.meter} accessibilityLiveRegion="polite">
      <View style={s.meterBars}>
        {PASSWORD_RULES.map((r, i) => (
          <View key={r.id} style={[s.meterBar, { backgroundColor: i < score ? color : C.border }]} />
        ))}
      </View>
      <Text style={[s.meterLabel, { color: score ? color : C.muted }]}>
        {score ? `Password strength: ${SCORE_LABEL[score]}` : "Create a strong password"}
      </Text>
      {PASSWORD_RULES.map((r) => {
        const ok = r.test(password);
        return (
          <View key={r.id} style={s.ruleRow}>
            <Ionicons
              name={ok ? "checkmark-circle" : "ellipse-outline"}
              size={15}
              color={ok ? C.green : C.muted}
            />
            <Text style={[s.ruleText, ok && { color: C.text }]}>{r.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

/* ───────────── OTP boxes (one invisible input on top for paste / autofill) ───────────── */

type OtpProps = {
  value: string;
  onChange: (v: string) => void;
  onComplete: (v: string) => void;
  onClearError?: () => void;
  error?: string;
  disabled?: boolean;
  length?: number;
};

export const OtpInput = forwardRef<TextInput, OtpProps>(function OtpInput(
  { value, onChange, onComplete, onClearError, error, disabled, length = 6 },
  ref,
) {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <View style={s.otpRow}>
        {Array.from({ length }, (_, i) => {
          const active = focused && i === Math.min(value.length, length - 1);
          return (
            <View key={i} style={[s.otpBox, active && s.otpBoxActive, !!error && s.otpBoxError]}>
              <Text style={s.otpDigit}>{value[i] ?? ""}</Text>
            </View>
          );
        })}
        <TextInput
          ref={ref}
          value={value}
          editable={!disabled}
          onChangeText={(t) => {
            const digits = t.replace(/\D/g, "").slice(0, length);
            onChange(digits);
            if (digits.length === length) onComplete(digits);
          }}
          onPressIn={onClearError}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          maxLength={length}
          caretHidden
          style={s.otpHidden}
          accessibilityLabel={`${length}-digit verification code`}
        />
      </View>
      {error ? (
        <View style={[s.errRow, { justifyContent: "center", marginTop: 10 }]} accessibilityLiveRegion="polite">
          <Ionicons name="alert-circle" size={14} color={C.red} />
          <Text style={s.errText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
});

const s = StyleSheet.create({
  banner: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    maxWidth: 560,
    alignSelf: "center",
    shadowColor: C.text,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  bannerText: { flex: 1, color: C.white, fontSize: 13, lineHeight: 19, fontFamily: "Poppins_600SemiBold" },

  fieldWrap: { gap: 6 },
  label: { color: C.text, fontSize: 13, fontFamily: "Poppins_600SemiBold" },
  optional: { color: C.muted, fontFamily: "Poppins_400Regular" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 52,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  inputFocused: { borderColor: C.primary, backgroundColor: C.lavenderSoft },
  inputError: { borderColor: C.red, backgroundColor: "#FDF1F1" },
  input: { flex: 1, color: C.text, fontSize: 14.5, fontFamily: "Poppins_400Regular", paddingVertical: 10 },
  errRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  errText: { flexShrink: 1, color: C.red, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_400Regular" },

  meter: {
    gap: 6,
    padding: 14,
    borderRadius: 14,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  meterBars: { flexDirection: "row", gap: 5 },
  meterBar: { flex: 1, height: 5, borderRadius: 3 },
  meterLabel: { fontSize: 12.5, fontFamily: "Poppins_600SemiBold" },
  ruleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  ruleText: { color: C.muted, fontSize: 12, fontFamily: "Poppins_400Regular" },

  otpRow: { flexDirection: "row", justifyContent: "center", gap: 10 },
  otpBox: {
    width: 46,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },
  otpBoxActive: { borderColor: C.primary, backgroundColor: C.lavenderSoft },
  otpBoxError: { borderColor: C.red, backgroundColor: "#FDF1F1" },
  otpDigit: { color: C.text, fontSize: 22, fontFamily: "Poppins_700Bold" },
  otpHidden: { ...StyleSheet.absoluteFillObject, opacity: 0 },
});