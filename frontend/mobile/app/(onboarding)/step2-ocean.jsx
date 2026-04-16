import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView,
  ActivityIndicator, StyleSheet, Platform, StatusBar, Dimensions
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInRight, FadeOutLeft, Layout } from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import { fetchApi } from '../../utils/api';
import { C } from '../../constants/Theme';
import { BgShapes } from '../../components/ui/BgShapes';

const { width } = Dimensions.get('window');

export default function Step2Ocean() {
  const router = useRouter();
  const { name, income } = useLocalSearchParams();
  const { currentUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetchApi('/quiz/questions');
        if (res && res.questions) {
          const shuffled = res.questions.sort(() => 0.5 - Math.random());
          setQuestions(shuffled.slice(0, 10));
        }
      } catch (err) {
        console.error("Failed to load questions:", err);
      } finally {
        setLoadingQuestions(false);
      }
    }
    loadQuestions();
  }, []);

  const handleAnswer = async (val) => {
    const newAnswers = [...answers, {
      trait: questions[currentIndex].trait,
      value: val,
      reverse: questions[currentIndex].reverse
    }];
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(curr => curr + 1);
    } else {
      setIsSubmitting(true);
      try {
        if (currentUser && currentUser.uid) {
          await fetchApi(`/users/${currentUser.uid}`, {
            method: 'POST',
            body: JSON.stringify({ name: name || 'User', income: parseFloat(income) || 0 })
          });
          await fetchApi(`/quiz/submit`, {
            method: 'POST',
            body: JSON.stringify({ user_id: currentUser.uid, answers: newAnswers })
          });
        }
      } catch (e) {
        console.error("Error onboarding:", e);
      } finally {
        setIsSubmitting(false);
        router.push('/(onboarding)/step3-bank');
      }
    }
  };

  if (loadingQuestions || questions.length === 0) {
    return (
      <SafeAreaView style={s.safe}>
        <BgShapes variant="auth" />
        <View style={[s.container, { alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={C.terra} />
          <Text style={{ marginTop: 16, color: C.creamDim, fontWeight: '600' }}>Loading questions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const pct = ((currentIndex + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={s.safe}>
      <BgShapes variant="auth" />
      <View style={s.container}>

        {/* Header / Progress */}
        <View style={s.progressHeader}>
          <Text style={s.progressLabel}>
            PSYCHOLOGY {currentIndex + 1}/{questions.length}
          </Text>
          <View style={s.progressBarTrack}>
            <Animated.View
              style={[s.progressBarFill, { width: `${pct}%` }]}
              layout={Layout.springify()}
            />
          </View>
        </View>

        {/* Question Area */}
        <View style={s.questionArea}>
          <Text style={s.questionText}>
            {questions[currentIndex].text}
          </Text>
        </View>

        {/* Options */}
        <Animated.View
          entering={FadeInRight}
          exiting={FadeOutLeft}
          key={currentIndex}
          style={s.optionsContainer}
        >
          {['Never', 'Rarely', 'Sometimes', 'Often', 'Always'].map((label, idx) => (
            <TouchableOpacity
              key={idx}
              style={s.optionCard}
              onPress={() => handleAnswer(idx + 1)}
              disabled={isSubmitting}
              activeOpacity={0.7}
            >
              <View style={s.optionIndexBox}>
                <Text style={s.optionIndex}>{idx + 1}</Text>
              </View>
              <Text style={s.optionLabelText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {isSubmitting && (
          <View style={s.loadingOverlay}>
            <ActivityIndicator size="large" color={C.terra} />
            <Text style={s.loadingText}>Building your profile...</Text>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1, paddingHorizontal: 32, justifyContent: 'center' },
  progressHeader: { position: 'absolute', top: 60, left: 32, right: 32 },
  progressLabel: { fontSize: 11, fontWeight: '800', color: C.creamDim, letterSpacing: 2, marginBottom: 12 },
  progressBarTrack: { height: 6, backgroundColor: '#EAECEB', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: C.terra, borderRadius: 3 },
  questionArea: { marginBottom: 48 },
  questionText: { fontSize: 28, fontWeight: '800', color: C.surfaceHigh, lineHeight: 38, letterSpacing: -0.5 },
  optionsContainer: { gap: 12 },
  optionCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface,
    padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#FFFFFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  optionIndexBox: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: C.terra + '20',
    alignItems: 'center', justifyContent: 'center', marginRight: 16,
  },
  optionIndex: { fontSize: 12, fontWeight: '800', color: C.terra },
  optionLabelText: { fontSize: 17, fontWeight: '600', color: C.surfaceHigh },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center', zIndex: 100,
  },
  loadingText: { marginTop: 16, fontSize: 16, fontWeight: '700', color: C.surfaceHigh },
});
