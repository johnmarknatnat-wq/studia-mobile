// //layout.tsx

// import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
// // import * as SplashScreen from 'expo-splash-screen';
// import { useColorScheme } from 'react-native';
// import SplashScreen from '@/app/index';

// // import { AnimatedSplashOverlay } from '@/components/animated-icon';
// // import AppTabs from '@/components/app-tabs';
// // import TabTwoScreen from '@/app/explore';
// // import LearnMoreScreen  from '@/app/index';
// // this is a sample layout file to show how to use the tab navigator. You can delete this file and create your own layout file if you want to customize the layout of your app.

// // SplashScreen.preventAutoHideAsync();

// export default function TabLayout() {
//   const colorScheme = useColorScheme();
//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       {/* <AnimatedSplashOverlay /> */}
//       {/* <AppTabs /> */}

//       {/* ahkdahjhdas */}
//       {/* <LearnMoreScreen/> */}
//       <SplashScreen />
//     </ThemeProvider>
//   );
// }
// import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
// import { Stack } from 'expo-router';
// import { useColorScheme } from 'react-native';

// export default function RootLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack screenOptions={{ headerShown: false }}>
//         {/* Ang index.tsx (SplashScreen) ang magsisilbing unang screen */}
//         <Stack.Screen name="index" />
//         {/* Ang learn-more.tsx ay awtomatikong isasama sa stack */}
//         <Stack.Screen name="learn-more" />
//       </Stack>
//     </ThemeProvider>
//   );
// }

// src/app/_layout.tsx

// src/app/_layout.tsx

// import {
//   Poppins_400Regular,
//   Poppins_600SemiBold,
//   Poppins_700Bold,
//   Poppins_800ExtraBold,
//   useFonts,
// } from '@expo-google-fonts/poppins';
// import { SplashScreen, Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import { useEffect } from 'react';
// import { SafeAreaProvider } from 'react-native-safe-area-context';

// import { C } from '@/constants/studia-colors';

// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const [loaded, error] = useFonts({
//     Poppins_400Regular,
//     Poppins_600SemiBold,
//     Poppins_700Bold,
//     Poppins_800ExtraBold,
//   });

//   useEffect(() => {
//     if (loaded || error) SplashScreen.hideAsync();
//   }, [loaded, error]);

//   if (!loaded && !error) return null;

//   return (
//     <SafeAreaProvider>
//       <StatusBar style="light" />
//       <Stack
//         screenOptions={{
//           headerShown: false,
//           animation: 'fade_from_bottom',
//           animationDuration: 350,
//           contentStyle: { backgroundColor: C.surface },
//         }}>
//         <Stack.Screen name="index" />
//         <Stack.Screen name="learn-more" />
//       </Stack>
//     </SafeAreaProvider>
//   );
// }

//_layout.com
// import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
// import { SplashScreen, Stack } from "expo-router";
// import { useEffect } from "react";
// import { StatusBar } from "expo-status-bar";
// import { SafeAreaProvider } from "react-native-safe-area-context";

// import { C } from "@/constants/studia-colors";

// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const [loaded, error] = useFonts({
//     Poppins_400Regular,
//     Poppins_600SemiBold,
//     Poppins_700Bold,
//   });

//   useEffect(() => {
//     if (error) console.warn("Font load failed:", error);
//     if (loaded || error) SplashScreen.hideAsync();
//   }, [loaded, error]);

//   if (!loaded && !error) return null;

//   return (
//     <SafeAreaProvider>
//       {/* <Stack
//         screenOptions={{
//           headerShown: false,
//           animation: "fade",
//           animationDuration: 350,
//           contentStyle: { backgroundColor: C.surface },
//         }}
//       >
//         <Stack.Screen name="index" />
//         <Stack.Screen name="learn-more" />
//       </Stack> */}
//       <StatusBar style="light" />
//       <Stack
//         screenOptions={{
//           headerShown: false,
//           animation: "fade",
//           animationDuration: 300,
//           freezeOnBlur: true,
//           contentStyle: { backgroundColor: C.lavenderSoft },
//         }}
//       >
//         <Stack.Screen name="index" />
//         <Stack.Screen name="learn-more" />
//       </Stack>
//       {/* <Stack
//         screenOptions={{
//           headerShown: false,
//           animation: "fade",
//           animationDuration: 300,
//           // Soft lavender sits between the splash gradient and the learn-more
//           // surface, so the cross-fade doesn't flash a harsh gray.
//           contentStyle: { backgroundColor: C.lavenderSoft },
//         }}
//       >
//         <Stack.Screen name="index" />
//         <Stack.Screen name="learn-more" />
//       </Stack> */}
//       {/* <Stack
//         screenOptions={{
//           headerShown: false,
//           animation: "slide_from_right",
//           animationDuration: 300,
//           gestureEnabled: true,
//           contentStyle: { backgroundColor: C.primaryDark },
//         }}
//       >
//         <Stack.Screen name="index" options={{ animation: "fade" }} />
//         <Stack.Screen name="learn-more" />
//       </Stack> */}
//     </SafeAreaProvider>
//   );
// }
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { C } from "@/constants/studia-colors";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold });

  useEffect(() => {
    if (error) console.warn("Font load failed:", error);
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          animationDuration: 300,
          freezeOnBlur: true,
          contentStyle: { backgroundColor: C.lavenderSoft },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="learn-more" />
      </Stack>
    </SafeAreaProvider>
  );
}