// app-button.tsx

// import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

// import { C } from '@/constants/studia-colors';

// type Variant = 'primary' | 'secondary';

// type AppButtonProps = Omit<PressableProps, 'children' | 'style'> & {
//   label: string;
//   variant?: Variant;
// };

// export function AppButton({ label, variant = 'primary', ...rest }: AppButtonProps) {
//   return (
//     <Pressable
//       accessibilityRole="button"
//       accessibilityLabel={label}
//       style={({ pressed }) => [s.base, s[variant], pressed && s.pressed]}
//       {...rest}>
//       <Text style={[s.label, variant === 'primary' ? s.labelPrimary : s.labelSecondary]}>
//         {label}
//       </Text>
//     </Pressable>
//   );
// }

// const s = StyleSheet.create({
//   base: {
//     borderRadius: 14,
//     paddingVertical: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   primary: {
//     backgroundColor: C.primary,
//     shadowColor: C.primaryDark,
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 4,
//   },
//   secondary: {
//     backgroundColor: C.lavenderSoft,
//     borderWidth: 1,
//     borderColor: C.lavender,
//   },
//   pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
//   label: { fontSize: 16, fontFamily: 'Poppins_600SemiBold' },
//   labelPrimary: { color: C.white },
//   labelSecondary: { color: C.primaryDark },

  
// });
import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { C } from '@/constants/studia-colors';

type Variant = 'primary' | 'secondary';

type AppButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: Variant;
};

export function AppButton({ label, variant = 'primary', disabled, ...rest }: AppButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      style={({ pressed }) => [
        s.base,
        s[variant],
        pressed && s.pressed,
        disabled && s.disabled,
      ]}
      {...rest}>
      <Text style={[s.label, variant === 'primary' ? s.labelPrimary : s.labelSecondary]}>
        {label}
      </Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  base: {
    borderRadius: 14,
    borderWidth: 1, // pareho sa dalawa para pantay ang taas
    borderColor: 'transparent',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: C.primary,
    shadowColor: C.primaryDark,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  secondary: {
    backgroundColor: C.lavenderSoft,
    borderColor: C.lavender,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.5 },
  label: { fontSize: 16, fontFamily: 'Poppins_600SemiBold' },
  labelPrimary: { color: C.white },
  labelSecondary: { color: C.primaryDark },
});