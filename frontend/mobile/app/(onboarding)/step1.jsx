import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, SafeAreaView,
  Platform, StatusBar, StyleSheet, KeyboardAvoidingView, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { C } from '../../constants/Theme';
import { BgShapes } from '../../components/ui/BgShapes';

export default function Step1() {
  const [name, setName] = useState('');
  const [income, setIncome] = useState('');
  const router = useRouter();

  const handleContinue = () => {
    if (!name.trim() || !income.trim()) return;
    router.push({
      pathname: '/(onboarding)/step2-ocean',
      params: { name: name.trim(), income: income.trim() }
    });
  };

  return (
    <SafeAreaView style={s.safe}>
      <BgShapes variant="auth" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          <Animated.View entering={FadeInDown.delay(100).springify()} style={s.content}>
            <Text style={s.title}>Let's start{'\n'}the file.</Text>
            <Text style={s.subtitle}>
              What do you go by, and what's your approximate monthly target?
            </Text>

            <View style={s.inputContainer}>
              <Text style={s.label}>NAME</Text>
              <TextInput
                style={s.input}
                placeholder="e.g. Navya"
                placeholderTextColor={C.creamFaint}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={s.inputContainer}>
              <Text style={s.label}>MONTHLY INCOME (₹)</Text>
              <TextInput
                style={s.input}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={C.creamFaint}
                value={income}
                onChangeText={setIncome}
              />
            </View>

            <TouchableOpacity
              style={[s.primaryBtn, (!name || !income) && s.disabledBtn]}
              onPress={handleContinue}
              activeOpacity={0.85}
            >
              <Text style={s.primaryBtnText}>Continue →</Text>
            </TouchableOpacity>
          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  scroll: { flexGrow: 1, paddingHorizontal: 32, justifyContent: 'center' },
  content: { paddingVertical: 40 },
  title: { fontSize: 36, fontWeight: '900', color: C.surfaceHigh, letterSpacing: -0.5, lineHeight: 42, marginBottom: 12 },
  subtitle: { fontSize: 16, color: C.creamDim, marginBottom: 48, lineHeight: 24, fontWeight: '500' },
  inputContainer: { marginBottom: 32 },
  label: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, color: C.creamDim, marginBottom: 12 },
  input: {
    backgroundColor: C.surface, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 18,
    fontSize: 20, fontWeight: '700', color: C.surfaceHigh,
    borderWidth: 1, borderColor: '#EAECEB',
  },
  primaryBtn: {
    backgroundColor: C.terra, borderRadius: 16, paddingVertical: 20, alignItems: 'center',
    marginTop: 20, shadowColor: C.terra, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  disabledBtn: { opacity: 0.5 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },
});
