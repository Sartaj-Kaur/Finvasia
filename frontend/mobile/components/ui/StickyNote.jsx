import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { C } from '../../constants/Theme';

export function StickyNote({ content, signature = "— Monager", delay = 200 }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()} style={s.wrapper}>
      <View style={s.paper}>
        <View style={s.pinDot} />
        <Text style={s.content}>{content}</Text>
        <Text style={s.signature}>{signature}</Text>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrapper: { marginBottom: 28, paddingHorizontal: 4 },
  paper: {
    backgroundColor: C.surface, borderRadius: 4, padding: 24, paddingTop: 28,
    borderWidth: 1, borderColor: C.border,
    transform: [{ rotate: '-1.5deg' }],
    shadowColor: '#000', shadowOffset: { width: 2, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 6,
  },
  pinDot: {
    position: 'absolute', top: 10, left: '50%', width: 10, height: 10,
    borderRadius: 5, backgroundColor: C.terra, borderWidth: 1, borderColor: C.sand,
  },
  content: { fontSize: 17, lineHeight: 28, color: C.cream, fontStyle: 'italic', marginBottom: 16 },
  signature: { fontSize: 14, color: C.sand, fontStyle: 'italic', textAlign: 'right' },
});
