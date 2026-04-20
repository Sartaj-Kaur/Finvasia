import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { C, FONTS, globalStyles } from '../../src/theme';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    
    setIsLoading(true);
    try {
      // 100% Offline Mock Authentication for Demo
      await new Promise(res => setTimeout(res, 800)); // fake loading delay
      
      await AsyncStorage.setItem('demo_bypassed_auth', 'true');
      const onboardingDone = await AsyncStorage.getItem('onboardingComplete');
      const setuDone = await AsyncStorage.getItem('setuLinked');
      
      if (onboardingDone !== 'true') {
        router.replace('/onboarding');
      } else if (setuDone !== 'true') {
        router.replace('/setu-link');
      } else {
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      alert("Offline Auth Mock Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.root}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'center' }}>
        <View style={s.card}>
          <Text style={s.title}>jUMPP</Text>
          <Text style={s.subtitle}>{isLogin ? "Welcome back, agent." : "Create your identity."}</Text>

          <TextInput
            style={s.input}
            placeholder="Email address"
            placeholderTextColor={C.T3}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={s.input}
            placeholder="Password"
            placeholderTextColor={C.T3}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={s.btn} activeOpacity={0.8} onPress={handleAuth} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#1A1000" /> : <Text style={s.btnTxt}>{isLogin ? "LOGIN" : "SIGN UP"}</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 24, alignItems: 'center' }} onPress={() => setIsLogin(!isLogin)}>
            <Text style={s.toggleTxt}>{isLogin ? "No account?  Sign Up" : "Have an account?  Login"}</Text>
          </TouchableOpacity>

          {/* Hackathon Demo Bypass */}
          <TouchableOpacity style={{ marginTop: 40, alignItems: 'center' }} onPress={async () => {
            await AsyncStorage.clear(); // Clear all old cached state to allow fresh testing
            await AsyncStorage.setItem('demo_bypassed_auth', 'true');
            router.replace('/onboarding');
          }}>
            <Text style={[s.toggleTxt, { color: C.T3, fontSize: 11 }]}>Hackathon Override: Force Fresh Onboarding</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.BASE, padding: 24 },
  card: { backgroundColor: C.CARD, padding: 24, borderRadius: 20, borderWidth: 1, borderColor: C.BORDER },
  title: { fontFamily: FONTS.SYNE, fontSize: 36, color: C.GREEN, textAlign: 'center' },
  subtitle: { fontFamily: FONTS.JAKARTA, fontSize: 14, color: C.T2, textAlign: 'center', marginBottom: 32, marginTop: 8 },
  input: { height: 56, backgroundColor: C.SURFACE, borderRadius: 12, borderWidth: 1, borderColor: C.BORDER, fontFamily: FONTS.JAKARTA, color: C.T1, paddingHorizontal: 16, marginBottom: 16 },
  btn: { height: 56, backgroundColor: C.GREEN, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  btnTxt: { fontFamily: FONTS.SYNE, fontSize: 16, color: '#1A1000' },
  toggleTxt: { fontFamily: FONTS.JAKARTA_SEMI, fontSize: 13, color: C.AMBER }
});
