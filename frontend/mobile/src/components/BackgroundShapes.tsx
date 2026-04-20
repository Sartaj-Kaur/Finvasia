import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from '../theme';

const { width, height } = Dimensions.get('window');

export default function BackgroundShapes() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Top Left Blob */}
      <View style={[s.blob, { top: -100, left: -100, width: 300, height: 300 }]}>
        <LinearGradient
          colors={[C.SHAPE_YELLOW, 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Mid Right Blob */}
      <View style={[s.blob, { top: height * 0.3, right: -150, width: 400, height: 400 }]}>
        <LinearGradient
          colors={[C.SHAPE_BLUE, 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Bottom Left Blob */}
      <View style={[s.blob, { bottom: -100, left: -50, width: 350, height: 350 }]}>
        <LinearGradient
          colors={[C.SHAPE_PURPLE, 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <BlurView intensity={45} style={StyleSheet.absoluteFill} tint="light" />
    </View>
  );
}

const s = StyleSheet.create({
  blob: {
    position: 'absolute',
    borderRadius: 999,
    overflow: 'hidden',
  },
});
