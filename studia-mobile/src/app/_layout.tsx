import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
// import AppTabs from '@/components/app-tabs';
import TabTwoScreen from '@/app/explore';
// this is a sample layout file to show how to use the tab navigator. You can delete this file and create your own layout file if you want to customize the layout of your app.

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      {/* <AppTabs /> */}
      {/* fjshjfhsjkhkjfs */}
      {/* ahkdahjhdas */}
      <TabTwoScreen/>
    </ThemeProvider>
  );
}
