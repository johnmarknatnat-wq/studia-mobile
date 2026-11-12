import { useRouter } from 'expo-router';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// improt LearnMoreScreen from '@/app/learn-more';

// import {omscLogo} from '@/assets/images/omsc.logo.png';
// import {omsc} from '@/assets/images/omsu.jpg';



import { C } from '@/constants/studia-colors';
import LearnMoreScreen from './learn-more';

export default function SplashScreen() {
  const router = useRouter();

  return (
    // <ImageBackground source={require('@/assets/images/omsu.jpg')} style={s.bg} resizeMode="cover">
    <ImageBackground source={require('../../assets/images/omsu.jpg')} style={s.bg} resizeMode="cover">
      <View style={s.overlay}>
        <SafeAreaView style={s.safe}>
          <View style={s.center}>
            <Image source={require('../../assets/images/omsc.logo.png')} style={s.logo} />
            <Text style={s.title}>OMSU</Text>
            <Text style={s.subtitle}>AI-LMS</Text>
            <Text style={s.tagline}>AI-Powered Mobile Learning Management System</Text>
          </View>

          <View style={s.actions}>
            {/* palitan ang route kapag gawa mo na ang login/role screen */}
            <Pressable style={s.primaryBtn} onPress={() => router.push('/explore')}>
              <Text style={s.primaryText}>Get Started</Text>
            </Pressable>
            <Pressable style={s.secondaryBtn} onPress={() => router.push('/learn-more')}>
              <Text style={s.secondaryText}>Learn More</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(59, 40, 140, 0.88)' },
  safe: { flex: 1, paddingHorizontal: 24, paddingBottom: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  logo: { width: 130, height: 130, marginBottom: 16 },
  title: { color: C.white, fontSize: 40, fontWeight: '800' },
  subtitle: { color: C.lavender, fontSize: 28, fontWeight: '700' },
  tagline: { color: C.lavender, fontSize: 14, textAlign: 'center', marginTop: 8 },
  actions: { gap: 12 },
  primaryBtn: {
    backgroundColor: C.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryText: { color: C.white, fontSize: 16, fontWeight: '700' },
  secondaryBtn: {
    backgroundColor: C.lavender,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryText: { color: C.primaryDark, fontSize: 16, fontWeight: '700' },
});