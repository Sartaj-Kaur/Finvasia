import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeIn, FadeOut, ZoomIn, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { C, FONTS } from '../../src/theme';

const AGENT_COLORS: any = {
  SPROUT: C.GREEN,
  VOLT: C.AMBER,
  ORACLE: C.BLUE
};

export default function OnboardingReveal() {
  const router = useRouter();
  const [agent, setAgent] = useState('VOLT');
  const [userName, setUserName] = useState('');

  const ringScale = useSharedValue(0.8);
  const ringOpac = useSharedValue(1);

  useEffect(() => {
    AsyncStorage.getItem('monager_user_agent').then(res => res && setAgent(res));
    AsyncStorage.getItem('monager_user_name').then(res => res && setUserName(res));

    // Pulse animation
    ringScale.value = withRepeat(withTiming(1.5, { duration: 2000, easing: Easing.out(Easing.ease) }), -1, false);
    ringOpac.value = withRepeat(withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }), -1, false);

    // Auto transition to gateway after reveal
    setTimeout(async () => {
      await AsyncStorage.setItem('onboardingComplete', 'true');
      router.replace('/');
    }, 3500);
  }, []);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpac.value
  }));

  const color = AGENT_COLORS[agent];

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>
        
        <Animated.View entering={FadeIn.delay(500)} exiting={FadeOut}>
          <Text style={s.pretitle}>CALIBRATING YOUR MODEL</Text>
        </Animated.View>

        <Animated.View entering={ZoomIn.delay(1000).springify()} style={s.centerBox}>
          
          <Animated.View style={[s.glowRing, { borderColor: color }, ringStyle]} />
          
          <View style={[s.core, { backgroundColor: color }]}>
            <Text style={s.coreText}>{agent.charAt(0)}</Text>
          </View>

        </Animated.View>

        <Animated.View entering={FadeIn.delay(1800)} style={{ alignItems: 'center' }}>
          <Text style={[s.name, { color }]}>{agent}</Text>
          <Text style={s.sub}>is now online for you, {userName}.</Text>
        </Animated.View>

      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  
  pretitle: { fontFamily: FONTS.MONO, fontSize: 12, color: C.T2, letterSpacing: 3, marginBottom: 80 },
  
  centerBox: { width: 140, height: 140, alignItems: 'center', justifyContent: 'center', marginBottom: 60 },
  glowRing: { position: 'absolute', width: 140, height: 140, borderRadius: 70, borderWidth: 2 },
  core: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
  coreText: { fontFamily: FONTS.SYNE, fontSize: 36, color: C.BASE },

  name: { fontFamily: FONTS.SYNE, fontSize: 44, letterSpacing: 2, marginBottom: 12 },
  sub: { fontFamily: FONTS.JAKARTA, fontSize: 16, color: C.T2 }
});
