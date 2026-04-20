import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Svg, Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { C, FONTS } from '../../src/theme';
import BackgroundShapes from '../../src/components/BackgroundShapes';

export default function OnboardingWelcome() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [focused, setFocused] = useState(false);

  const handleNext = async () => {
    if (name.trim()) {
      await AsyncStorage.setItem('monager_user_name', name);
      router.push('/onboarding/setup');
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <BackgroundShapes />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <Text style={s.logoText}>MONAGER</Text>

          {/* Abstract M SVG Graphic */}
          <View style={s.graphicContainer}>
            <View style={s.glow} />
            <Svg width="120" height="120" viewBox="0 0 100 100">
              <Defs>
                <SvgGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={C.BLUE} stopOpacity="1" />
                  <Stop offset="1" stopColor={C.BLUE} stopOpacity="0.2" />
                </SvgGradient>
              </Defs>
              <Path 
                d="M10 90 L30 30 L50 60 L70 30 L90 90" 
                fill="none" 
                stroke="url(#grad)" 
                strokeWidth="12" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </Svg>
          </View>

          {/* Copy */}
          <Text style={s.heading}>Your money, finally understood.</Text>
          <Text style={s.subtext}>Monager watches your spending so you don't have to.</Text>

          {/* Input */}
          <View style={[s.inputContainer, focused && { borderColor: C.BORDER_G }]}>
            <TextInput
              style={s.input}
              placeholder="What should Monager call you?"
              placeholderTextColor={C.T2}
              value={name}
              onChangeText={setName}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </View>

          <View style={{ flex: 1 }} />

          {/* CTA */}
          <TouchableOpacity 
            style={[s.btn, !name.trim() && s.btnDisabled]} 
            onPress={handleNext} 
            disabled={!name.trim()}
            activeOpacity={0.8}
          >
            <Text style={s.btnText}>Get Started →</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 60, paddingBottom: 40 },
  
  logoText: { fontFamily: FONTS.SYNE, fontSize: 24, color: C.T1, letterSpacing: 4, textAlign: 'center', marginBottom: 60 },
  
  graphicContainer: { alignItems: 'center', justifyContent: 'center', height: 160, marginBottom: 40 },
  glow: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: C.YELLOW_DIM },
  
  heading: { fontFamily: FONTS.SYNE, fontSize: 36, color: C.T1, marginBottom: 16, lineHeight: 44 },
  subtext: { fontFamily: FONTS.JAKARTA, fontSize: 14, color: C.T2, lineHeight: 22, marginBottom: 40 },
  
  inputContainer: { backgroundColor: C.SURFACE, borderRadius: 16, borderWidth: 1, borderColor: C.BORDER, paddingHorizontal: 16, height: 60, justifyContent: 'center' },
  input: { fontFamily: FONTS.JAKARTA, fontSize: 16, color: C.T1, height: '100%' },
  
  btn: { width: '100%', backgroundColor: C.BLUE, borderRadius: 14, height: 56, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontFamily: FONTS.SYNE, fontSize: 16, color: '#FFFFFF' }
});
