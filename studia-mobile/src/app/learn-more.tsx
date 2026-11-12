// learn-more.tsx


// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// import { C } from '@/constants/studia-colors';

// // Images must be loaded with require() (or a default import), not a named import.
// // Save the two logos as these files:
// //   assets/images/studia-logo.png  (STUDIA Mobile logo)
// //   assets/images/omsu-logo.png    (OMSU seal)
// const studiaLogo = require('@/assets/images/studia-mobile-logo.png');
// const omsuLogo = require('@/assets/images/omsc.logo.png');

// type Feature = {
//   icon: keyof typeof Ionicons.glyphMap;
//   color: string;
//   title: string;
//   desc: string;
// };

// const instructorFeatures: Feature[] = [
//   {
//     icon: 'videocam',
//     color: C.blue,
//     title: 'Video Lesson & Material Repository',
//     desc: 'Mag-upload ng lecture videos (.mp4, .mov), PDFs, at PowerPoint slides. Awtomatikong kukunin ng AI ang transcript at key learning objectives.',
//   },
//   {
//     icon: 'sparkles',
//     color: C.primary,
//     title: 'AI Quiz Synthesizer',
//     desc: 'Gumawa agad ng Multiple Choice, Identification, at Essay quizzes mula sa kahit anong module o video, may difficulty levels.',
//   },
//   {
//     icon: 'bar-chart',
//     color: C.green,
//     title: 'Smart Analytics',
//     desc: 'Real-time na engagement metrics, content consumption rates, at pag-detect ng mga konseptong nahihirapan ang students.',
//   },
// ];

// const studentFeatures: Feature[] = [
//   {
//     icon: 'document-text',
//     color: C.red,
//     title: 'AI Lesson Summarizer',
//     desc: 'I-condense ang mahahabang lecture o reading files sa bullet points, TL;DR, o mind-maps sa loob ng ilang segundo.',
//   },
//   {
//     icon: 'calendar',
//     color: C.orange,
//     title: 'Smart Task & Study Planner',
//     desc: 'Binabasa ang deadlines, readings, at exam dates, tapos gumagawa ng optimized na daily study schedule.',
//   },
//   {
//     icon: 'help-circle',
//     color: C.primary,
//     title: 'Interactive Practice Quizzes',
//     desc: 'AI-generated flashcards at practice quizzes na may agarang rationale at feedback.',
//   },
// ];

// const aiCore = [
//   'Speech-to-Text Transcription',
//   'Automated Bullet & Concept Mapping',
//   "Bloom's Taxonomy Quiz Synthesizer",
// ];

// function FeatureCard({ icon, color, title, desc }: Feature) {
//   return (
//     <View style={s.card}>
//       <View style={[s.iconBadge, { backgroundColor: color }]}>
//         <Ionicons name={icon} size={20} color={C.white} />
//       </View>
//       <View style={{ flex: 1 }}>
//         <Text style={s.cardTitle}>{title}</Text>
//         <Text style={s.cardDesc}>{desc}</Text>
//       </View>
//     </View>
//   );
// }

// export default function LearnMoreScreen() {
//   const router = useRouter();

//   return (
//     <SafeAreaView style={s.safe} edges={['top']}>
//       <ScrollView
//         style={{ backgroundColor: C.surface }}
//         contentContainerStyle={s.scroll}
//         showsVerticalScrollIndicator={false}
//         bounces={false}
//       >
//         {/* Header */}
//         <View style={s.hero}>
//           <Pressable
//             onPress={() => router.back()}
//             hitSlop={12}
//             style={s.back}
//             accessibilityRole="button"
//             accessibilityLabel="Go back"
//           >
//             <Ionicons name="chevron-back" size={24} color={C.white} />
//           </Pressable>

//           <Image source={studiaLogo} style={s.studiaLogo} resizeMode="contain" />
//           <Text style={s.heroTitle}>STUDIA Mobile</Text>
//           <Text style={s.heroSub}>AI-Powered Smart Learning & Task Management System</Text>

//           <View style={s.instRow}>
//             <Image source={omsuLogo} style={s.omsuLogo} resizeMode="contain" />
//             <Text style={s.heroInst}>Occidental Mindoro State University — Mamburao Campus</Text>
//           </View>
//         </View>

//         <View style={s.body}>
//           {/* About */}
//           <Text style={s.sectionTitle}>Ano ang STUDIA?</Text>
//           <Text style={s.paragraph}>
//             Ang STUDIA Mobile ay mobile-first, AI-driven Learning Management System para sa OMSU –
//             Mamburao Campus. Kapareho ng collaborative platforms tulad ng Google Classroom, pero may
//             native AI para sa video lesson transcription, instant summarization, smart task
//             management, at adaptive quiz generation para sa students at instructors.
//           </Text>

//           {/* Students */}
//           <Text style={s.sectionTitle}>Para sa Students</Text>
//           {studentFeatures.map((f) => (
//             <FeatureCard key={f.title} {...f} />
//           ))}

//           {/* Instructors */}
//           <Text style={s.sectionTitle}>Para sa Instructors</Text>
//           {instructorFeatures.map((f) => (
//             <FeatureCard key={f.title} {...f} />
//           ))}

//           {/* AI Core */}
//           <View style={s.aiBox}>
//             <View style={s.aiHeader}>
//               <Ionicons name="hardware-chip" size={20} color={C.primaryDark} />
//               <Text style={s.aiTitle}>AI Core Engine (LLM / Whisper)</Text>
//             </View>
//             {aiCore.map((item) => (
//               <View key={item} style={s.aiRow}>
//                 <Ionicons name="checkmark-circle" size={18} color={C.green} />
//                 <Text style={s.aiItem}>{item}</Text>
//               </View>
//             ))}
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const s = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: C.primaryDark },
//   scroll: { paddingBottom: 40 },
//   hero: {
//     backgroundColor: C.primaryDark,
//     alignItems: 'center',
//     paddingTop: 24,
//     paddingBottom: 32,
//     paddingHorizontal: 24,
//     gap: 8,
//   },
//   back: { position: 'absolute', left: 16, top: 16, zIndex: 1 },
//   studiaLogo: { width: 110, height: 110 },
//   heroTitle: {
//     color: C.white,
//     fontSize: 28,
//     fontFamily: 'Poppins_700Bold',
//     marginTop: 4,
//   },
//   heroSub: {
//     color: C.lavender,
//     fontSize: 14,
//     textAlign: 'center',
//     fontFamily: 'Poppins_400Regular',
//   },
//   instRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//     marginTop: 8,
//   },
//   omsuLogo: { width: 32, height: 32 },
//   heroInst: {
//     color: C.lavender,
//     fontSize: 12,
//     opacity: 0.85,
//     flexShrink: 1,
//     fontFamily: 'Poppins_400Regular',
//   },
//   body: { padding: 20, gap: 12 },
//   sectionTitle: {
//     color: C.text,
//     fontSize: 18,
//     fontFamily: 'Poppins_700Bold',
//     marginTop: 12,
//   },
//   paragraph: {
//     color: C.muted,
//     fontSize: 14,
//     lineHeight: 22,
//     fontFamily: 'Poppins_400Regular',
//   },
//   card: {
//     flexDirection: 'row',
//     gap: 12,
//     backgroundColor: C.white,
//     borderWidth: 1,
//     borderColor: C.border,
//     borderRadius: 14,
//     padding: 14,
//   },
//   iconBadge: {
//     width: 40,
//     height: 40,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cardTitle: {
//     color: C.text,
//     fontSize: 15,
//     fontFamily: 'Poppins_600SemiBold',
//     marginBottom: 4,
//   },
//   cardDesc: {
//     color: C.muted,
//     fontSize: 13,
//     lineHeight: 19,
//     fontFamily: 'Poppins_400Regular',
//   },
//   aiBox: {
//     backgroundColor: C.lavender,
//     borderRadius: 14,
//     padding: 16,
//     gap: 8,
//     marginTop: 12,
//   },
//   aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
//   aiTitle: { color: C.primaryDark, fontSize: 15, fontFamily: 'Poppins_600SemiBold' },
//   aiRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   aiItem: { color: C.text, fontSize: 13, fontFamily: 'Poppins_400Regular' },
// });

// learn-more.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { C } from '@/constants/studia-colors';

const studiaLogo = require('@/assets/images/studia-mobile-logo.png');
const omsuLogo = require('@/assets/images/omsc.logo.png');


type Feature = {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  title: string;
  desc: string;
};

const studentFeatures: Feature[] = [
  {
    icon: 'document-text',
    color: C.red,
    title: 'AI Lesson Summarizer',
    desc: 'Condense long lectures and readings into bullet points, a TL;DR, or a mind map in seconds.',
  },
  {
    icon: 'calendar',
    color: C.orange,
    title: 'Smart Task & Study Planner',
    desc: 'Reads your deadlines, readings, and exam dates, then builds an optimized daily study schedule.',
  },
  {
    icon: 'help-circle',
    color: C.primary,
    title: 'Interactive Practice Quizzes',
    desc: 'AI-generated flashcards and practice quizzes with instant rationale and feedback.',
  },
];

const instructorFeatures: Feature[] = [
  {
    icon: 'videocam',
    color: C.blue,
    title: 'Lesson & Material Repository',
    desc: 'Upload lecture videos (.mp4, .mov), PDFs, and slides. AI automatically extracts the transcript and key learning objectives.',
  },
  {
    icon: 'sparkles',
    color: C.primary,
    title: 'AI Quiz Synthesizer',
    desc: 'Instantly generate Multiple Choice, Identification, and Essay quizzes from any module or video, with difficulty levels.',
  },
  {
    icon: 'bar-chart',
    color: C.green,
    title: 'Smart Analytics',
    desc: 'Real-time engagement metrics, content consumption rates, and detection of concepts students struggle with.',
  },
];

const aiCore = [
  'Speech-to-Text Transcription',
  'Automated Bullet & Concept Mapping',
  "Bloom's Taxonomy Quiz Synthesizer",
];

const highlights: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: 'sparkles', label: 'AI-Powered' },
  { icon: 'phone-portrait', label: 'Mobile-First' },
  { icon: 'people', label: 'Students & Instructors' },
];

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <View style={s.sectionHeader}>
      <Text style={s.eyebrow}>{eyebrow}</Text>
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  );
}

function FeatureCard({ icon, color, title, desc }: Feature) {
  return (
    <View style={s.card}>
      <View style={[s.iconBadge, { backgroundColor: color + '22' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={s.cardTitle}>{title}</Text>
      <Text style={s.cardDesc}>{desc}</Text>
    </View>
  );
}

export default function LearnMoreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const isWide = width >= 700;
  const contentWidth = Math.min(width, 960);
  const logoSize = Math.round(Math.min(Math.max(width * 0.32, 96), 150));
  const titleSize = width < 360 ? 26 : isWide ? 36 : 30;
  const gutter = isWide ? 32 : 20;

  const cardWrap = [
    s.cardGrid,
    isWide && { flexDirection: 'row' as const, flexWrap: 'wrap' as const },
  ];
  const cardCell = isWide ? { width: (contentWidth - gutter * 2 - 14 * 2) / 3 } : undefined;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        style={s.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        {/* Hero */}
        <View style={s.hero}>
          <View style={s.blobA} />
          <View style={s.blobB} />

          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={[s.back, { left: Math.max(16, (width - contentWidth) / 2 + 16) }]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={22} color={C.white} />
          </Pressable>

          <View style={[s.logoRing, { width: logoSize + 24, height: logoSize + 24 }]}>
            <Image
              source={studiaLogo}
              style={{ width: logoSize, height: logoSize }}
              resizeMode="contain"
            />
          </View>

          <Text style={[s.heroTitle, { fontSize: titleSize }]}>STUDIA Mobile</Text>
          <Text style={s.heroSub}>AI-Powered Smart Learning & Task Management System</Text>

          <View style={s.chipRow}>
            {highlights.map((h) => (
              <View key={h.label} style={s.chip}>
                <Ionicons name={h.icon} size={13} color={C.gold} />
                <Text style={s.chipText}>{h.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Body */}
        <View style={[s.body, { width: contentWidth, paddingHorizontal: gutter }]}>
          {/* About */}
          <View style={s.aboutCard}>
            <SectionHeader eyebrow="ABOUT" title="What is STUDIA?" />
            <Text style={s.paragraph}>
              STUDIA Mobile is a mobile-first, AI-driven Learning Management System built for
              Occidental Mindoro State University – Mamburao Campus. Like collaborative platforms
              such as Google Classroom, it adds native AI for video lesson transcription, instant
              summarization, smart task management, and adaptive quiz generation for both students
              and instructors.
            </Text>
          </View>

          {/* Students */}
          <SectionHeader eyebrow="FOR STUDENTS" title="Study smarter, not harder" />
          <View style={cardWrap}>
            {studentFeatures.map((f) => (
              <View key={f.title} style={cardCell}>
                <FeatureCard {...f} />
              </View>
            ))}
          </View>

          {/* Instructors */}
          <SectionHeader eyebrow="FOR INSTRUCTORS" title="Teach with less busywork" />
          <View style={cardWrap}>
            {instructorFeatures.map((f) => (
              <View key={f.title} style={cardCell}>
                <FeatureCard {...f} />
              </View>
            ))}
          </View>

          {/* AI Core */}
          <View style={s.aiBox}>
            <View style={s.aiHeader}>
              <View style={s.aiIcon}>
                <Ionicons name="hardware-chip" size={20} color={C.primaryDark} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.aiTitle}>AI Core Engine</Text>
                <Text style={s.aiSub}>LLM + Whisper</Text>
              </View>
            </View>
            {aiCore.map((item) => (
              <View key={item} style={s.aiRow}>
                <Ionicons name="checkmark-circle" size={18} color={C.gold} />
                <Text style={s.aiItem}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Footer */}
          <View style={s.footer}>
            <Image source={omsuLogo} style={s.footerLogo} resizeMode="contain" />
            <Text style={s.footerText}>
              Occidental Mindoro State University{'\n'}Mamburao Campus
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const shadow = Platform.select({
  ios: {
    shadowColor: C.primaryDark,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 3 },
  default: {},
});

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.primaryDark },
  scrollView: { flex: 1, backgroundColor: C.surface },

  hero: {
    backgroundColor: C.primaryDark,
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 44,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
    gap: 10,
  },
  blobA: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: C.primary,
    opacity: 0.45,
    top: -90,
    right: -70,
  },
  blobB: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: C.lavender,
    opacity: 0.12,
    bottom: -60,
    left: -50,
  },
  back: {
    position: 'absolute',
    top: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  logoRing: {
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  heroTitle: {
    color: C.white,
    fontFamily: 'Poppins_700Bold',
    marginTop: 6,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  heroSub: {
    color: C.lavender,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
    maxWidth: 420,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  chipText: { color: C.white, fontSize: 11.5, fontFamily: 'Poppins_600SemiBold' },

  body: { alignSelf: 'center', paddingTop: 24, gap: 14 },

  aboutCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: C.border,
    ...shadow,
  },
  sectionHeader: { marginTop: 10, gap: 2 },
  eyebrow: {
    color: C.primary,
    fontSize: 11,
    letterSpacing: 1.4,
    fontFamily: 'Poppins_600SemiBold',
  },
  sectionTitle: { color: C.text, fontSize: 20, fontFamily: 'Poppins_700Bold' },
  paragraph: {
    color: C.muted,
    fontSize: 14,
    lineHeight: 23,
    fontFamily: 'Poppins_400Regular',
  },

  cardGrid: { gap: 14 },
  card: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: C.border,
    ...shadow,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  cardTitle: { color: C.text, fontSize: 15.5, fontFamily: 'Poppins_600SemiBold' },
  cardDesc: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'Poppins_400Regular',
  },

  aiBox: {
    backgroundColor: C.primaryDark,
    borderRadius: 22,
    padding: 20,
    gap: 12,
    marginTop: 10,
    overflow: 'hidden',
  },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  aiIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: C.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiTitle: { color: C.white, fontSize: 16, fontFamily: 'Poppins_700Bold' },
  aiSub: { color: C.lavender, fontSize: 12, fontFamily: 'Poppins_400Regular' },
  aiRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  aiItem: { color: C.white, fontSize: 13.5, flex: 1, fontFamily: 'Poppins_400Regular' },

  footer: { alignItems: 'center', gap: 10, marginTop: 20, paddingBottom: 8 },
  footerLogo: { width: 52, height: 52 },
  footerText: {
    color: C.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
});