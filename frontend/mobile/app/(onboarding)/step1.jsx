import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInRight } from 'react-native-reanimated';

export default function Step1() {
  const [name, setName] = useState('');
  const [income, setIncome] = useState('');
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5EFE3', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <Animated.View entering={FadeInRight.delay(100).springify()} className="flex-1 justify-center p-8">

        <Text className="font-serif text-4xl text-walnut mb-3">Let's start{'\n'}the file.</Text>
        <Text className="text-base text-fog mb-12">
          What do you go by, and what's your monthly target?
        </Text>

        <View className="mb-8">
          <Text className="text-xs text-fog font-bold tracking-widest uppercase mb-3">Name</Text>
          <TextInput
            className="border-b border-hairline text-2xl text-walnut pb-3"
            placeholder="e.g. Navya"
            placeholderTextColor="#C9B89A"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="mb-10">
          <Text className="text-xs text-fog font-bold tracking-widest uppercase mb-3">Monthly Income (₹)</Text>
          <TextInput
            className="border-b border-hairline text-2xl text-walnut pb-3"
            placeholder="0"
            keyboardType="numeric"
            placeholderTextColor="#C9B89A"
            value={income}
            onChangeText={setIncome}
          />
        </View>

        <TouchableOpacity
          className="bg-terra py-5 rounded-xl items-center mt-6"
          style={{ shadowColor: '#C1673A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 5 }}
          onPress={() => router.push('/(onboarding)/step2-ocean')}
          activeOpacity={0.85}
        >
          <Text className="text-paper font-bold text-base tracking-wide">Continue →</Text>
        </TouchableOpacity>

      </Animated.View>
    </SafeAreaView>
  );
}
