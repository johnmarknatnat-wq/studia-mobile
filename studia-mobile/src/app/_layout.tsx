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
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Ang index.tsx (SplashScreen) ang magsisilbing unang screen */}
        <Stack.Screen name="index" />
        {/* Ang learn-more.tsx ay awtomatikong isasama sa stack */}
        <Stack.Screen name="learn-more" />
      </Stack>
    </ThemeProvider>
  );
}