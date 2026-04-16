import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView,
  ActivityIndicator, StyleSheet, Platform, StatusBar
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';
import { fetchApi } from '../../utils/api';
import { C } from '../../constants/Theme';
import { BgShapes } from '../../components/ui/BgShapes';

export default function Step3Bank() {
  const { completeOnboarding, currentUser } = useAuth();
  const router = useRouter(); // Auto-imported from expo-router if needed
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    router.push('/(onboarding)/step4-setu');
  };

  return (
    <SafeAreaView style={s.safe}>
      <BgShapes variant="auth" />
      <View style={s.container}>

        {!loading ? (
          <Animated.View entering={FadeInUp} exiting={FadeOut} style={s.content}>
            {/* Document stack visual */}
            <View style={s.visualContainer}>
              <View style={[s.docBase, s.docBack]} />
              <View style={[s.docBase, s.docFront]} />
            </View>

            <Text style={s.title}>Read-Only Access</Text>
            <Text style={s.description}>
              Monager analyzes your last 90 days of transactions to build your passive intelligence model.
              We use Setu (AA) to securely sync your ledger without ever seeing your credentials.
            </Text>

            <TouchableOpacity
              style={s.primaryBtn}
              onPress={handleConnect}
              activeOpacity={0.85}
            >
              <Text style={s.primaryBtnText}>Sync via Setu</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInUp} style={s.loadingContainer}>
            <ActivityIndicator size="large" color={C.terra} />
            <Text style={s.loadingTitle}>Fetching Ledger...</Text>
            <Text style={s.loadingSub}>Analyzing 3 months of noise...</Text>
          </Animated.View>
        )}

      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1, paddingHorizontal: 32, justifyContent: 'center' },
  content: { alignItems: 'center' },
  visualContainer: { width: 100, height: 100, alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  docBase: {
    width: 60, height: 76, borderRadius: 8, borderWidth: 2, position: 'absolute',
  },
  docBack: {
    backgroundColor: C.terra + '20', borderColor: C.terra + '40',
    transform: [{ rotate: '-12deg' }, { translateX: -15 }],
  },
  docFront: {
    backgroundColor: C.surface, borderColor: '#FFFFFF',
    transform: [{ rotate: '8deg' }, { translateX: 15 }],
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4,
  },
  title: { fontSize: 28, fontWeight: '800', color: C.surfaceHigh, marginBottom: 16, textAlign: 'center' },
  description: {
    fontSize: 15, color: C.creamDim, lineHeight: 24, textAlign: 'center',
    marginBottom: 48, fontWeight: '500',
  },
  primaryBtn: {
    backgroundColor: C.terra, borderRadius: 16, paddingVertical: 20, paddingHorizontal: 40,
    width: '100%', alignItems: 'center',
    shadowColor: C.terra, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 17, letterSpacing: 0.3 },
  loadingContainer: { alignItems: 'center' },
  loadingTitle: { fontSize: 24, fontWeight: '800', color: C.surfaceHigh, marginTop: 24, marginBottom: 8 },
  loadingSub: { fontSize: 14, color: C.creamDim, fontStyle: 'italic', fontWeight: '500' },
});
