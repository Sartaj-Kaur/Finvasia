import React, { useEffect, useState, useCallback } from 'react';
import {
  Text, View, ScrollView, TouchableOpacity,
  SafeAreaView, Platform, StatusBar, StyleSheet, RefreshControl
} from 'react-native';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withDelay, withSpring, interpolate } from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { fetchApi } from '../../utils/api';
import { C } from '../../constants/Theme';
import { BgShapes } from '../../components/ui/BgShapes';

const GridCell = ({ isFilled, delay }) => {
  const scale = useSharedValue(0);
  useEffect(() => {
    if (isFilled) scale.value = withDelay(delay, withSpring(1, { damping: 14 }));
    else scale.value = 0;
  }, [isFilled]);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }], opacity: scale.value }));
  return (
    <View style={s.cellBg}>
      <Animated.View style={[s.cellFill, animStyle]} />
    </View>
  );
};

const PiggyGrid = ({ data }) => {
  const [hasSwept, setHasSwept] = useState(false);
  const cells = Array.from({ length: 40 });
  const invTotal = data?.investment_total || 0;
  const fillCount = Math.min(40, Math.floor(invTotal / 500));
  
  useEffect(() => { setTimeout(() => setHasSwept(true), 600); }, []);
  return (
    <Animated.View entering={FadeInUp.delay(100)} style={s.section}>
      <View style={s.sectionHeaderRow}>
        <Text style={s.sectionTitle}>Piggy Bank</Text>
        <View style={s.badge}><Text style={s.badgeText}>{fillCount} / 40 filled</Text></View>
      </View>
      <View style={s.gridCard}>
        <View style={s.gridWrap}>
          {cells.map((_, i) => <GridCell key={i} isFilled={i < fillCount && hasSwept} delay={i * 45} />)}
        </View>
        <View style={s.gridFooter}>
          <Text style={s.gridFooterText}>₹{invTotal} salvaged via AI sweeps</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const CaseFile = ({ data }) => {
  const topCategory = data?.top_category || 'None';
  const mood = (data?.mood_summary?.stressed > data?.mood_summary?.happy) ? 'Stressed → Overspend' : 'Stable';
  const invested = data?.simulated_value ? `₹${data.simulated_value.toFixed(0)} simulated` : 'Loading...';

  return (
    <Animated.View entering={FadeInUp.delay(300)} style={s.section}>
      <Text style={s.sectionTitle}>Case File</Text>
      <View style={s.card}>
        {[
          { icon: 'shopping-bag', label: 'Top Spend', value: topCategory, color: C.sand },
          { icon: 'heartbeat', label: 'Mood Correlation', value: mood, color: C.red },
          { icon: 'line-chart', label: 'Compounded Value', value: invested, color: C.green },
      ].map(({ icon, label, value, color }, i) => (
        <View key={i}>
          <View style={s.statRow}>
            <View style={[s.statIcon, { backgroundColor: color + '20' }]}>
              <FontAwesome name={icon} size={15} color={color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.statLabel}>{label}</Text>
              <Text style={[s.statValue, { color }]}>{value}</Text>
            </View>
          </View>
          {i < 2 && <View style={s.divider} />}
        </View>
      ))}
    </View>
  </Animated.View>
  );
};

const LetterPreview = ({ router, letter }) => {
  const slideInOut = useSharedValue(0);

  useEffect(() => {
    slideInOut.value = withDelay(400, withSpring(1, { damping: 14, stiffness: 90 }));
  }, []);

  const letterAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(slideInOut.value, [0, 1], [40, -50]) }],
    opacity: interpolate(slideInOut.value, [0, 0.5, 1], [0, 1, 1])
  }));

  const msg = letter?.content || "Your latest personalized financial breakdown has arrived.";

  return (
    <View style={s.section}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <Text style={[s.sectionTitle, { marginBottom: 0 }]}>Cognitive Dispatch</Text>
      </View>

      <View style={s.sleeveContainer}>
        {/* The Sliding Inner Letter */}
        <Animated.View style={[s.innerLetter, letterAnimStyle]}>
          <Text style={s.letterSalutNew}>From: Monager AI</Text>
          <Text style={s.letterBodyNew} numberOfLines={2}>{msg}</Text>
          
          <TouchableOpacity style={s.readMorePill} onPress={() => router.push('/letter')} activeOpacity={0.8}>
            <Text style={s.readMorePillText}>OPEN DISPATCH</Text>
            <FontAwesome name="arrow-right" size={10} color="#1A3631" style={{ marginLeft: 6, marginTop: 1 }} />
          </TouchableOpacity>
        </Animated.View>

        {/* The Outer Sleeve (Foreground) */}
        <View style={s.sleeveCover}>
          <View style={s.sleeveIconWrap}>
             <FontAwesome name="folder-open" size={16} color="#1A3631" />
          </View>
          <Text style={s.sleeveTag}>CONFIDENTIAL ATTACHMENT</Text>
        </View>
      </View>
    </View>
  );
};

export default function ActivityScreen() {
  const [data, setData] = useState(null);
  const [letter, setLetter] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser } = useAuth();
  const router = useRouter();

  const loadData = useCallback(async () => {
    if (currentUser?.uid) {
      setRefreshing(true);
      try {
        const [sumRes, letterRes] = await Promise.all([
          fetchApi(`/insights/summary/${currentUser.uid}`),
          fetchApi(`/letter/${currentUser.uid}`)
        ]);
        setData(sumRes);
        setLetter(letterRes);
      } catch (e) {
        console.error('Activity fetch error:', e);
      } finally {
        setRefreshing(false);
      }
    }
  }, [currentUser]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  return (
    <SafeAreaView style={s.safe}>
      <BgShapes variant="activity" />
      <ScrollView 
        contentContainerStyle={s.scroll} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={loadData} 
            tintColor={C.terra} 
            colors={[C.terra]}
          />
        }
      >
        <Animated.View entering={FadeInUp.delay(50)} style={{ marginBottom: 28 }}>
          <Text style={s.pageTitle}>Activity</Text>
          <Text style={s.pageSubtitle}>Your AI's field notes</Text>
        </Animated.View>
        <PiggyGrid data={data} />
        <CaseFile data={data} />
        <LetterPreview router={router} letter={letter} />
        <View style={{ height: 160 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },
  pageTitle: { fontSize: 28, fontWeight: '700', color: C.cream, letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 14, color: C.creamDim, marginTop: 2 },
  section: { marginBottom: 28 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: C.creamDim, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 },
  badge: { backgroundColor: C.sand + '30', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 12, color: C.sand, fontWeight: '600' },
  card: {
    backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5,
  },
  gridCard: {
    backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5,
  },
  gridWrap: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 7, justifyContent: 'center' },
  cellBg: { width: 26, height: 26, borderRadius: 6, backgroundColor: C.surfaceHigh, borderWidth: 1, borderColor: C.border },
  cellFill: { width: '100%', height: '100%', backgroundColor: C.terra, borderRadius: 5 },
  gridFooter: { borderTopWidth: 1, borderTopColor: C.border, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center' },
  gridFooterText: { fontSize: 12, color: C.sand, fontWeight: '600' },
  statRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  statLabel: { fontSize: 12, color: C.creamFaint, marginBottom: 2 },
  statValue: { fontSize: 14, fontWeight: '700' },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 12 },
  sleeveContainer: {
    height: 190, position: 'relative', marginTop: 40, marginBottom: 20
  },
  innerLetter: {
    position: 'absolute', bottom: 30, left: 10, right: 10, height: 160,
    backgroundColor: C.terra, borderRadius: 24, padding: 24, paddingTop: 26,
    zIndex: 1, shadowColor: C.terra, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 15, elevation: 8
  },
  sleeveCover: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 75,
    backgroundColor: '#FFFFFF', borderRadius: 24,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20,
    zIndex: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 15,
  },
  sleeveIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: C.surface,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  sleeveTag: { fontSize: 12, fontWeight: '800', color: '#1A3631', letterSpacing: 1 },

  letterSalutNew: { fontSize: 16, fontWeight: '800', color: '#1A3631', marginBottom: 8 },
  letterBodyNew: { fontSize: 14, color: '#1A3631', opacity: 0.8, lineHeight: 20, fontWeight: '600', marginBottom: 12 },
  readMorePill: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20, alignSelf: 'flex-start'
  },
  readMorePillText: { fontSize: 11, fontWeight: '900', color: '#1A3631', letterSpacing: 0.5 },
});
