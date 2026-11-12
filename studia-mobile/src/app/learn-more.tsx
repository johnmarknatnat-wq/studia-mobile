import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// import {omscLogo} from '@/assets/images/omsc.logo.png';
// import {omsc} from '@/assets/images/omsu.jpg';

import { C } from '@/constants/studia-colors';

type Feature = {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  title: string;
  desc: string;
};

const instructorFeatures: Feature[] = [
  {
    icon: 'videocam',
    color: C.blue,
    title: 'Video Lesson & Material Repository',
    desc: 'Mag-upload ng lecture videos (.mp4, .mov), PDFs, at PowerPoint slides. Awtomatikong kukunin ng AI ang transcript at key learning objectives.',
  },
  {
    icon: 'sparkles',
    color: C.primary,
    title: 'AI Quiz Synthesizer',
    desc: 'Gumawa agad ng Multiple Choice, Identification, at Essay quizzes mula sa kahit anong module o video, may difficulty levels.',
  },
  {
    icon: 'bar-chart',
    color: C.green,
    title: 'Smart Analytics',
    desc: 'Real-time na engagement metrics, content consumption rates, at pag-detect ng mga konseptong nahihirapan ang students.',
  },
];

const studentFeatures: Feature[] = [
  {
    icon: 'document-text',
    color: C.red,
    title: 'AI Lesson Summarizer',
    desc: 'I-condense ang mahahabang lecture o reading files sa bullet points, TL;DR, o mind-maps sa loob ng ilang segundo.',
  },
  {
    icon: 'calendar',
    color: C.orange,
    title: 'Smart Task & Study Planner',
    desc: 'Binabasa ang deadlines, readings, at exam dates, tapos gumagawa ng optimized na daily study schedule.',
  },
  {
    icon: 'help-circle',
    color: C.primary,
    title: 'Interactive Practice Quizzes',
    desc: 'AI-generated flashcards at practice quizzes na may agarang rationale at feedback.',
  },
];

const aiCore = [
  'Speech-to-Text Transcription',
  'Automated Bullet & Concept Mapping',
  "Bloom's Taxonomy Quiz Synthesizer",
];

function FeatureCard({ icon, color, title, desc }: Feature) {
  return (
    <View style={s.card}>
      <View style={[s.iconBadge, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color={C.white} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.cardTitle}>{title}</Text>
        <Text style={s.cardDesc}>{desc}</Text>
      </View>
    </View>
  );
}

export default function LearnMoreScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.hero}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={s.back}>
            <Ionicons name="chevron-back" size={24} color={C.white} />
          </Pressable>
          <Ionicons name="school" size={44} color={C.gold} />
          <Text style={s.heroTitle}>STUDIA Mobile</Text>
          <Text style={s.heroSub}>AI-Powered Smart Learning & Task Management System</Text>
          <Text style={s.heroInst}>Occidental Mindoro State University — Mamburao Campus</Text>
        </View>

        <View style={s.body}>
          {/* About */}
          <Text style={s.sectionTitle}>Ano ang STUDIA?</Text>
          <Text style={s.paragraph}>
            Ang STUDIA Mobile ay mobile-first, AI-driven Learning Management System para sa OMSU –
            Mamburao Campus. Kapareho ng collaborative platforms tulad ng Google Classroom, pero may
            native AI para sa video lesson transcription, instant summarization, smart task
            management, at adaptive quiz generation para sa students at instructors.
          </Text>

          {/* Students */}
          <Text style={s.sectionTitle}>Para sa Students</Text>
          {studentFeatures.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}

          {/* Instructors */}
          <Text style={s.sectionTitle}>Para sa Instructors</Text>
          {instructorFeatures.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}

          {/* AI Core */}
          <View style={s.aiBox}>
            <View style={s.aiHeader}>
              <Ionicons name="hardware-chip" size={20} color={C.primaryDark} />
              <Text style={s.aiTitle}>AI Core Engine (LLM / Whisper)</Text>
            </View>
            {aiCore.map((item) => (
              <View key={item} style={s.aiRow}>
                <Ionicons name="checkmark-circle" size={18} color={C.green} />
                <Text style={s.aiItem}>{item}</Text>
              </View>
            ))}
          </View>

          {/* CTA */}
          {/* <Pressable style={s.cta} onPress={() => router.back()}>
            <Text style={s.ctaText}>Get Started</Text>
          </Pressable> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.primaryDark },
  scroll: { backgroundColor: C.surface, paddingBottom: 40 },
  hero: {
    backgroundColor: C.primaryDark,
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
    gap: 8,
  },
  back: { position: 'absolute', left: 16, top: 16 },
  heroTitle: { color: C.white, fontSize: 28, fontWeight: '800', marginTop: 8 },
  heroSub: { color: C.lavender, fontSize: 14, textAlign: 'center' },
  heroInst: { color: C.lavender, fontSize: 12, textAlign: 'center', opacity: 0.85 },
  body: { padding: 20, gap: 12 },
  sectionTitle: { color: C.text, fontSize: 18, fontWeight: '700', marginTop: 12 },
  paragraph: { color: C.muted, fontSize: 14, lineHeight: 22 },
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    padding: 14,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { color: C.text, fontSize: 15, fontWeight: '700', marginBottom: 4 },
  cardDesc: { color: C.muted, fontSize: 13, lineHeight: 19 },
  aiBox: {
    backgroundColor: C.lavender,
    borderRadius: 14,
    padding: 16,
    gap: 8,
    marginTop: 12,
  },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  aiTitle: { color: C.primaryDark, fontSize: 15, fontWeight: '700' },
  aiRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiItem: { color: C.text, fontSize: 13 },
  cta: {
    backgroundColor: C.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  ctaText: { color: C.white, fontSize: 16, fontWeight: '700' },
});