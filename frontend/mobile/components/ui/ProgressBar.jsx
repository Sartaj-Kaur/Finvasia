import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { C } from '../../constants/Theme';

export function ProgressBar({ label, percentage }) {
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
        <Text style={[s.pct, { color }]}>{percentage}%</Text>
      </View>
      <View style={s.track}>
        <Animated.View style={[s.fill, animatedFill, { backgroundColor: color }]} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginBottom: 18 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label: { fontSize: 12, fontWeight: '700', color: C.creamDim, textTransform: 'uppercase', letterSpacing: 0.8 },
  pct: { fontSize: 13, fontWeight: '800' },
  track: { height: 6, backgroundColor: C.surfaceHigh, borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
});
