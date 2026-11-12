// index.tsx

// import { Image } from 'expo-image';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useRouter } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// import { AppButton } from '@/components/ui/app-button';
// import { C, SPLASH_GRADIENT } from '@/constants/studia-colors';

// const BUILDING = require('../../assets/images/omsu.jpg');
// const LOGO = require('../../assets/images/omsc.logo.png');
// const MASCOT = require('../../assets/images/studia-mascot.png');

// export default function SplashScreen() {
//   const router = useRouter();

//   // TODO: palitan ang '/explore' kapag gawa na ang login/role screen
//   const handleGetStarted = () => router.push('/explore');
//   const handleLearnMore = () => router.push('/learn-more');

//   return (
//     <View style={s.root}>
//       <StatusBar style="light" />

//       {/* Layer 1: building photo */}
//       <Image source={BUILDING} style={s.building} contentFit="cover" />

//       {/* Layer 2: gradient overlay */}
//       <LinearGradient
//         colors={SPLASH_GRADIENT.colors}
//         locations={SPLASH_GRADIENT.locations}
//         style={StyleSheet.absoluteFill}
//       />

//       {/* Layer 3: content */}
//       <SafeAreaView style={s.safe}>
//         <View style={s.hero}>
//           <Image source={LOGO} style={s.logo} contentFit="contain" />
//           <Text style={s.title}>OMSU</Text>
//           <Text style={s.subtitle}>AI-LMS</Text>
//           <Text style={s.tagline}>AI-Powered Mobile Learning{'\n'}Management System</Text>
//         </View>

//         <View style={s.mascotWrap}>
//           <Image source={MASCOT} style={s.mascot} contentFit="contain" />
//         </View>

//         <View style={s.actions}>
//           <AppButton label="Get Started" onPress={handleGetStarted} />
//           <AppButton label="Learn More" variant="secondary" onPress={handleLearnMore} />
//         </View>
//       </SafeAreaView>
//     </View>
//   );
// }

// const s = StyleSheet.create({
//   root: { flex: 1, backgroundColor: C.white },
//   building: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: '55%',
//   },
//   safe: { flex: 1, paddingHorizontal: 24, paddingBottom: 16 },
//   hero: { alignItems: 'center', marginTop: 32, gap: 4 },
//   logo: { width: 120, height: 120, marginBottom: 12 },
//   title: { color: C.white, fontSize: 44, fontWeight: '800', letterSpacing: 1 },
//   subtitle: { color: C.white, fontSize: 28, fontWeight: '700' },
//   tagline: {
//     color: C.white,
//     fontSize: 15,
//     lineHeight: 22,
//     textAlign: 'center',
//     marginTop: 8,
//   },
//   mascotWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
//   mascot: { width: 220, height: 220 },
//   actions: { gap: 12 },
// });

// index.tsx

// index.tsx

// import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold, useFonts } from "@expo-google-fonts/poppins";
// import { Image } from "expo-image";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// // import { StyleSheet, Text, View } from "react-native";
// // import { SafeAreaView } from "react-native-safe-area-context";

// import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// import { AppButton } from "@/components/ui/app-button";
// import { C, SPLASH_GRADIENT } from "@/constants/studia-colors";

// const BUILDING = require("../../assets/images/omsu.jpg");
// const LOGO = require("../../assets/images/omsc.logo.png");
// const STUDIA_LOGO = require("../../assets/images/studia-mobile-logo.png");
// const MASCOT = require("../../assets/images/studia-mascot.png");

// export default function SplashScreen() {
//   const router = useRouter();

//   const { width, height } = useWindowDimensions();
//   const insets = useSafeAreaInsets();

//   const compact = height < 700; // maliliit na phone
//   const mascotSize = Math.min(width * 0.85, height * 0.4, 360);
//   const logoSize = compact ? 64 : 80;

//   const [fontsLoaded] = useFonts({
//     Poppins_400Regular,
//     Poppins_600SemiBold,
//     Poppins_700Bold,
//     Poppins_800ExtraBold,
//   });

//   if (!fontsLoaded) return null;

//   // TODO: palitan ang '/explore' kapag gawa na ang login/role screen
//   const handleGetStarted = () => router.push("/explore");
//   const handleLearnMore = () => router.push("/learn-more");

//   return (
//     <View style={s.root}>
//       <StatusBar style="light" />

//       {/* Layer 1: building photo (buong screen para walang putol) */}
//       <Image source={BUILDING} style={s.building} contentFit="cover" />

//       {/* Layer 2: gradient overlay */}
//       <LinearGradient colors={SPLASH_GRADIENT.colors} locations={SPLASH_GRADIENT.locations} style={StyleSheet.absoluteFill} />

//       {/* Layer 3: content */}
//       <View style={[s.safe, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
//         <View style={[s.hero, { marginTop: compact ? 16 : 44 }]}>
//           <View style={s.logoRow}>
//             <Image source={LOGO} style={{ width: logoSize, height: logoSize }} contentFit="contain" />
//             <View style={s.logoDivider} />
//             <Image source={STUDIA_LOGO} style={{ width: logoSize, height: logoSize }} contentFit="contain" />
//           </View>
//           <Text style={[s.title, compact && { fontSize: 36, lineHeight: 40 }]}>OMSU</Text>
//           <Text style={[s.subtitle, compact && { fontSize: 24, lineHeight: 30 }]}>AI-LMS</Text>
//           <Text style={s.tagline}>AI-Powered Mobile Learning{"\n"}Management System</Text>
//         </View>

//         <View style={s.mascotWrap}>
//           <View style={[s.mascotGlow, { width: mascotSize * 0.88, height: mascotSize * 0.88, borderRadius: mascotSize * 0.44 }]} />
//           <Image source={MASCOT} style={{ width: mascotSize, height: mascotSize }} contentFit="contain" />
//         </View>

//         <View style={s.actions}>
//           <AppButton label="Get Started" onPress={handleGetStarted} />
//           <AppButton label="Learn More" variant="secondary" onPress={handleLearnMore} />
//         </View>
//       </View>
//     </View>
//   );
// }

// const s = StyleSheet.create({
//   root: { flex: 1, backgroundColor: C.white },
//   building: StyleSheet.absoluteFill,
//   safe: { flex: 1, paddingHorizontal: 24, paddingBottom: 16 },

//   hero: { alignItems: "center", marginTop: 44, gap: 4 },
//   logoRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 14,
//     marginBottom: 14,
//   },
//   logo: { width: 80, height: 80 },
//   logoDivider: {
//     width: 2,
//     height: 52,
//     borderRadius: 2,
//     backgroundColor: "rgba(255,255,255,0.45)",
//   },
//   title: {
//     color: C.white,
//     fontSize: 44,
//     lineHeight: 48,
//     fontFamily: "Poppins_700Bold",
//     letterSpacing: 1,
//   },
//   subtitle: { color: C.white, fontSize: 28, lineHeight: 36, fontFamily: "Poppins_700Bold" },
//   tagline: {
//     color: C.white,
//     fontSize: 12,
//     lineHeight: 15,
//     textAlign: "center",
//     marginTop: 5,
//     fontFamily: "Poppins_400Regular",
//   },

//   mascotWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
//   mascotGlow: {
//     position: "absolute",
//     width: 300,
//     height: 300,
//     borderRadius: 150,
//     backgroundColor: "rgba(255,255,255,0.28)",
//   },
//   mascot: { width: 340, height: 340 },

//   actions: { gap: 12 },
// });
// app/index.tsx

// app/index.tsx

import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppButton } from "@/components/ui/app-button";
import { C, SPLASH_GRADIENT } from "@/constants/studia-colors";

const BUILDING = require("../../assets/images/omsu.jpg");
const LOGO = require("../../assets/images/omsc.logo.png");
const STUDIA_LOGO = require("../../assets/images/studia-mobile-logo.png");
const MASCOT = require("../../assets/images/studia-mascot.png");

export default function WelcomeScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Walang useFonts dito: ang _layout.tsx na ang nag-gate ng rendering.

  const compact = height < 700; // maliliit na phone
  const mascotSize = Math.min(width * 0.85, height * 0.4, 360);
  const logoSize = compact ? 64 : 80;

  // TODO: palitan ang '/explore' kapag gawa na ang login/role screen
  // Gamitin ang router.replace kung ayaw mong makabalik sa welcome screen.
  const handleGetStarted = () => router.push("/explore");
  const handleLearnMore = () => router.push("/learn-more");

  return (
    <View style={s.root}>
      <StatusBar style="light" />

      {/* Layer 1: building photo (decorative) */}
      <Image source={BUILDING} style={StyleSheet.absoluteFill} contentFit="cover" priority="high" accessible={false} />

      {/* Layer 2: gradient overlay */}
      <LinearGradient colors={[...SPLASH_GRADIENT.colors]} locations={[...SPLASH_GRADIENT.locations]} style={StyleSheet.absoluteFill} />

      {/* Layer 3: content */}
      <View style={[s.safe, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <View style={[s.hero, { marginTop: compact ? 16 : 44 }]}>
          <View style={s.logoRow}>
            <Image source={LOGO} style={{ width: logoSize, height: logoSize }} contentFit="contain" alt="OMSC logo" />
            <View style={s.logoDivider} />
            <Image source={STUDIA_LOGO} style={{ width: logoSize, height: logoSize }} contentFit="contain" alt="Studia logo" />
          </View>
          <Text style={[s.title, compact && s.titleCompact]}>OMSU</Text>
          <Text style={[s.subtitle, compact && s.subtitleCompact]}>AI-LMS</Text>
          <Text style={s.tagline}>AI-Powered Mobile Learning{"\n"}Management System</Text>
        </View>

        <View style={s.mascotWrap}>
          <View
            style={[
              s.mascotGlow,
              {
                width: mascotSize * 0.88,
                height: mascotSize * 0.88,
                borderRadius: mascotSize * 0.44,
              },
            ]}
          />
          {/* Lumiliit kapag maliit ang espasyo, hindi lalampas sa mascotSize */}
          <Image source={MASCOT} style={{ height: "100%", maxHeight: mascotSize, aspectRatio: 1 }} contentFit="contain" alt="Studia mascot" />
        </View>

        <View style={s.actions}>
          <AppButton label="Get Started" onPress={handleGetStarted} />
          <AppButton label="Learn More" variant="secondary" onPress={handleLearnMore} />
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.white },
  safe: { flex: 1, paddingHorizontal: 24 },

  hero: { alignItems: "center", gap: 4 },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    marginBottom: 14,
  },
  logoDivider: {
    width: 2,
    height: 52,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  title: {
    color: C.white,
    fontSize: 44,
    lineHeight: 58,
    fontFamily: "Poppins_700Bold",
    letterSpacing: 1,
  },
  titleCompact: { fontSize: 36, lineHeight: 48 },
  subtitle: {
    color: C.white,
    fontSize: 28,
    lineHeight: 38,
    fontFamily: "Poppins_700Bold",
  },
  subtitleCompact: { fontSize: 24, lineHeight: 32 },
  tagline: {
    color: C.white,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 5,
    fontFamily: "Poppins_400Regular",
  },

  mascotWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  mascotGlow: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.28)",
  },

  actions: { gap: 12 },
});
