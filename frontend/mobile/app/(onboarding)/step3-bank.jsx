import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';

export default function Step3Bank() {
  const { completeOnboarding } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    setLoading(true);
    setTimeout(() => { completeOnboarding(); }, 2500);
  };

  return (
    <SafeAreaView className="flex-1 bg-paper">
      <View className="flex-1 justify-center p-8">

        {!loading ? (
          <Animated.View entering={FadeInUp} exiting={FadeOut}>
            {/* Document stack visual */}
            <View className="items-center mb-12 h-24 justify-center">
              <View style={{
                width: 60, height: 76, backgroundColor: '#EDE0C8',
                borderWidth: 1, borderColor: '#D4C4B0', position: 'absolute',
                borderRadius: 6, transform: [{ rotate: '-14deg' }, { translateX: -22 }],
              }} />
              <View style={{
                width: 60, height: 76, backgroundColor: '#F5EFE3',
                borderWidth: 1, borderColor: '#D4C4B0', position: 'absolute',
                borderRadius: 6, transform: [{ rotate: '9deg' }, { translateX: 22 }],
              }} />
            </View>

            <Text className="font-serif text-3xl text-walnut mb-4 text-center">Read-Only Access</Text>
            <Text style={{ fontSize: 15, color: '#A89070', lineHeight: 24, textAlign: 'center', marginBottom: 40 }}>
              Monager needs to analyze the last 90 days of transactions to build your passive intelligence model.
              We use Setu (AA) to securely sync your ledger without ever seeing your credentials.
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: '#C1673A',
                paddingVertical: 18,
                borderRadius: 14,
                alignItems: 'center',
                shadowColor: '#C1673A',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
                elevation: 5,
              }}
              onPress={handleConnect}
              activeOpacity={0.85}
            >
              <Text style={{ color: '#F5EFE3', fontWeight: '700', fontSize: 17, letterSpacing: 0.3 }}>Sync via Setu</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInUp} className="items-center">
            <ActivityIndicator size="large" color="#C1673A" style={{ marginBottom: 20 }} />
            <Text className="font-serif text-2xl text-walnut mb-2">Fetching Ledger...</Text>
            <Text style={{ fontSize: 14, color: '#A89070', fontStyle: 'italic' }}>Analyzing 3 months of noise...</Text>
          </Animated.View>
        )}

      </View>
    </SafeAreaView>
  );
}
