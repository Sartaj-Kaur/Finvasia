import React, { useState, useCallback } from 'react';
import {
  Text, View, ScrollView, SafeAreaView,
  Platform, StatusBar, StyleSheet, TouchableOpacity, ActivityIndicator,
  Modal, TextInput, Dimensions, RefreshControl
} from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { fetchApi } from '../../utils/api';
import { Feather } from '@expo/vector-icons';
import { C } from '../../constants/Theme';
import { StickyNoteStack } from '../../components/ui/StickyNote';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { BgShapes } from '../../components/ui/BgShapes';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [data, setData] = useState(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [tempName, setTempName] = useState('');
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [moodLogged, setMoodLogged] = useState(false);
  const [loggingMood, setLoggingMood] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (currentUser && currentUser.uid) {
      setRefreshing(true);
      try {
        const res = await fetchApi(`/binder/${currentUser.uid}`);
        setData(res);
        const fetchedName = res?.user?.name;
        if (!fetchedName || fetchedName === 'User' || fetchedName === 'Tester') {
          setShowNamePrompt(true);
        } else if (!moodLogged) {
          setTimeout(() => setShowMoodModal(true), 500);
        }
      } catch (e) {
        console.error('Home fetch error:', e);
      } finally {
        setRefreshing(false);
      }
    }
  }, [currentUser, moodLogged]);

  const submitName = async () => {
    if (!tempName.trim()) return;
    try {
      await fetchApi(`/users/${currentUser.uid}`, {
        method: 'POST',
        body: JSON.stringify({ name: tempName.trim(), income: data?.user?.income || 50000 }),
      });
      setShowNamePrompt(false);
      loadData();
    } catch (e) { console.error('Failed to update name', e); }
  };

  const logMood = async (mood, emoji) => {
    setLoggingMood(emoji);
    try {
      await fetchApi('/mood/log', {
        method: 'POST',
        body: JSON.stringify({ user_id: currentUser.uid, mood }),
      });
    } catch (e) { console.error('Mood log error:', e); }
    setMoodLogged(true);
    setShowMoodModal(false);
    setLoggingMood(null);
  };

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const greetingIcon = hour < 12 ? 'sunrise' : hour < 17 ? 'sun' : 'moon';
  const userName = data?.user?.name?.split(' ')[0] || 'there';

  const totalBudget = data?.binder_sections?.reduce((sum, s) => sum + Number(s.allocated_budget || 0), 0) || 0;
  const totalSpent  = data?.binder_sections?.reduce((sum, s) => sum + Number(s.amount_spent    || 0), 0) || 0;
  const totalRemaining = Math.max(0, totalBudget - totalSpent);
  const spentPct = totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0;
  const healthColor = spentPct > 85 ? C.red : spentPct > 60 ? '#F5A623' : C.green;

  return (
    <View style={s.safe}>
      <BgShapes variant="home" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
          bounces={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadData}
              tintColor={C.terra}
              colors={[C.terra]}
            />
          }
        >

          {/* ── TOP BAR ───────────────────────────────────────── */}
          <Animated.View entering={FadeInDown.delay(0)} style={s.topBar}>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Feather name={greetingIcon} size={14} color="#CEFB67" />
                <Text style={s.greetingSmall}>{greeting}</Text>
              </View>
              <Text style={s.greetingName}>{userName} 👋</Text>
            </View>
            <TouchableOpacity style={s.avatarBtn} onPress={() => router.push('/(tabs)/profile')} activeOpacity={0.8}>
              <Text style={s.avatarInitial}>{userName.charAt(0).toUpperCase()}</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* ── HERO BUDGET CARD ──────────────────────────────── */}
          <Animated.View entering={FadeInDown.delay(80)} style={s.heroCardWrap}>
            <LinearGradient
              colors={['#EDE9FF', '#E8F8F1', '#FAFFFE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.heroCard}
            >
              {/* Decorative ring ornament */}
              <View style={s.ringOuter}>
                <View style={s.ringMiddle}>
                  <View style={s.ringInner} />
                </View>
              </View>
              {/* Top accent bar */}
              <View style={s.heroAccentBar} />

              <Text style={s.heroLabel}>Monthly Budget</Text>
            <Text style={s.heroAmount}>
              ₹{Math.floor(totalBudget).toLocaleString('en-IN')}
            </Text>

            {/* Mini progress bar */}
            <View style={s.heroTrack}>
              <View style={[s.heroFill, { width: `${spentPct}%`, backgroundColor: healthColor }]} />
            </View>
            <View style={s.heroStats}>
              <View>
                <Text style={s.heroStatVal}>₹{Math.floor(totalSpent).toLocaleString('en-IN')}</Text>
                <Text style={s.heroStatLabel}>Spent</Text>
              </View>
              <View style={[s.healthPill, { backgroundColor: healthColor + '30' }]}>
                <View style={[s.healthDot, { backgroundColor: healthColor }]} />
                <Text style={[s.healthText, { color: healthColor }]}>
                  {spentPct > 85 ? 'Over Budget' : spentPct > 60 ? 'Watch Spend' : 'On Track'}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={s.heroStatVal}>₹{Math.floor(totalRemaining).toLocaleString('en-IN')}</Text>
                <Text style={s.heroStatLabel}>Left</Text>
              </View>
            </View>
          </LinearGradient>
          </Animated.View>

          {/* ── WHITE SHEET ───────────────────────────────────── */}
          <View style={s.sheet}>

            {/* Monager's Notes */}
            <Animated.View entering={FadeInUp.delay(220)} style={s.section}>
              <View style={s.sectionHeaderRow}>
                <Text style={s.sectionTitle}>Monager's Notes</Text>
                <View style={s.liveChip}>
                  <View style={s.liveDot} />
                  <Text style={s.liveText}>Live</Text>
                </View>
              </View>
              <StickyNoteStack notes={data?.sticky_notes} delay={250} />
            </Animated.View>

            {/* Budget Categories */}
            {data?.binder_sections && data.binder_sections.length > 0 && (
              <Animated.View entering={FadeInUp.delay(320)} style={s.section}>
                <View style={s.sectionHeaderRow}>
                  <Text style={s.sectionTitle}>Budget Tracker</Text>
                  <TouchableOpacity>
                    <Text style={s.sectionLink}>See All</Text>
                  </TouchableOpacity>
                </View>
                <View style={s.categoryCard}>
                  {data.binder_sections.map((sec, i) => (
                    <View key={sec.id || i}>
                      <ProgressBar
                        label={sec.category}
                        percentage={sec.allocated_budget > 0 ? (sec.amount_spent / sec.allocated_budget) * 100 : 0}
                        spent={sec.amount_spent}
                        budget={sec.allocated_budget}
                      />
                      {i < data.binder_sections.length - 1 && <View style={s.catDivider} />}
                    </View>
                  ))}
                </View>
              </Animated.View>
            )}

            {/* Quick Actions */}
            <Animated.View entering={FadeInUp.delay(420)} style={s.section}>
              <Text style={s.sectionTitle}>Quick Actions</Text>
              <View style={s.actionGrid}>
                {[
                  { icon: 'camera', label: 'Scan Receipt', sub: 'AI powered', bg: '#1A3631', iconColor: '#CEFB67', action: () => router.push('/(tabs)/scan') },
                  { icon: 'mail',   label: 'Dispatches',   sub: 'AI Letters',  bg: C.terra,    iconColor: '#3B0764', action: () => router.push('/letter') },
                  { icon: 'pie-chart', label: 'Analytics', sub: 'Insights',    bg: C.sand,     iconColor: '#0E4727', action: () => router.push('/(tabs)/activity') },
                  { icon: 'settings', label: 'Settings',  sub: 'Preferences', bg: C.surface,  iconColor: C.cream,  action: () => router.push('/(tabs)/profile') },
                ].map(({ icon, label, sub, bg, iconColor, action }) => (
                  <TouchableOpacity key={label} style={[s.actionCard, { backgroundColor: bg }]} onPress={action} activeOpacity={0.82}>
                    <View style={[s.actionIconWrap, { backgroundColor: iconColor + '22' }]}>
                      <Feather name={icon} size={20} color={iconColor} />
                    </View>
                    <Text style={[s.actionLabel, { color: bg === '#1A3631' ? '#FFF' : '#1A3631' }]}>{label}</Text>
                    <Text style={[s.actionSub, { color: bg === '#1A3631' ? '#A0ABA8' : '#1A363180' }]}>{sub}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>

          </View>
        </ScrollView>

        {/* Name Prompt Modal */}
        <Modal visible={showNamePrompt} transparent animationType="fade">
          <View style={s.modalOverlay}>
            <View style={s.modalBox}>
              <Text style={s.modalTitle}>Hello there! 👋</Text>
              <Text style={s.modalSub}>What should Monager call you?</Text>
              <TextInput
                style={s.modalInput}
                placeholder="e.g. Sartaj"
                value={tempName}
                onChangeText={setTempName}
                placeholderTextColor={C.creamFaint}
                autoFocus
              />
              <TouchableOpacity style={s.modalBtn} onPress={submitName} activeOpacity={0.8}>
                <Text style={s.modalBtnText}>Let's go!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Mood Check-in Modal */}
        <Modal visible={showMoodModal} transparent animationType="slide">
          <View style={s.moodOverlay}>
            <View style={s.moodSheet}>
              <View style={s.moodHandle} />
              <Text style={s.moodGreeting}>Hey {userName}! 👋</Text>
              <Text style={s.moodQuestion}>How are you feeling right now?</Text>
              <Text style={s.moodSub}>Your mood helps Monager give better advice.</Text>

              <View style={s.moodGrid}>
                {[
                  { emoji: '😄', label: 'Happy',    mood: 'happy',   color: '#10B981', bg: '#D1FAE5' },
                  { emoji: '😌', label: 'Calm',     mood: 'calm',    color: '#60A5FA', bg: '#DBEAFE' },
                  { emoji: '😐', label: 'Neutral',  mood: 'neutral', color: '#F59E0B', bg: '#FEF3C7' },
                  { emoji: '😟', label: 'Stressed', mood: 'stressed',color: '#EF4444', bg: '#FEE2E2' },
                  { emoji: '😴', label: 'Tired',    mood: 'tired',   color: '#8B5CF6', bg: '#EDE9FE' },
                  { emoji: '🤑', label: 'Motivated', mood: 'motivated', color: '#059669', bg: '#ECFDF5' },
                ].map(({ emoji, label, mood, color, bg }) => (
                  <TouchableOpacity
                    key={mood}
                    style={[s.moodOption, { backgroundColor: bg },
                      loggingMood === emoji && { borderWidth: 2, borderColor: color }
                    ]}
                    onPress={() => logMood(mood, emoji)}
                    activeOpacity={0.8}
                  >
                    <Text style={s.moodEmoji}>{emoji}</Text>
                    <Text style={[s.moodOptionLabel, { color }]}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity onPress={() => setShowMoodModal(false)} style={s.moodSkip}>
                <Text style={s.moodSkipText}>Skip for now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.surfaceHigh, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  scroll: { flexGrow: 1 },

  // ── TOP BAR
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12,
  },
  greetingSmall: { fontSize: 12, color: '#CEFB67', fontWeight: '700', letterSpacing: 0.5 },
  greetingName: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5, marginTop: 2 },
  avatarBtn: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: C.terra,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: { fontSize: 18, fontWeight: '900', color: '#1A3631' },

  // ── HERO CARD
  heroCardWrap: {
    marginHorizontal: 20, marginBottom: 0, borderRadius: 28,
    shadowColor: '#A58BFA', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10,
  },
  heroCard: {
    borderRadius: 28, padding: 24, overflow: 'hidden',
  },
  heroAccentBar: {
    position: 'absolute', top: 0, left: 28, right: 28, height: 3,
    backgroundColor: '#A58BFA', borderBottomLeftRadius: 4, borderBottomRightRadius: 4,
  },
  ringOuter: {
    position: 'absolute', top: -40, right: -40,
    width: 160, height: 160, borderRadius: 80,
    borderWidth: 24, borderColor: '#A58BFA15',
  },
  ringMiddle: {
    position: 'absolute', top: 16, left: 16, right: 16, bottom: 16,
    borderRadius: 60, borderWidth: 18, borderColor: '#34D39915',
  },
  ringInner: {
    position: 'absolute', top: 14, left: 14, right: 14, bottom: 14,
    borderRadius: 45, borderWidth: 12, borderColor: '#A58BFA10',
  },
  heroLabel: { fontSize: 12, fontWeight: '700', color: '#687B77', letterSpacing: 1.4, marginBottom: 6, marginTop: 12 },
  heroAmount: { fontSize: 38, fontWeight: '900', color: '#1A3631', letterSpacing: -1, marginBottom: 20 },
  heroTrack: { height: 8, backgroundColor: '#D5C5F640', borderRadius: 4, marginBottom: 16, overflow: 'hidden' },
  heroFill: { height: '100%', borderRadius: 4 },
  heroStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroStatVal: { fontSize: 15, fontWeight: '800', color: '#1A3631' },
  heroStatLabel: { fontSize: 11, color: '#687B77', fontWeight: '600', marginTop: 2 },
  healthPill: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, gap: 5 },
  healthDot: { width: 6, height: 6, borderRadius: 3 },
  healthText: { fontSize: 11, fontWeight: '800' },

  // ── WHITE SHEET
  sheet: {
    backgroundColor: C.bg,
    borderTopLeftRadius: 36, borderTopRightRadius: 36,
    marginTop: 24, paddingTop: 32, paddingHorizontal: 24, paddingBottom: 150,
  },
  section: { marginBottom: 32 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: C.cream, letterSpacing: -0.3 },
  sectionLink: { fontSize: 13, color: C.terra, fontWeight: '700' },
  liveChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.green + '20', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.green },
  liveText: { fontSize: 11, fontWeight: '800', color: C.green },

  // ── BUDGET CATEGORY CARD
  categoryCard: {
    backgroundColor: C.surface, borderRadius: 24, padding: 20,
  },
  catDivider: { height: 1, backgroundColor: C.border, marginVertical: 4 },

  // ── QUICK ACTIONS
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: {
    width: (width - 48 - 12) / 2,
    borderRadius: 24, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  actionIconWrap: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  actionLabel: { fontSize: 14, fontWeight: '800', marginBottom: 3 },
  actionSub: { fontSize: 11, fontWeight: '600' },

  // ── MODAL
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalBox: { backgroundColor: C.bg, width: '100%', borderRadius: 32, padding: 32 },
  modalTitle: { fontSize: 26, fontWeight: '900', color: C.cream, marginBottom: 8 },
  modalSub: { fontSize: 14, color: C.creamDim, marginBottom: 24, lineHeight: 22 },
  modalInput: { backgroundColor: C.surface, borderRadius: 20, fontSize: 18, color: C.cream, padding: 18, marginBottom: 24, fontWeight: '600' },
  modalBtn: { backgroundColor: C.surfaceHigh, paddingVertical: 18, borderRadius: 24, alignItems: 'center' },
  modalBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },

  // ── MOOD MODAL
  moodOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  moodSheet: {
    backgroundColor: C.bg, borderTopLeftRadius: 36, borderTopRightRadius: 36,
    padding: 32, paddingBottom: 50,
  },
  moodHandle: {
    width: 40, height: 5, backgroundColor: C.border, borderRadius: 3,
    alignSelf: 'center', marginBottom: 24, opacity: 0.5,
  },
  moodGreeting: { fontSize: 16, fontWeight: '700', color: C.terra, marginBottom: 8 },
  moodQuestion: { fontSize: 24, fontWeight: '900', color: C.cream, marginBottom: 8 },
  moodSub: { fontSize: 14, color: C.creamDim, marginBottom: 32, fontWeight: '500' },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  moodOption: {
    width: (width - 64 - 24) / 3,
    paddingVertical: 20, borderRadius: 24, alignItems: 'center', gap: 8,
    borderWidth: 2, borderColor: 'transparent',
  },
  moodEmoji: { fontSize: 28 },
  moodOptionLabel: { fontSize: 12, fontWeight: '800' },
  moodSkip: { marginTop: 32, alignItems: 'center' },
  moodSkipText: { fontSize: 14, color: C.creamDim, fontWeight: '700' },
});
