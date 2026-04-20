import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../src/services/firebase';
import { C } from '../src/theme';

export default function AppGateway() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        const onboardingDone = await AsyncStorage.getItem('onboardingComplete');
        const setuDone = await AsyncStorage.getItem('setuLinked');
        const demoBypass = await AsyncStorage.getItem('demo_bypassed_auth');

        // If no user and NOT in bypass mode
        if (!user && demoBypass !== 'true') {
          if (onboardingDone === 'true') {
            router.replace('/(auth)/login');
          } else {
            router.replace('/onboarding');
          }
        } else {
          // Treat as authenticated!
          if (onboardingDone !== 'true') {
            router.replace('/onboarding');
          } else if (setuDone !== 'true') {
            router.replace('/setu-link');
          } else {
            router.replace('/(tabs)');
          }
        }
      } catch (e) {
        console.error("Gateway error:", e);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: C.BASE, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={C.GREEN} />
      </View>
    );
  }

  return null;
}
