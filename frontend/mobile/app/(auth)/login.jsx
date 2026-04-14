import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView, TextInput,
  ActivityIndicator, Alert, StyleSheet, Platform, StatusBar, KeyboardAvoidingView, ScrollView
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { C } from '../../constants/Theme';
import { BgShapes } from '../../components/ui/BgShapes';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { loginWithEmail, registerWithEmail } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'dummy',
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || 'dummy',
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || 'dummy',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch(e => Alert.alert("Google Auth Error", e.message));
    }
  }, [response]);

  const handleEmailAuth = async () => {
    if (!email || !password) return Alert.alert('Required', 'Please enter your email and password.');
    setLoading(true);
    try {
      isRegistering ? await registerWithEmail(email, password) : await loginWithEmail(email, password);
    } catch (error) {
      Alert.alert('Authentication Failed', error.message);
    } finally { setLoading(false); }
  };

  const s = styles;
  return (
    <SafeAreaView style={s.safe}>
      <BgShapes variant="auth" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          <Animated.View entering={FadeInDown.delay(100).springify()} style={s.logoBlock}>
            <View style={s.logoCircle}>
              <FontAwesome name="book" size={36} color={C.terra} />
            </View>
            <Text style={s.appName}>Monager Pocket</Text>
            <Text style={s.tagline}>Your passive financial companion.</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(250).springify()} style={s.card}>
            <Text style={s.cardTitle}>{isRegistering ? 'Create Account' : 'Welcome Back'}</Text>

            <View style={s.inputGroup}>
              <Text style={s.inputLabel}>EMAIL</Text>
              <TextInput style={s.input} placeholder="you@example.com" placeholderTextColor={C.creamFaint}
                autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
            </View>

            <View style={s.inputGroup}>
              <Text style={s.inputLabel}>PASSWORD</Text>
              <TextInput style={s.input} placeholder="••••••••" placeholderTextColor={C.creamFaint}
                secureTextEntry value={password} onChangeText={setPassword} />
            </View>

            <TouchableOpacity style={s.primaryBtn} onPress={handleEmailAuth} disabled={loading} activeOpacity={0.85}>
              {loading ? <ActivityIndicator color={C.bg} /> : (
                <Text style={s.primaryBtnText}>{isRegistering ? 'Open Journal' : 'Unlock Journal'}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)} style={s.toggleRow}>
              <Text style={s.toggleText}>
                {isRegistering ? 'Already have an account? ' : "New here? "}
                <Text style={s.toggleLink}>{isRegistering ? 'Sign In' : 'Create Account'}</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400)} style={s.dividerRow}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>or continue with</Text>
            <View style={s.dividerLine} />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(500).springify()}>
            <TouchableOpacity style={s.googleBtn} onPress={() => promptAsync()} disabled={!request} activeOpacity={0.85}>
              <FontAwesome name="google" size={18} color={C.bg} style={{ marginRight: 12 }} />
              <Text style={s.googleBtnText}>Sign in with Google</Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  scroll: { paddingHorizontal: 24, paddingTop: 32 },
  logoBlock: { alignItems: 'center', marginBottom: 24 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: C.surface,
    borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center',
    marginBottom: 18, shadowColor: C.sand, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 14, elevation: 5,
  },
  appName: { fontSize: 28, fontWeight: '700', color: C.cream, letterSpacing: -0.5, marginBottom: 6 },
  tagline: { fontSize: 14, color: C.creamDim, fontStyle: 'italic' },
  card: {
    backgroundColor: C.surface, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: C.border, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 6,
  },
  cardTitle: { fontSize: 20, fontWeight: '700', color: C.cream, marginBottom: 24 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, color: C.creamDim, marginBottom: 8 },
  input: {
    backgroundColor: C.surfaceHigh, borderWidth: 1, borderColor: C.border, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: C.bg,
  },
  primaryBtn: {
    backgroundColor: C.terra, borderRadius: 14, paddingVertical: 16, alignItems: 'center',
    marginTop: 8, marginBottom: 16, shadowColor: C.terra, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 4,
  },
  primaryBtnText: { color: C.bg, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  toggleRow: { alignItems: 'center', paddingTop: 4 },
  toggleText: { fontSize: 14, color: C.creamDim },
  toggleLink: { fontWeight: '700', color: C.terra },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingHorizontal: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { marginHorizontal: 12, fontSize: 12, color: C.creamFaint, fontWeight: '500' },
  googleBtn: {
    flexDirection: 'row', backgroundColor: C.surfaceHigh, borderWidth: 1, borderColor: C.border,
    borderRadius: 14, paddingVertical: 16, alignItems: 'center', justifyContent: 'center',
  },
  googleBtnText: { color: C.bg, fontWeight: '700', fontSize: 16 },
});
