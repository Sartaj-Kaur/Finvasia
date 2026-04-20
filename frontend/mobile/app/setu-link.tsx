import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import { Shield, ChevronRight } from 'react-native-feather';
import { auth } from '../src/services/firebase';
import { C, FONTS, globalStyles } from '../src/theme';
import { fetchApi } from '../utils/api';

export default function SetuLink() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const startSetuFlow = async () => {
    if (mobile.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    let uid = auth.currentUser?.uid;

    if (!uid) {
      uid = "demo_bypass_user_" + Math.floor(Math.random() * 1000);
    }

    setIsLoading(true);
    try {
      // 1. Ask Backend to generate Setu Consent URL
      const data = await fetchApi(`/setu/consent/${uid}`, {
        method: 'POST',
        body: JSON.stringify({ user_id: uid, mobile_number: mobile })
      });

      if (!data || !data.url) {
        throw new Error("Consent URL generation failed. Check mobile format.");
      }

      // 2. Open Setu Interface
      await WebBrowser.openBrowserAsync(data.url);

      await AsyncStorage.setItem('setuLinked', 'true');
      router.replace('/(tabs)');

    } catch (e: any) {
      alert(`Setu Connection Error:\n${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const skipSetu = async () => {
    await AsyncStorage.setItem('setuLinked', 'true'); // bypass
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={s.root}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
        
        <View style={s.shieldCirc}>
          <Shield color={C.GREEN} width={40} height={40} />
        </View>

        <Text style={s.title}>Connect Your Bank</Text>
        <Text style={s.sub}>jUMPP uses Setu Account Aggregator to securely sync your transactions and analyze your financial DNA via RBI regulated channels.</Text>

        <View style={s.warningCard}>
          <Text style={s.warnTxt}>Use <Text style={{ fontFamily: FONTS.MONO, color: C.AMBER }}>8080808080</Text> and OTP <Text style={{ fontFamily: FONTS.MONO, color: C.AMBER }}>1234</Text> for Setu Sandbox Demo.</Text>
        </View>

        <TextInput
          style={s.input}
          placeholder="Linked Mobile Number"
          placeholderTextColor={C.T3}
          keyboardType="phone-pad"
          maxLength={10}
          value={mobile}
          onChangeText={setMobile}
        />

        <TouchableOpacity style={s.btn} activeOpacity={0.8} onPress={startSetuFlow} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#1A1000" />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={s.btnTxt}>SECURE LINK</Text>
              <ChevronRight color="#1A1000" width={18} height={18} />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={s.skipBtn} onPress={skipSetu}>
          <Text style={s.skipTxt}>Skip for now</Text>
        </TouchableOpacity>

        {/* Hackathon Setu Simulator Bypass */}
        <TouchableOpacity style={{ marginTop: 40, alignItems: 'center' }} onPress={async () => {
          alert("[DEMO] Bank Account Linked Successfully!");
          await AsyncStorage.setItem('setuLinked', 'true');
          router.replace('/(tabs)');
        }}>
          <Text style={[s.skipTxt, { color: C.T3, fontSize: 11 }]}>Hackathon Override: Simulate Success & Proceed</Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.BASE },
  shieldCirc: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.GREEN_DIM, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontFamily: FONTS.SYNE, fontSize: 32, color: C.T1, marginBottom: 12 },
  sub: { fontFamily: FONTS.JAKARTA, fontSize: 15, color: C.T2, lineHeight: 24, marginBottom: 24 },
  
  warningCard: { backgroundColor: C.CARD, borderLeftWidth: 3, borderLeftColor: C.AMBER, padding: 16, borderRadius: 12, marginBottom: 32 },
  warnTxt: { fontFamily: FONTS.JAKARTA, fontSize: 13, color: C.T1, lineHeight: 20 },

  input: { height: 56, backgroundColor: C.SURFACE, borderRadius: 12, borderWidth: 1, borderColor: C.BORDER, fontFamily: FONTS.JAKARTA, color: C.T1, paddingHorizontal: 16, marginBottom: 24 },
  
  btn: { height: 56, backgroundColor: C.GREEN, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnTxt: { fontFamily: FONTS.SYNE, fontSize: 16, color: '#1A1000' },
  
  skipBtn: { marginTop: 24, alignItems: 'center' },
  skipTxt: { fontFamily: FONTS.JAKARTA_SEMI, fontSize: 14, color: C.T3 }
});
