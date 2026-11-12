// // app/explore.tsx
// import { Ionicons } from "@expo/vector-icons";
// import { Image } from "expo-image";
// import { useRouter } from "expo-router";
// import { useEffect, useRef, useState } from "react";
// import {
//   Animated,
//   Easing,
//   Modal,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   useWindowDimensions,
//   View,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// import { AppButton } from "@/components/ui/app-button";
// import { C } from "@/constants/studia-colors";

// const STUDIA_LOGO = require("@/assets/images/studia-mobile-logo.png");
// const STUDENT_ICON = require("@/assets/images/student.png");
// const INSTRUCTOR_ICON = require("@/assets/images/instructor.png");

// type Role = "student" | "instructor";

// const ROLES: { id: Role; title: string; desc: string; icon: number }[] = [
//   {
//     id: "student",
//     title: "Student",
//     desc: "Access your courses, materials, quizzes, and AI learning assistant.",
//     icon: STUDENT_ICON,
//   },
//   {
//     id: "instructor",
//     title: "Instructor",
//     desc: "Manage courses, materials, assessments, and monitor student progress.",
//     icon: INSTRUCTOR_ICON,
//   },
// ];

// // Placeholder copy: ipa-review sa school/DPO bago i-release.
// const TERMS: { title: string; body: string }[] = [
//   {
//     title: "1. Using STUDIA",
//     body: "STUDIA Mobile is provided by Occidental Mindoro State University – Mamburao Campus for learning and academic activities. Use your own account, keep your login private, and do not upload content you do not have the right to share.",
//   },
//   {
//     title: "2. Information we collect",
//     body: "We collect your name, school email, role, course enrollments, submissions, quiz results, and app activity so the app can work and your instructors can follow your progress.",
//   },
//   {
//     title: "3. AI features",
//     body: "Lecture videos, documents, and text you upload may be processed by AI services to create transcripts, summaries, study plans, and quizzes. AI output can contain mistakes, so double-check important details.",
//   },
//   {
//     title: "4. How your data is used",
//     body: "Your data is used only for academic and app-improvement purposes. We do not sell your personal information. Access is limited to authorized school personnel and the services needed to run the app.",
//   },
//   {
//     title: "5. Your rights",
//     body: "Under the Data Privacy Act of 2012 (RA 10173), you may ask to access, correct, or request deletion of your personal data. Contact the campus data protection officer for any request.",
//   },
//   {
//     title: "6. Changes",
//     body: "We may update these terms and the privacy policy. We will notify you in the app when something important changes.",
//   },
// ];

// export default function ExploreScreen() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { height } = useWindowDimensions();

//   const [consentOpen, setConsentOpen] = useState(true);
//   const [agreed, setAgreed] = useState(false);
//   const [role, setRole] = useState<Role | null>(null);

//   // 0 = hidden, 1 = shown. Isang value lang ang nagpapagalaw ng backdrop at sheet.
//   const progress = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.timing(progress, {
//       toValue: 1,
//       duration: 360,
//       easing: Easing.out(Easing.cubic),
//       useNativeDriver: true,
//     }).start();
//   }, [progress]);

//   const closeSheet = (onDone: () => void) => {
//     Animated.timing(progress, {
//       toValue: 0,
//       duration: 260,
//       easing: Easing.in(Easing.cubic),
//       useNativeDriver: true,
//     }).start(({ finished }) => {
//       if (finished) onDone();
//     });
//   };

//   const handleAgree = () => {
//     if (!agreed) return;
//     closeSheet(() => setConsentOpen(false));
//   };

//   const handleDecline = () => {
//     closeSheet(() => {
//       setConsentOpen(false);
//       router.back();
//     });
//   };

//   const handleContinue = () => {
//     if (!role) return;
//     // TODO: palitan kapag gawa na ang login/register screen
//     // router.push({ pathname: "/login", params: { role } });
//     console.log("Selected role:", role);
//   };

//   const translateY = progress.interpolate({
//     inputRange: [0, 1],
//     outputRange: [height * 0.6, 0],
//   });

//   const ctaLabel = role ? `Continue as ${role}` : "Select role";

//   return (
//     <View style={s.root}>
//       {/* Hero */}
//       <View style={[s.hero, { paddingTop: insets.top + 14 }]}>
//         <View style={s.blobA} />
//         <View style={s.blobB} />

//         <Pressable
//           onPress={() => router.back()}
//           hitSlop={12}
//           style={[s.back, { top: insets.top + 14 }]}
//           accessibilityRole="button"
//           accessibilityLabel="Go back"
//         >
//           <Ionicons name="chevron-back" size={22} color={C.white} />
//         </Pressable>

//         <View style={s.logoRing}>
//           <Image source={STUDIA_LOGO} style={s.logo} contentFit="contain" alt="Studia logo" />
//         </View>
//         <Text style={s.heroTitle}>Choose account type</Text>
//         <Text style={s.heroSub}>Select the role that matches how you will use STUDIA.</Text>
//       </View>

//       {/* Role cards */}
//       <ScrollView
//         style={s.list}
//         contentContainerStyle={s.listContent}
//         showsVerticalScrollIndicator={false}
//         bounces={false}
//         overScrollMode="never"
//       >
//         {ROLES.map((r) => {
//           const selected = role === r.id;
//           return (
//             <Pressable
//               key={r.id}
//               onPress={() => setRole(r.id)}
//               accessibilityRole="radio"
//               accessibilityState={{ selected }}
//               accessibilityLabel={`${r.title}. ${r.desc}`}
//               style={({ pressed }) => [
//                 s.roleCard,
//                 selected && s.roleCardActive,
//                 pressed && s.roleCardPressed,
//               ]}
//             >
//               <View style={[s.roleIcon, selected && s.roleIconActive]}>
//                 <Image source={r.icon} style={s.roleIconImg} contentFit="contain" accessible={false} />
//               </View>
//               <View style={s.roleText}>
//                 <Text style={s.roleTitle}>{r.title}</Text>
//                 <Text style={s.roleDesc}>{r.desc}</Text>
//               </View>
//               <View style={[s.radio, selected && s.radioActive]}>
//                 {selected && <Ionicons name="checkmark" size={14} color={C.white} />}
//               </View>
//             </Pressable>
//           );
//         })}
//       </ScrollView>

//       {/* CTA */}
//       <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
//         {/* <View style={{ opacity: role ? 1 : 0.5 }} pointerEvents={role ? "auto" : "none"}>
//           <AppButton label={ctaLabel} onPress={handleContinue} />
//         </View> */}
//         {role ? (
//   <AppButton label={ctaLabel} onPress={handleContinue} />
// ) : (
//   <View style={s.ctaDisabled} accessibilityRole="button" accessibilityState={{ disabled: true }}>
//     <Text style={s.ctaDisabledText}>Select role</Text>
//   </View>
// )}
//       </View>

//       {/* Terms & privacy sheet */}
//       <Modal
//         visible={consentOpen}
//         transparent
//         animationType="none"
//         statusBarTranslucent
//         onRequestClose={handleDecline}
//       >
//         <View style={s.modalRoot}>
//           <Animated.View style={[StyleSheet.absoluteFill, s.backdrop, { opacity: progress }]} />

//           <Animated.View
//             style={[
//               s.sheet,
//               {
//                 maxHeight: height * 0.86,
//                 paddingBottom: Math.max(insets.bottom, 16) + 8,
//                 transform: [{ translateY }],
//               },
//             ]}
//           >
//             <View style={s.handle} />

//             <View style={s.sheetBadge}>
//               <Ionicons name="shield-checkmark" size={26} color={C.primary} />
//             </View>
//             <Text style={s.sheetTitle}>Terms and privacy</Text>
//             <Text style={s.sheetSub}>Please review before creating your account.</Text>

//             <ScrollView style={s.termsBox} contentContainerStyle={s.termsContent} showsVerticalScrollIndicator>
//               {TERMS.map((t) => (
//                 <View key={t.title} style={s.termBlock}>
//                   <Text style={s.termTitle}>{t.title}</Text>
//                   <Text style={s.termBody}>{t.body}</Text>
//                 </View>
//               ))}
//             </ScrollView>

//             <Pressable
//               onPress={() => setAgreed((v) => !v)}
//               style={s.checkRow}
//               accessibilityRole="checkbox"
//               accessibilityState={{ checked: agreed }}
//             >
//               <View style={[s.checkbox, agreed && s.checkboxActive]}>
//                 {agreed && <Ionicons name="checkmark" size={16} color={C.white} />}
//               </View>
//               <Text style={s.checkText}>
//                 I have read and agree to the Terms and Conditions and the Privacy Policy.
//               </Text>
//             </Pressable>

//             {/* <View style={{ opacity: agreed ? 1 : 0.5 }} pointerEvents={agreed ? "auto" : "none"}>
//               <AppButton label="Agree and continue" onPress={handleAgree} />
//             </View> */}
//             {agreed ? (
//   <AppButton label="Agree and continue" onPress={handleAgree} />
// ) : (
//   <View style={s.ctaDisabled} accessibilityRole="button" accessibilityState={{ disabled: true }}>
//     <Text style={s.ctaDisabledText}>Agree and continue</Text>
//   </View>
// )}

//             <Pressable onPress={handleDecline} hitSlop={8} style={s.decline} accessibilityRole="button">
//               <Text style={s.declineText}>Decline</Text>
//             </Pressable>
//           </Animated.View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const s = StyleSheet.create({
//   root: { flex: 1, backgroundColor: C.surface },

//   /* Hero (same language as learn-more) */
//   hero: {
//     backgroundColor: C.primaryDark,
//     alignItems: "center",
//     paddingBottom: 36,
//     paddingHorizontal: 24,
//     borderBottomLeftRadius: 36,
//     borderBottomRightRadius: 36,
//     overflow: "hidden",
//     gap: 8,
//   },
//   blobA: {
//     position: "absolute",
//     width: 240,
//     height: 240,
//     borderRadius: 120,
//     backgroundColor: C.primary,
//     opacity: 0.45,
//     top: -90,
//     right: -70,
//   },
//   blobB: {
//     position: "absolute",
//     width: 170,
//     height: 170,
//     borderRadius: 85,
//     backgroundColor: C.lavender,
//     opacity: 0.12,
//     bottom: -60,
//     left: -50,
//   },
//   back: {
//     position: "absolute",
//     left: 16,
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     backgroundColor: "rgba(255,255,255,0.16)",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 2,
//   },
//   logoRing: {
//     width: 84,
//     height: 84,
//     borderRadius: 42,
//     backgroundColor: "rgba(255,255,255,0.12)",
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.25)",
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 8,
//   },
//   logo: { width: 60, height: 60 },
//   heroTitle: {
//     color: C.white,
//     fontSize: 26,
//     lineHeight: 34,
//     fontFamily: "Poppins_700Bold",
//     textAlign: "center",
//     marginTop: 6,
//   },
//   heroSub: {
//     color: C.lavender,
//     fontSize: 13.5,
//     lineHeight: 20,
//     fontFamily: "Poppins_400Regular",
//     textAlign: "center",
//     maxWidth: 320,
//   },

//   /* Role cards */
//   list: { flex: 1 },
//   listContent: { padding: 20, gap: 14 },
//   roleCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 14,
//     padding: 16,
//     borderRadius: 20,
//     backgroundColor: C.white,
//     borderWidth: 1.5,
//     borderColor: C.border,
//   },
//   roleCardActive: { backgroundColor: C.lavenderSoft, borderColor: C.primary },
//   roleCardPressed: { opacity: 0.92, transform: [{ scale: 0.985 }] },
//   roleIcon: {
//     width: 68,
//     height: 68,
//     borderRadius: 18,
//     backgroundColor: C.lavenderSoft,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   roleIconActive: { backgroundColor: C.white },
//   roleIconImg: { width: 46, height: 46 },
//   roleText: { flex: 1, gap: 2 },
//   roleTitle: { color: C.text, fontSize: 17, fontFamily: "Poppins_700Bold" },
//   roleDesc: { color: C.muted, fontSize: 12.5, lineHeight: 18, fontFamily: "Poppins_400Regular" },
//   radio: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: C.border,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   radioActive: { backgroundColor: C.primary, borderColor: C.primary },

//   ctaDisabled: {
//   height: 58,
//   borderRadius: 18,
//   backgroundColor: C.lavenderSoft,
//   borderWidth: 1,
//   borderColor: C.lavender,
//   alignItems: "center",
//   justifyContent: "center",
// },
// ctaDisabledText: { color: C.muted, fontSize: 16, fontFamily: "Poppins_600SemiBold" },

//   footer: { paddingHorizontal: 24, paddingTop: 12 },

//   /* Consent sheet */
//   modalRoot: { flex: 1, justifyContent: "flex-end" },
//   backdrop: { backgroundColor: "rgba(31,36,56,0.55)" },
//   sheet: {
//     backgroundColor: C.white,
//     borderTopLeftRadius: 28,
//     borderTopRightRadius: 28,
//     paddingHorizontal: 22,
//     paddingTop: 10,
//     gap: 12,
//   },
//   handle: {
//     alignSelf: "center",
//     width: 42,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: C.border,
//     marginBottom: 4,
//   },
//   sheetBadge: {
//     alignSelf: "center",
//     width: 52,
//     height: 52,
//     borderRadius: 16,
//     backgroundColor: C.lavenderSoft,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   sheetTitle: {
//     color: C.text,
//     fontSize: 20,
//     lineHeight: 28,
//     fontFamily: "Poppins_700Bold",
//     textAlign: "center",
//   },
//   sheetSub: {
//     color: C.muted,
//     fontSize: 13,
//     lineHeight: 19,
//     fontFamily: "Poppins_400Regular",
//     textAlign: "center",
//     marginTop: -6,
//   },
//   termsBox: {
//     flexGrow: 0,
//     flexShrink: 1,
//     backgroundColor: C.surface,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: C.border,
//   },
//   termsContent: { padding: 16, gap: 14 },
//   termBlock: { gap: 3 },
//   termTitle: { color: C.text, fontSize: 13.5, fontFamily: "Poppins_600SemiBold" },
//   termBody: { color: C.muted, fontSize: 12.5, lineHeight: 19, fontFamily: "Poppins_400Regular" },

//   checkRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
//   checkbox: {
//     width: 24,
//     height: 24,
//     borderRadius: 7,
//     borderWidth: 2,
//     borderColor: C.primary,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   checkboxActive: { backgroundColor: C.primary },
//   checkText: {
//     flex: 1,
//     color: C.text,
//     fontSize: 12.5,
//     lineHeight: 18,
//     fontFamily: "Poppins_400Regular",
//   },
//   decline: { alignSelf: "center", paddingVertical: 6 },
//   declineText: { color: C.muted, fontSize: 13.5, fontFamily: "Poppins_600SemiBold" },
// });
// components/ui/app-button.tsx
// // app/explore.tsx
// import { Ionicons } from "@expo/vector-icons";
// import { Image } from "expo-image";
// import { useRouter } from "expo-router";
// import { useEffect, useRef, useState } from "react";
// import {
//   Animated,
//   Easing,
//   Modal,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   useWindowDimensions,
//   View,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// import { AppButton } from "@/components/ui/app-button";
// import { C } from "@/constants/studia-colors";

// const STUDIA_LOGO = require("@/assets/images/studia-mobile-logo.png");
// const STUDENT_ICON = require("@/assets/images/student.png");
// const INSTRUCTOR_ICON = require("@/assets/images/instructor.png");

// type Role = "student" | "instructor";

// const ROLES: { id: Role; title: string; desc: string; icon: number }[] = [
//   {
//     id: "student",
//     title: "Student",
//     desc: "Access your courses, materials, quizzes, and AI learning assistant.",
//     icon: STUDENT_ICON,
//   },
//   {
//     id: "instructor",
//     title: "Instructor",
//     desc: "Manage courses, materials, assessments, and monitor student progress.",
//     icon: INSTRUCTOR_ICON,
//   },
// ];

// // Placeholder copy: ipa-review sa school/DPO bago i-release.
// const TERMS: { title: string; body: string }[] = [
//   {
//     title: "1. Using STUDIA",
//     body: "STUDIA Mobile is provided by Occidental Mindoro State University – Mamburao Campus for learning and academic activities. Use your own account, keep your login private, and do not upload content you do not have the right to share.",
//   },
//   {
//     title: "2. Information we collect",
//     body: "We collect your name, school email, role, course enrollments, submissions, quiz results, and app activity so the app can work and your instructors can follow your progress.",
//   },
//   {
//     title: "3. AI features",
//     body: "Lecture videos, documents, and text you upload may be processed by AI services to create transcripts, summaries, study plans, and quizzes. AI output can contain mistakes, so double-check important details.",
//   },
//   {
//     title: "4. How your data is used",
//     body: "Your data is used only for academic and app-improvement purposes. We do not sell your personal information. Access is limited to authorized school personnel and the services needed to run the app.",
//   },
//   {
//     title: "5. Your rights",
//     body: "Under the Data Privacy Act of 2012 (RA 10173), you may ask to access, correct, or request deletion of your personal data. Contact the campus data protection officer for any request.",
//   },
//   {
//     title: "6. Changes",
//     body: "We may update these terms and the privacy policy. We will notify you in the app when something important changes.",
//   },
// ];

// export default function ExploreScreen() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const { height } = useWindowDimensions();

//   const [consentOpen, setConsentOpen] = useState(true);
//   const [agreed, setAgreed] = useState(false);
//   const [role, setRole] = useState<Role | null>(null);

//   // 0 = hidden, 1 = shown. Isang value lang ang nagpapagalaw ng backdrop at sheet.
//   const progress = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.timing(progress, {
//       toValue: 1,
//       duration: 360,
//       easing: Easing.out(Easing.cubic),
//       useNativeDriver: true,
//     }).start();
//   }, [progress]);

//   const closeSheet = (onDone: () => void) => {
//     Animated.timing(progress, {
//       toValue: 0,
//       duration: 260,
//       easing: Easing.in(Easing.cubic),
//       useNativeDriver: true,
//     }).start(({ finished }) => {
//       if (finished) onDone();
//     });
//   };

//   const handleAgree = () => {
//     if (!agreed) return;
//     closeSheet(() => setConsentOpen(false));
//   };

//   const handleDecline = () => {
//     closeSheet(() => {
//       setConsentOpen(false);
//       router.back();
//     });
//   };

//   const handleContinue = () => {
//     if (!role) return;
//     // TODO: palitan kapag gawa na ang login/register screen
//     // router.push({ pathname: "/login", params: { role } });
//     console.log("Selected role:", role);
//   };

//   const translateY = progress.interpolate({
//     inputRange: [0, 1],
//     outputRange: [height * 0.6, 0],
//   });

//   const ctaLabel = role ? `Continue as ${role}` : "Select role";

//   return (
//     <View style={s.root}>
//       {/* Hero */}
//       <View style={[s.hero, { paddingTop: insets.top + 14 }]}>
//         <View style={s.blobA} />
//         <View style={s.blobB} />

//         <Pressable
//           onPress={() => router.back()}
//           hitSlop={12}
//           style={[s.back, { top: insets.top + 14 }]}
//           accessibilityRole="button"
//           accessibilityLabel="Go back"
//         >
//           <Ionicons name="chevron-back" size={22} color={C.white} />
//         </Pressable>

//         <View style={s.logoRing}>
//           <Image source={STUDIA_LOGO} style={s.logo} contentFit="contain" alt="Studia logo" />
//         </View>
//         <Text style={s.heroTitle}>Choose account type</Text>
//         <Text style={s.heroSub}>Select the role that matches how you will use STUDIA.</Text>
//       </View>

//       {/* Role cards */}
//       <ScrollView
//         style={s.list}
//         contentContainerStyle={s.listContent}
//         showsVerticalScrollIndicator={false}
//         bounces={false}
//         overScrollMode="never"
//       >
//         {ROLES.map((r) => {
//           const selected = role === r.id;
//           return (
//             <Pressable
//               key={r.id}
//               onPress={() => setRole(r.id)}
//               accessibilityRole="radio"
//               accessibilityState={{ selected }}
//               accessibilityLabel={`${r.title}. ${r.desc}`}
//               style={({ pressed }) => [
//                 s.roleCard,
//                 selected && s.roleCardActive,
//                 pressed && s.roleCardPressed,
//               ]}
//             >
//               <View style={[s.roleIcon, selected && s.roleIconActive]}>
//                 <Image source={r.icon} style={s.roleIconImg} contentFit="contain" accessible={false} />
//               </View>
//               <View style={s.roleText}>
//                 <Text style={s.roleTitle}>{r.title}</Text>
//                 <Text style={s.roleDesc}>{r.desc}</Text>
//               </View>
//               <View style={[s.radio, selected && s.radioActive]}>
//                 {selected && <Ionicons name="checkmark" size={14} color={C.white} />}
//               </View>
//             </Pressable>
//           );
//         })}
//       </ScrollView>

//       {/* CTA */}
//       <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
//         <AppButton label={ctaLabel} onPress={handleContinue} disabled={!role} />
//       </View>

//       {/* Terms & privacy sheet */}
//       <Modal
//         visible={consentOpen}
//         transparent
//         animationType="none"
//         statusBarTranslucent
//         onRequestClose={handleDecline}
//       >
//         <View style={s.modalRoot}>
//           <Animated.View style={[StyleSheet.absoluteFill, s.backdrop, { opacity: progress }]} />

//           <Animated.View
//             style={[
//               s.sheet,
//               {
//                 maxHeight: height * 0.86,
//                 paddingBottom: Math.max(insets.bottom, 16) + 8,
//                 transform: [{ translateY }],
//               },
//             ]}
//           >
//             <View style={s.handle} />

//             <View style={s.sheetBadge}>
//               <Ionicons name="shield-checkmark" size={26} color={C.primary} />
//             </View>
//             <Text style={s.sheetTitle}>Terms and privacy</Text>
//             <Text style={s.sheetSub}>Please review before creating your account.</Text>

//             <ScrollView style={s.termsBox} contentContainerStyle={s.termsContent} showsVerticalScrollIndicator>
//               {TERMS.map((t) => (
//                 <View key={t.title} style={s.termBlock}>
//                   <Text style={s.termTitle}>{t.title}</Text>
//                   <Text style={s.termBody}>{t.body}</Text>
//                 </View>
//               ))}
//             </ScrollView>

//             <Pressable
//               onPress={() => setAgreed((v) => !v)}
//               style={s.checkRow}
//               accessibilityRole="checkbox"
//               accessibilityState={{ checked: agreed }}
//             >
//               <View style={[s.checkbox, agreed && s.checkboxActive]}>
//                 {agreed && <Ionicons name="checkmark" size={16} color={C.white} />}
//               </View>
//               <Text style={s.checkText}>
//                 I have read and agree to the Terms and Conditions and the Privacy Policy.
//               </Text>
//             </Pressable>

//             <AppButton label="Agree and continue" onPress={handleAgree} disabled={!agreed} />

//             <Pressable onPress={handleDecline} hitSlop={8} style={s.decline} accessibilityRole="button">
//               <Text style={s.declineText}>Decline</Text>
//             </Pressable>
//           </Animated.View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const s = StyleSheet.create({
//   root: { flex: 1, backgroundColor: C.surface },

//   /* Hero (same language as learn-more) */
//   hero: {
//     backgroundColor: C.primaryDark,
//     alignItems: "center",
//     paddingBottom: 36,
//     paddingHorizontal: 24,
//     borderBottomLeftRadius: 36,
//     borderBottomRightRadius: 36,
//     overflow: "hidden",
//     gap: 8,
//   },
//   blobA: {
//     position: "absolute",
//     width: 240,
//     height: 240,
//     borderRadius: 120,
//     backgroundColor: C.primary,
//     opacity: 0.45,
//     top: -90,
//     right: -70,
//   },
//   blobB: {
//     position: "absolute",
//     width: 170,
//     height: 170,
//     borderRadius: 85,
//     backgroundColor: C.lavender,
//     opacity: 0.12,
//     bottom: -60,
//     left: -50,
//   },
//   back: {
//     position: "absolute",
//     left: 16,
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     backgroundColor: "rgba(255,255,255,0.16)",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 2,
//   },
//   logoRing: {
//     width: 84,
//     height: 84,
//     borderRadius: 42,
//     backgroundColor: "rgba(255,255,255,0.12)",
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.25)",
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 8,
//   },
//   logo: { width: 60, height: 60 },
//   heroTitle: {
//     color: C.white,
//     fontSize: 26,
//     lineHeight: 34,
//     fontFamily: "Poppins_700Bold",
//     textAlign: "center",
//     marginTop: 6,
//   },
//   heroSub: {
//     color: C.lavender,
//     fontSize: 13.5,
//     lineHeight: 20,
//     fontFamily: "Poppins_400Regular",
//     textAlign: "center",
//     maxWidth: 320,
//   },

//   /* Role cards */
//   list: { flex: 1 },
//   listContent: { padding: 20, gap: 14 },
//   roleCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 14,
//     padding: 16,
//     borderRadius: 20,
//     backgroundColor: C.white,
//     borderWidth: 1.5,
//     borderColor: C.border,
//   },
//   roleCardActive: { backgroundColor: C.lavenderSoft, borderColor: C.primary },
//   roleCardPressed: { opacity: 0.92, transform: [{ scale: 0.985 }] },
//   roleIcon: {
//     width: 68,
//     height: 68,
//     borderRadius: 18,
//     backgroundColor: C.lavenderSoft,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   roleIconActive: { backgroundColor: C.white },
//   roleIconImg: { width: 46, height: 46 },
//   roleText: { flex: 1, gap: 2 },
//   roleTitle: { color: C.text, fontSize: 17, fontFamily: "Poppins_700Bold" },
//   roleDesc: { color: C.muted, fontSize: 12.5, lineHeight: 18, fontFamily: "Poppins_400Regular" },
//   radio: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: C.border,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   radioActive: { backgroundColor: C.primary, borderColor: C.primary },

//   footer: { paddingHorizontal: 24, paddingTop: 12 },

//   /* Consent sheet */
//   modalRoot: { flex: 1, justifyContent: "flex-end" },
//   backdrop: { backgroundColor: "rgba(31,36,56,0.55)" },
//   sheet: {
//     backgroundColor: C.white,
//     borderTopLeftRadius: 28,
//     borderTopRightRadius: 28,
//     paddingHorizontal: 22,
//     paddingTop: 10,
//     gap: 12,
//   },
//   handle: {
//     alignSelf: "center",
//     width: 42,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: C.border,
//     marginBottom: 4,
//   },
//   sheetBadge: {
//     alignSelf: "center",
//     width: 52,
//     height: 52,
//     borderRadius: 16,
//     backgroundColor: C.lavenderSoft,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   sheetTitle: {
//     color: C.text,
//     fontSize: 20,
//     lineHeight: 28,
//     fontFamily: "Poppins_700Bold",
//     textAlign: "center",
//   },
//   sheetSub: {
//     color: C.muted,
//     fontSize: 13,
//     lineHeight: 19,
//     fontFamily: "Poppins_400Regular",
//     textAlign: "center",
//     marginTop: -6,
//   },
//   termsBox: {
//     flexGrow: 0,
//     flexShrink: 1,
//     backgroundColor: C.surface,
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: C.border,
//   },
//   termsContent: { padding: 16, gap: 14 },
//   termBlock: { gap: 3 },
//   termTitle: { color: C.text, fontSize: 13.5, fontFamily: "Poppins_600SemiBold" },
//   termBody: { color: C.muted, fontSize: 12.5, lineHeight: 19, fontFamily: "Poppins_400Regular" },

//   checkRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
//   checkbox: {
//     width: 24,
//     height: 24,
//     borderRadius: 7,
//     borderWidth: 2,
//     borderColor: C.primary,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   checkboxActive: { backgroundColor: C.primary },
//   checkText: {
//     flex: 1,
//     color: C.text,
//     fontSize: 12.5,
//     lineHeight: 18,
//     fontFamily: "Poppins_400Regular",
//   },
//   decline: { alignSelf: "center", paddingVertical: 6 },
//   declineText: { color: C.muted, fontSize: 13.5, fontFamily: "Poppins_600SemiBold" },
// });
// app/explore.tsx
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppButton } from "@/components/ui/app-button";
import { C } from "@/constants/studia-colors";

const STUDIA_LOGO = require("@/assets/images/studia-mobile-logo.png");
const STUDENT_ICON = require("@/assets/images/student.png");
const INSTRUCTOR_ICON = require("@/assets/images/instructor.png");

type Role = "student" | "instructor";

const ROLES: { id: Role; title: string; desc: string; icon: number }[] = [
  {
    id: "student",
    title: "Student",
    desc: "Access your courses, materials, quizzes, and AI learning assistant.",
    icon: STUDENT_ICON,
  },
  {
    id: "instructor",
    title: "Instructor",
    desc: "Manage courses, materials, assessments, and monitor student progress.",
    icon: INSTRUCTOR_ICON,
  },
];

// Placeholder copy: ipa-review sa school/DPO bago i-release.
const TERMS: { title: string; body: string }[] = [
  {
    title: "1. Using STUDIA",
    body: "STUDIA Mobile is provided by Occidental Mindoro State University – Mamburao Campus for learning and academic activities. Use your own account, keep your login private, and do not upload content you do not have the right to share.",
  },
  {
    title: "2. Information we collect",
    body: "We collect your name, school email, role, course enrollments, submissions, quiz results, and app activity so the app can work and your instructors can follow your progress.",
  },
  {
    title: "3. AI features",
    body: "Lecture videos, documents, and text you upload may be processed by AI services to create transcripts, summaries, study plans, and quizzes. AI output can contain mistakes, so double-check important details.",
  },
  {
    title: "4. How your data is used",
    body: "Your data is used only for academic and app-improvement purposes. We do not sell your personal information. Access is limited to authorized school personnel and the services needed to run the app.",
  },
  {
    title: "5. Your rights",
    body: "Under the Data Privacy Act of 2012 (RA 10173), you may ask to access, correct, or request deletion of your personal data. Contact the campus data protection officer for any request.",
  },
  {
    title: "6. Changes",
    body: "We may update these terms and the privacy policy. We will notify you in the app when something important changes.",
  },
];

export default function ExploreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  // Responsive breakpoints (base sa taas ng screen)
  const compact = height < 700; // maliliit na phone / landscape
  const tiny = height < 600; // sobrang liit: itatago ang subtitle
  const topPad = insets.top + (compact ? 8 : 14);
  const bottomPad = Math.max(insets.bottom, 16) + 8;

  const [consentOpen, setConsentOpen] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [role, setRole] = useState<Role | null>(null);

  // 0 = hidden, 1 = shown. Isang value lang ang nagpapagalaw ng backdrop at sheet.
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 360,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const closeSheet = (onDone: () => void) => {
    Animated.timing(progress, {
      toValue: 0,
      duration: 260,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onDone();
    });
  };

  // Hindi na kailangan ng `if (!agreed)` guard: disabled na ang button hangga't hindi naka-check.
  const handleAgree = () => closeSheet(() => setConsentOpen(false));

  const handleDecline = () => {
    closeSheet(() => {
      setConsentOpen(false);
      router.back();
    });
  };

  const handleContinue = () => {
    if (!role) return;
    // TODO: palitan kapag gawa na ang login/register screen
    // router.push({ pathname: "/login", params: { role } });
    console.log("Selected role:", role);
  };

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.6, 0],
  });

  const ctaLabel = role ? `Continue as ${role}` : "Select role";

  return (
    <View style={s.root}>
      {/* Hero */}
      <View style={[s.hero, { paddingTop: topPad, paddingBottom: compact ? 24 : 36 }]}>
        <View style={s.blobA} />
        <View style={s.blobB} />

        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={[s.back, { top: topPad }]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={22} color={C.white} />
        </Pressable>

        <View style={[s.logoRing, compact && s.logoRingCompact]}>
          <Image
            source={STUDIA_LOGO}
            style={[s.logo, compact && s.logoCompact]}
            contentFit="contain"
            alt="Studia logo"
          />
        </View>
        <Text style={[s.heroTitle, compact && s.heroTitleCompact]}>Choose account type</Text>
        {!tiny && <Text style={s.heroSub}>Select the role that matches how you will use STUDIA.</Text>}
      </View>

      {/* Role cards */}
      <ScrollView
        style={s.list}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        {ROLES.map((r) => {
          const selected = role === r.id;
          return (
            <Pressable
              key={r.id}
              onPress={() => setRole(r.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`${r.title}. ${r.desc}`}
              style={({ pressed }) => [
                s.roleCard,
                compact && s.roleCardCompact,
                selected && s.roleCardActive,
                pressed && s.roleCardPressed,
              ]}
            >
              <View style={[s.roleIcon, compact && s.roleIconCompact, selected && s.roleIconActive]}>
                <Image
                  source={r.icon}
                  style={[s.roleIconImg, compact && s.roleIconImgCompact]}
                  contentFit="contain"
                  accessible={false}
                />
              </View>
              <View style={s.roleText}>
                <Text style={s.roleTitle}>{r.title}</Text>
                <Text style={s.roleDesc}>{r.desc}</Text>
              </View>
              <View style={[s.radio, selected && s.radioActive]}>
                {selected && <Ionicons name="checkmark" size={14} color={C.white} />}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* CTA */}
      <View style={[s.footer, { paddingBottom: bottomPad }]}>
        <AppButton label={ctaLabel} onPress={handleContinue} disabled={!role} />
      </View>

      {/* Terms & privacy sheet */}
      <Modal
        visible={consentOpen}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={handleDecline}
      >
        <View style={s.modalRoot}>
          <Animated.View style={[StyleSheet.absoluteFill, s.backdrop, { opacity: progress }]} />

          <Animated.View
            style={[
              s.sheet,
              {
                maxHeight: height * (compact ? 0.94 : 0.86),
                paddingBottom: bottomPad,
                transform: [{ translateY }],
              },
            ]}
          >
            <View style={s.handle} />

            {!compact && (
              <View style={s.sheetBadge}>
                <Ionicons name="shield-checkmark" size={26} color={C.primary} />
              </View>
            )}
            <Text style={s.sheetTitle}>Terms and privacy</Text>
            {!compact && <Text style={s.sheetSub}>Please review before creating your account.</Text>}

            <ScrollView style={s.termsBox} contentContainerStyle={s.termsContent} showsVerticalScrollIndicator>
              {TERMS.map((t) => (
                <View key={t.title} style={s.termBlock}>
                  <Text style={s.termTitle}>{t.title}</Text>
                  <Text style={s.termBody}>{t.body}</Text>
                </View>
              ))}
            </ScrollView>

            <Pressable
              onPress={() => setAgreed((v) => !v)}
              style={s.checkRow}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: agreed }}
            >
              <View style={[s.checkbox, agreed && s.checkboxActive]}>
                {agreed && <Ionicons name="checkmark" size={16} color={C.white} />}
              </View>
              <Text style={s.checkText}>
                I have read and agree to the Terms and Conditions and the Privacy Policy.
              </Text>
            </Pressable>

            <AppButton label="Agree and continue" onPress={handleAgree} disabled={!agreed} />

            <Pressable onPress={handleDecline} hitSlop={8} style={s.decline} accessibilityRole="button">
              <Text style={s.declineText}>Decline</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },

  /* Hero (same language as learn-more) */
  hero: {
    backgroundColor: C.primaryDark,
    alignItems: "center",
    paddingHorizontal: 24,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: "hidden",
    gap: 8,
  },
  blobA: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: C.primary,
    opacity: 0.45,
    top: -90,
    right: -70,
  },
  blobB: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: C.lavender,
    opacity: 0.12,
    bottom: -60,
    left: -50,
  },
  back: {
    position: "absolute",
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  logoRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  logoRingCompact: { width: 64, height: 64, borderRadius: 32, marginTop: 4 },
  logo: { width: 60, height: 60 },
  logoCompact: { width: 44, height: 44 },
  heroTitle: {
    color: C.white,
    fontSize: 26,
    lineHeight: 34,
    fontFamily: "Poppins_700Bold",
    textAlign: "center",
    marginTop: 6,
  },
  heroTitleCompact: { fontSize: 22, lineHeight: 30, marginTop: 2 },
  heroSub: {
    color: C.lavender,
    fontSize: 13.5,
    lineHeight: 20,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    maxWidth: 320,
  },

  /* Role cards */
  list: { flex: 1 },
  listContent: { padding: 20, gap: 14, width: "100%", maxWidth: 560, alignSelf: "center" },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 20,
    backgroundColor: C.white,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  roleCardCompact: { padding: 12, gap: 12 },
  roleCardActive: { backgroundColor: C.lavenderSoft, borderColor: C.primary },
  roleCardPressed: { opacity: 0.92, transform: [{ scale: 0.985 }] },
  roleIcon: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: C.lavenderSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  roleIconCompact: { width: 56, height: 56, borderRadius: 16 },
  roleIconActive: { backgroundColor: C.white },
  roleIconImg: { width: 46, height: 46 },
  roleIconImgCompact: { width: 38, height: 38 },
  roleText: { flex: 1, gap: 2 },
  roleTitle: { color: C.text, fontSize: 17, fontFamily: "Poppins_700Bold" },
  roleDesc: { color: C.muted, fontSize: 12.5, lineHeight: 18, fontFamily: "Poppins_400Regular" },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: { backgroundColor: C.primary, borderColor: C.primary },

  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    width: "100%",
    maxWidth: 608,
    alignSelf: "center",
  },

  /* Consent sheet */
  modalRoot: { flex: 1, justifyContent: "flex-end" },
  backdrop: { backgroundColor: "rgba(31,36,56,0.55)" },
  sheet: {
    backgroundColor: C.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 10,
    gap: 12,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },
  handle: {
    alignSelf: "center",
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.border,
    marginBottom: 4,
  },
  sheetBadge: {
    alignSelf: "center",
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: C.lavenderSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetTitle: {
    color: C.text,
    fontSize: 20,
    lineHeight: 28,
    fontFamily: "Poppins_700Bold",
    textAlign: "center",
  },
  sheetSub: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    marginTop: -6,
  },
  termsBox: {
    flexGrow: 0,
    flexShrink: 1,
    minHeight: 110,
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  termsContent: { padding: 16, gap: 14 },
  termBlock: { gap: 3 },
  termTitle: { color: C.text, fontSize: 13.5, fontFamily: "Poppins_600SemiBold" },
  termBody: { color: C.muted, fontSize: 12.5, lineHeight: 19, fontFamily: "Poppins_400Regular" },

  checkRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: { backgroundColor: C.primary },
  checkText: {
    flex: 1,
    color: C.text,
    fontSize: 12.5,
    lineHeight: 18,
    fontFamily: "Poppins_400Regular",
  },
  decline: { alignSelf: "center", paddingVertical: 6 },
  declineText: { color: C.muted, fontSize: 13.5, fontFamily: "Poppins_600SemiBold" },
});