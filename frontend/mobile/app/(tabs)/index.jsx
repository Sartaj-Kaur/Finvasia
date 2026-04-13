import React, { useState } from 'react';
import {
  Text, View, ScrollView, SafeAreaView,
  Platform, StatusBar, StyleSheet, TouchableOpacity
} from 'react-native';
import Animated, { FadeInUp, FadeInDown, FadeOut, Layout } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { C } from '../../constants/Theme';
import { StickyNote } from '../../components/ui/StickyNote';
import { ProgressBar } from '../../components/ui/ProgressBar';

const MoodCheck = () => {
  const [logged, setLogged] = useState(false);
  if (logged) return null;

  const moods = [
    { icon: 'smile-o', label: 'Happy', color: C.green, bg: C.green + '28' },
    { icon: 'meh-o', label: 'Meh', color: C.sand, bg: C.sand + '28' },
    { icon: 'frown-o', label: 'Stressed', color: C.red, bg: C.red + '28' },
  ];

  return (
    <Animated.View exiting={FadeOut} layout={Layout.springify()} style={s.section}>
      <Text style={s.sectionTitle}>How are you feeling?</Text>
      <View style={s.moodRow}>
        {moods.map(({ icon, label, color, bg }) => (
          <TouchableOpacity
            key={label}
            style={[s.moodBtn, { backgroundColor: bg, borderColor: color + '50' }]}
            onPress={() => setLogged(true)}
            activeOpacity={0.8}
          >
            <FontAwesome name={icon} size={28} color={color} />
            <Text style={[s.moodLabel, { color }]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View entering={FadeInDown.delay(50)} style={s.header}>
          <View>
            <Text style={s.greeting}>{greeting} 👋</Text>
            <Text style={s.headline}>While you were away...</Text>
          </View>
          <TouchableOpacity style={s.avatarBtn} onPress={() => router.push('/(tabs)/profile')}>
            <FontAwesome name="user" size={16} color={C.terra} />
          </TouchableOpacity>
        </Animated.View>

        {/* Monager's Note */}
        <StickyNote content={`"You spent ₹1,240 on food this week. I kept ₹400 working in liquid savings."`} delay={150} />

        {/* Budget Binder */}
        <Animated.View entering={FadeInUp.delay(250)} style={s.section}>
          <View style={s.sectionHeaderRow}>
            <Text style={s.sectionTitle}>Budget Binder</Text>
            <Text style={s.sectionSub}>This month</Text>
          </View>
          <View style={s.card}>
            <ProgressBar label="Needs" percentage={65} />
            <ProgressBar label="Wants" percentage={82} />
            <ProgressBar label="Savings" percentage={40} />
          </View>
        </Animated.View>

        {/* Mood */}
        <Animated.View entering={FadeInUp.delay(350)} layout={Layout.springify()}>
          <MoodCheck />
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInUp.delay(450)} style={s.section}>
          <Text style={s.sectionTitle}>Quick Actions</Text>
          <View style={s.actionGrid}>
            {[
              { icon: 'plus', label: 'Add Expense', color: C.terra, bg: C.terra + '28', action: null },
              { icon: 'envelope-o', label: 'Read Letter', color: C.blue, bg: C.blue + '28', action: () => router.push('/letter') },
              { icon: 'camera', label: 'Scan Receipt', color: C.green, bg: C.green + '28', action: () => router.push('/(tabs)/scan') },
            ].map(({ icon, label, color, bg, action }) => (
              <TouchableOpacity key={label} style={s.actionCard} onPress={action} activeOpacity={0.8}>
                <View style={[s.actionIcon, { backgroundColor: bg }]}>
                  <FontAwesome name={icon} size={20} color={color} />
                </View>
                <Text style={s.actionLabel}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 13, color: C.creamDim, marginBottom: 2 },
  headline: { fontSize: 22, fontWeight: '700', color: C.cream, letterSpacing: -0.3 },
  avatarBtn: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: C.surface,
    borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center',
  },
  section: { marginBottom: 28 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: C.creamDim, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 },
  sectionSub: { fontSize: 12, color: C.creamFaint },
  card: {
    backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 4,
  },
  moodRow: { flexDirection: 'row', gap: 12 },
  moodBtn: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 16, borderWidth: 1.5, gap: 8 },
  moodLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  actionGrid: { flexDirection: 'row', gap: 12 },
  actionCard: {
    flex: 1, backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border,
    padding: 16, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3,
  },
  actionIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  actionLabel: { fontSize: 11, fontWeight: '600', color: C.cream, textAlign: 'center' },
});
