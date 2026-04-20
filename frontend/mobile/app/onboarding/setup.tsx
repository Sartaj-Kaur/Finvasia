import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { C, FONTS } from '../../src/theme';
import BackgroundShapes from '../../src/components/BackgroundShapes';

const AGENTS = [
  { id: 'SPROUT', name: 'SPROUT', color: C.GREEN, dim: C.GREEN_DIM, border: C.BORDER_G, desc: 'Friendly · Simple · Encouraging' },
  { id: 'VOLT', name: 'VOLT', color: C.AMBER, dim: C.AMBER_DIM, border: C.BORDER_A, desc: 'Direct · No-BS · Energetic' },
  { id: 'ORACLE', name: 'ORACLE', color: C.BLUE, dim: C.BLUE_DIM, border: 'rgba(74,158,255,0.3)', desc: 'Technical · Precise · Strategic' },
];

export default function OnboardingSetup() {
  const router = useRouter();
  const [ageRange, setAgeRange] = useState('19-25');
  const [agent, setAgent] = useState('VOLT');

  const handleNext = async () => {
    await AsyncStorage.setItem('monager_user_age', ageRange);
    await AsyncStorage.setItem('monager_user_agent', agent);
    router.push('/onboarding/agent');
  };

  return (
    <SafeAreaView style={s.safe}>
      <BackgroundShapes />
      <View style={s.header}>
        <View style={s.progressDots}>
          <View style={[s.dot, s.dotActive]} />
          <View style={[s.dot, s.dotActive]} />
          <View style={s.dot} />
        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Section 1 - Age */}
        <Text style={s.sectionTitle}>How old are you?</Text>
        <View style={s.ageGrid}>
          {['13-18', '19-25', '26-35', '36+'].map(age => (
            <TouchableOpacity 
              key={age} 
              style={[s.agePill, ageRange === age && s.agePillActive]}
              onPress={() => setAgeRange(age)}
              activeOpacity={0.7}
            >
              <Text style={[s.ageText, ageRange === age && s.ageTextActive]}>{age}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section 2 - Agent */}
        <Text style={[s.sectionTitle, { marginTop: 40 }]}>Choose your Monager voice</Text>
        
        <View style={s.agentGrid}>
          {AGENTS.map((a, i) => {
            const isSelected = agent === a.id;
            return (
              <TouchableOpacity
                key={a.id}
                style={[
                  s.agentCard, 
                  i === 2 && s.agentCardFull, // make oralce full width to span column
                  { backgroundColor: a.dim, borderColor: isSelected ? a.color : a.border },
                  isSelected && s.agentCardSelected
                ]}
                onPress={() => setAgent(a.id)}
                activeOpacity={0.8}
              >
                <Text style={[s.agentTitle, { color: a.color }]}>{a.name}</Text>
                <Text style={s.agentDesc}>{a.desc}</Text>
              </TouchableOpacity>
            )
          })}
        </View>

      </ScrollView>

      {/* Footer */}
      <View style={s.footer}>
        <TouchableOpacity style={s.btn} onPress={handleNext} activeOpacity={0.8}>
          <Text style={s.btnText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  header: { alignItems: 'center', paddingVertical: 20 },
  progressDots: { flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.BORDER },
  dotActive: { backgroundColor: C.BLUE },
  
  scroll: { padding: 24, paddingBottom: 100 },
  sectionTitle: { fontFamily: FONTS.SYNE, fontSize: 28, color: C.T1, marginBottom: 20 },
  
  ageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  agePill: { backgroundColor: C.SURFACE, borderWidth: 1, borderColor: C.BORDER, borderRadius: 20, paddingVertical: 12, paddingHorizontal: 24, flex: 1, minWidth: '40%', alignItems: 'center' },
  agePillActive: { borderColor: C.BLUE, backgroundColor: C.BLUE_DIM },
  ageText: { fontFamily: FONTS.JAKARTA, fontSize: 16, color: C.T2 },
  ageTextActive: { color: C.BLUE, fontFamily: FONTS.JAKARTA_SEMI },

  agentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  agentCard: { borderWidth: 1, borderRadius: 16, padding: 16, width: '48%', flexGrow: 1 },
  agentCardFull: { width: '100%' },
  agentCardSelected: { borderWidth: 2, transform: [{ scale: 1.02 }] },
  agentTitle: { fontFamily: FONTS.SYNE, fontSize: 18, marginBottom: 8 },
  agentDesc: { fontFamily: FONTS.JAKARTA, fontSize: 12, color: C.T2, lineHeight: 18 },

  footer: { position: 'absolute', bottom: 40, left: 24, right: 24 },
  btn: { width: '100%', backgroundColor: C.BLUE, borderRadius: 14, height: 56, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontFamily: FONTS.SYNE, fontSize: 16, color: '#FFFFFF' }
});
