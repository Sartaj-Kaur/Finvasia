import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInRight, FadeOutLeft, Layout } from 'react-native-reanimated';

const QUESTIONS = [
  "I am extremely disciplined with budgets.",
  "I often make impulsive purchases.",
  "I worry constantly about running out of money.",
];

export default function Step2Ocean() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAnswer = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(curr => curr + 1);
    } else {
      router.push('/(onboarding)/step3-bank');
    }
  };

  const pct = ((currentIndex + 1) / QUESTIONS.length) * 100;

  return (
    <SafeAreaView className="flex-1 bg-paper">
      <View className="flex-1 justify-center p-8">

        {/* Progress header */}
        <View className="absolute top-16 left-8 right-8">
          <Text className="text-fog text-xs font-bold tracking-[2px] mb-3">
            PSYCHOLOGY {currentIndex + 1}/{QUESTIONS.length}
          </Text>
          <View className="h-0.5 bg-hairline rounded-full overflow-hidden">
            <Animated.View
              style={{ width: `${pct}%`, height: '100%', backgroundColor: '#C1673A', borderRadius: 9999 }}
              layout={Layout.springify()}
            />
          </View>
        </View>

        {/* Question */}
        <View className="mb-14">
          <Text className="font-serif text-3xl leading-snug text-walnut">
            {QUESTIONS[currentIndex]}
          </Text>
        </View>

        {/* Options */}
        <Animated.View entering={FadeInRight} exiting={FadeOutLeft} key={currentIndex} className="gap-4">
          {['Never', 'Rarely', 'Sometimes', 'Often', 'Always'].map((label, idx) => (
            <TouchableOpacity
              key={idx}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 18,
                backgroundColor: '#EDE0C8',
                borderWidth: 1,
                borderColor: '#D4C4B0',
                borderRadius: 12,
              }}
              onPress={handleAnswer}
              activeOpacity={0.75}
            >
              <Text style={{ color: '#A89070', fontWeight: '700', fontSize: 14, marginRight: 14, width: 20 }}>{idx + 1}</Text>
              <Text style={{ color: '#3E2C1E', fontSize: 16, fontWeight: '500' }}>{label}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

      </View>
    </SafeAreaView>
  );
}
