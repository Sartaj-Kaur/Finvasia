import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, SafeAreaView,
  ActivityIndicator, StyleSheet, Platform, StatusBar, KeyboardAvoidingView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { fetchApi } from '../../utils/api';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

export default function Step4Setu() {
  const router = useRouter();
  const { completeOnboarding, currentUser } = useAuth();
  const [step, setStep] = useState('mobile'); // 'mobile' or 'otp'
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = () => {
    if (mobile.length > 0) {
      setStep('otp');
    }
  };

  const handleLogin = async () => {
    if (!otp) return;
    setLoading(true);
    try {
      if (currentUser && currentUser.uid) {
        // Trigger the fake data injection just like step3 used to
        await fetchApi(`/fake-bank/${currentUser.uid}/inject-data`, { method: 'POST' });
      }
    } catch (e) {
      console.error("Error connecting bank:", e);
    } finally {
      completeOnboarding();
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={s.container}>
          
          {/* Header */}
          <View style={s.header}>
            <View style={s.headerLeft}>
              <View style={s.logoBox}>
                <Text style={s.logoText}>Logo</Text>
              </View>
              <Text style={s.headerTitle}>Monager</Text>
            </View>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={s.exitText}>Exit</Text>
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View style={s.content}>
            <Text style={s.mainHeading}>Share your financial data</Text>
            
            {step === 'mobile' ? (
              <Animated.View entering={FadeIn}>
                <Text style={s.subHeading}>Enter your mobile number</Text>
                <View style={s.inputRow}>
                  <TextInput 
                    style={s.input}
                    placeholder="9876543210"
                    keyboardType="number-pad"
                    value={mobile}
                    onChangeText={setMobile}
                    autoFocus
                  />
                  <TouchableOpacity style={s.actionBtn} onPress={handleSendOtp} activeOpacity={0.8}>
                    <Text style={s.actionBtnText}>Send OTP</Text>
                  </TouchableOpacity>
                </View>
                <Text style={s.infoText}>We will send an OTP for verification</Text>
              </Animated.View>
            ) : (
              <Animated.View entering={FadeInUp}>
                <Text style={s.subHeading}>Enter OTP sent to {mobile || '9876543210'}</Text>
                <View style={s.inputRow}>
                  <TextInput 
                    style={s.input}
                    placeholder="Enter OTP"
                    keyboardType="number-pad"
                    value={otp}
                    onChangeText={setOtp}
                    autoFocus
                  />
                  <TouchableOpacity style={s.actionBtn} onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
                    {loading ? (
                      <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                      <Text style={s.actionBtnText}>Login</Text>
                    )}
                  </TouchableOpacity>
                </View>
                <View style={s.resendRow}>
                  <TouchableOpacity>
                    <Text style={s.resendText}>Resend OTP</Text>
                  </TouchableOpacity>
                  <Text style={s.retriesText}>  3 retries left</Text>
                </View>
              </Animated.View>
            )}
          </View>

          <View style={{ flex: 1 }} />

          {/* Footer */}
          <View style={s.footer}>
             <View style={s.setuLogoCircle}>
                <Text style={s.setuLogoText}>S</Text>
             </View>
             <Text style={s.footerText}>
               Secure data sharing powered by Setu AA,{"\n"}an RBI licensed Account Aggregator.{"\n"}
               <Text style={s.learnMore}>Learn more ↗</Text>
             </Text>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF'
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoBox: { backgroundColor: '#E0E0E0', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 4, marginRight: 10 },
  logoText: { fontSize: 10, fontWeight: '700', color: '#333' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1B2C41' },
  exitText: { fontSize: 16, fontWeight: '700', color: '#1B1446' },

  content: { paddingHorizontal: 24, paddingTop: 40 },
  mainHeading: { fontSize: 22, fontWeight: '800', color: '#1A2E46', marginBottom: 28 },
  
  subHeading: { fontSize: 15, color: '#6A7181', marginBottom: 16, fontWeight: '500' },
  inputRow: { flexDirection: 'row', alignItems: 'stretch', marginBottom: 12 },
  input: {
    flex: 1, borderWidth: 1.5, borderColor: '#302652', borderRightWidth: 0,
    borderTopLeftRadius: 6, borderBottomLeftRadius: 6,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 18, color: '#1B2C41'
  },
  actionBtn: {
    backgroundColor: '#438392', paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center',
    borderTopRightRadius: 6, borderBottomRightRadius: 6, borderWidth: 1.5, borderColor: '#302652', borderLeftWidth: 1.5
  },
  actionBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },

  infoText: { fontSize: 13, color: '#6A7181' },
  resendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  resendText: { fontSize: 13, fontWeight: '700', color: '#27174C' },
  retriesText: { fontSize: 13, color: '#9197A3' },

  footer: {
    backgroundColor: '#F7F9FA', padding: 24, flexDirection: 'row', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: '#EEEEEE'
  },
  setuLogoCircle: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#0B0228',
    justifyContent: 'center', alignItems: 'center', marginRight: 16
  },
  setuLogoText: { color: '#44DEC5', fontWeight: '800', fontSize: 16 },
  footerText: { flex: 1, fontSize: 13, color: '#667085', lineHeight: 20 },
  learnMore: { color: '#2D5BD0', fontWeight: '600' }
});
