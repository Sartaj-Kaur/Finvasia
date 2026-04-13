import React, { useEffect, useState } from 'react';
import {
  Text, View, ScrollView, TouchableOpacity,
  SafeAreaView, Platform, StatusBar, StyleSheet
} from 'react-native';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withDelay, withSpring } from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { C } from '../../constants/Theme';

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

const PiggyGrid = () => {
  const [hasSwept, setHasSwept] = useState(false);
  const cells = Array.from({ length: 40 });
  const fillCount = 18;
  useEffect(() => { setTimeout(() => setHasSwept(true), 600); }, []);
  return (
    <Animated.View entering={FadeInUp.delay(100)} style={s.section}>
      <View style={s.sectionHeaderRow}>
        <Text style={s.sectionTitle}>Piggy Bank</Text>
        <View style={s.badge}><Text style={s.badgeText}>18 / 40 filled</Text></View>
      </View>
      <View style={s.gridCard}>
        <View style={s.gridWrap}>
          {cells.map((_, i) => <GridCell key={i} isFilled={i < fillCount && hasSwept} delay={i * 45} />)}
        </View>
        <View style={s.gridFooter}>
          <Text style={s.gridFooterText}>₹18,000 salvaged via AI sweeps</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const CaseFile = () => (
  <Animated.View entering={FadeInUp.delay(300)} style={s.section}>
    <Text style={s.sectionTitle}>Case File</Text>
    <View style={s.card}>
      {[
        { icon: 'shopping-bag', label: 'Top Spend', value: 'Swiggy — ₹1.2k', color: C.sand },
        { icon: 'heartbeat', label: 'Mood Correlation', value: 'Stressed → Overspend', color: C.red },
        { icon: 'line-chart', label: 'Total Invested', value: '₹4,200 this month', color: C.green },
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

const LetterPreview = ({ router }) => (
  <Animated.View entering={FadeInUp.delay(500)} style={s.section}>
    <Text style={s.sectionTitle}>Latest Dispatch</Text>
    <View style={s.letterCard}>
      <Text style={s.letterSalut}>Dear Navya,</Text>
      <Text style={s.letterBody} numberOfLines={3}>
        March was a quiet month, and quiet is good. You managed to rein in the impulsive weekend spending,
        and we are starting to see the compound effects taking root in your emergency allocation...
      </Text>
      <View style={s.letterFade} />
      <TouchableOpacity style={s.readMoreBtn} onPress={() => router.push('/letter')} activeOpacity={0.8}>
        <Text style={s.readMoreText}>Read Full Letter</Text>
        <FontAwesome name="arrow-right" size={12} color={C.sand} style={{ marginLeft: 6 }} />
      </TouchableOpacity>
    </View>
  </Animated.View>
);

export default function ActivityScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.delay(50)} style={{ marginBottom: 28 }}>
          <Text style={s.pageTitle}>Activity</Text>
          <Text style={s.pageSubtitle}>Your AI's field notes</Text>
        </Animated.View>
        <PiggyGrid />
        <CaseFile />
        <LetterPreview router={router} />
        <View style={{ height: 110 }} />
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
  letterCard: {
    backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5,
  },
  letterSalut: { fontSize: 17, fontWeight: '600', color: C.cream, paddingHorizontal: 20, paddingTop: 20, marginBottom: 10 },
  letterBody: { fontSize: 14, color: C.creamDim, lineHeight: 22, paddingHorizontal: 20 },
  letterFade: { height: 28, marginTop: -14, backgroundColor: C.surface + 'CC' },
  readMoreBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderTopWidth: 1, borderTopColor: C.border,
  },
  readMoreText: { fontSize: 12, fontWeight: '700', color: C.sand, textTransform: 'uppercase', letterSpacing: 1 },
});
