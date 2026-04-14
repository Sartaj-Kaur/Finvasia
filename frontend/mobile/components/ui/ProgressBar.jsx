import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { C } from '../../constants/Theme';

export function ProgressBar({ label, percentage, spent, budget }) {
  const widthVal = useSharedValue(0);
  useEffect(() => {
    widthVal.value = withSpring(percentage, { damping: 18, stiffness: 70 });
  }, [percentage]);

  const getBarColor = (pct) => {
    if (pct < 70) return C.green;   // moss — calm, healthy
    if (pct < 90) return C.sand;    // warm sand — cautionary, not alarming
    return C.red;                   // aged crimson — over-budget
  };

  const animatedFill = useAnimatedStyle(() => ({ width: `${widthVal.value}%` }));
  const color = getBarColor(percentage);

  return (
    <View style={s.container}>
      <View style={s.row}>
        <Text style={s.label}>{label}</Text>
        <Text style={[s.pct, { color }]}>{Number(percentage).toFixed(2)}%</Text>
      </View>
      <View style={s.track}>
        <Animated.View style={[s.fill, animatedFill, { backgroundColor: color }]} />
      </View>
      {spent !== undefined && budget !== undefined && (
        <View style={s.analyticsRow}>
          <Text style={s.analyticText}>₹{Math.floor(spent).toLocaleString("en-IN")} spent</Text>
          <Text style={s.analyticText}>₹{Math.floor(budget - spent).toLocaleString("en-IN")} left</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginBottom: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  label: { fontSize: 14, fontWeight: '700', color: '#1A3631' },
  pct: { fontSize: 14, fontWeight: '800', color: '#1A3631' },
  track: { height: 16, backgroundColor: '#EAECEB', borderRadius: 8, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 8 },
  analyticsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  analyticText: { fontSize: 12, color: C.creamDim, fontWeight: '600' }
});
