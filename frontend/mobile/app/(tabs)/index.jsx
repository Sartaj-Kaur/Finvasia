import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown, FadeOut, Layout } from 'react-native-reanimated';
import Colors from '@/constants/Colors';

const theme = Colors.light;

const StickyNote = () => (
  <Animated.View 
    entering={FadeInDown.delay(200).springify()} 
    style={styles.stickyNoteContainer}
  >
    <View style={styles.stickyNote}>
      <Text style={styles.stickyText}>
        "You spent ₹1,240 on food this week. I kept ₹400 working."
      </Text>
      <Text style={styles.stickySignature}>— Monager</Text>
    </View>
  </Animated.View>
);

const ProgressBar = ({ label, percentage }) => {
  const getBarColor = (pct) => {
    if (pct < 70) return '#10B981'; // Green
    if (pct <= 90) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  const bgColor = getBarColor(percentage);

  return (
    <View style={styles.progressRow}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={[styles.progressPercent, { color: bgColor }]}>{percentage}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: bgColor }]} />
      </View>
    </View>
  );
};

const BudgetSnapshot = () => (
  <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
    <Text style={styles.sectionTitle}>Monthly Rhythm</Text>
    <View style={styles.card}>
      <ProgressBar label="Needs" percentage={65} />
      <ProgressBar label="Wants" percentage={82} />
      <ProgressBar label="Saved" percentage={95} />
    </View>
  </Animated.View>
);

const MoodCheck = () => {
  const [moodLogged, setMoodLogged] = useState(false);

  if (moodLogged) {
    return (
      <Animated.View entering={FadeInUp} style={[styles.card, styles.centerCard]}>
        <Text style={styles.thankYouText}>Mood logged. I'll remember this.</Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View exiting={FadeOut} entering={FadeInUp.delay(400)} style={styles.section}>
      <Text style={styles.sectionTitle}>How are you feeling about money?</Text>
      <View style={styles.moodRow}>
        <TouchableOpacity style={styles.moodButton} onPress={() => setMoodLogged(true)}>
          <Text style={styles.moodEmoji}>😊</Text>
          <Text style={styles.moodLabel}>Happy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moodButton} onPress={() => setMoodLogged(true)}>
          <Text style={styles.moodEmoji}>😐</Text>
          <Text style={styles.moodLabel}>Meh</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moodButton} onPress={() => setMoodLogged(true)}>
          <Text style={styles.moodEmoji}>😟</Text>
          <Text style={styles.moodLabel}>Stressed</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const PersonalityQuestion = () => {
  const [answered, setAnswered] = useState(false);

  if (answered) return null;

  return (
    <Animated.View exiting={FadeOut} entering={FadeInUp.delay(500)} layout={Layout.springify()} style={styles.section}>
      <View style={[styles.card, styles.questionCard]}>
        <Text style={styles.questionTitle}>Daily Check</Text>
        <Text style={styles.questionText}>Do you prefer saving or spending today?</Text>
        <View style={styles.questionActions}>
          <TouchableOpacity style={styles.answerButton} onPress={() => setAnswered(true)}>
            <Text style={styles.answerText}>Saving</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.answerButton} onPress={() => setAnswered(true)}>
            <Text style={styles.answerText}>Spending</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.headerState}>While you were away...</Text>
        
        <StickyNote />
        
        <BudgetSnapshot />
        
        <MoodCheck />

        <PersonalityQuestion />

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.paper,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  headerState: {
    color: theme.tabIconDefault,
    fontFamily: 'serif',
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 20,
    marginTop: 10,
  },
  stickyNoteContainer: {
    marginBottom: 35,
    alignItems: 'center',
  },
  stickyNote: {
    backgroundColor: theme.stickyYellow,
    width: '90%',
    padding: 25,
    transform: [{ rotate: '-2deg' }],
    shadowColor: theme.leatherLight,
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
    // Torn edge simulation via border
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  stickyText: {
    color: theme.text,
    fontFamily: 'serif',
    fontSize: 22,
    lineHeight: 30,
  },
  stickySignature: {
    color: theme.tabIconDefault,
    fontFamily: 'serif',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 15,
    textAlign: 'right',
  },
  section: {
    marginBottom: 35,
  },
  sectionTitle: {
    color: theme.text,
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: theme.paperLight,
    borderWidth: 1,
    borderColor: theme.stone,
    padding: 20,
    shadowColor: theme.leatherLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  centerCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  thankYouText: {
    color: theme.text,
    fontFamily: 'serif',
    fontSize: 16,
    fontStyle: 'italic',
  },
  progressRow: {
    marginBottom: 18,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    color: theme.text,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  progressTrack: {
    height: 4,
    backgroundColor: theme.stone,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    backgroundColor: theme.paperLight,
    borderWidth: 1,
    borderColor: theme.stone,
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.stone,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    color: theme.text,
    fontSize: 12,
    fontWeight: '500',
  },
  questionCard: {
    backgroundColor: theme.stone, // slightly darker card for the question
    borderColor: theme.wood,
  },
  questionTitle: {
    color: theme.leatherLight,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 1,
  },
  questionText: {
    color: theme.text,
    fontFamily: 'serif',
    fontSize: 18,
    marginBottom: 20,
  },
  questionActions: {
    flexDirection: 'row',
    gap: 10,
  },
  answerButton: {
    flex: 1,
    backgroundColor: theme.paper,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.wood,
  },
  answerText: {
    color: theme.text,
    fontWeight: '600',
    fontSize: 14,
  }
});
