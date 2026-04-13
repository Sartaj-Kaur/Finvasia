import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing, FadeInUp } from 'react-native-reanimated';
import Colors from '@/constants/Colors';

const theme = Colors.light;

const AnimatedFace = () => {
  const blinkY = useSharedValue(1);
  const talkScale = useSharedValue(1);

  useEffect(() => {
    // Random blinking
    const blinkInterval = setInterval(() => {
      blinkY.value = withSequence(
        withTiming(0.1, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
    }, 4000);

    // Constant subtle mouth movement to simulate "listening/thinking"
    talkScale.value = withRepeat(
      withTiming(1.2, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    return () => clearInterval(blinkInterval);
  }, []);

  const eyeStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: blinkY.value }]
  }));

  const mouthStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: talkScale.value }]
  }));

  return (
    <View style={styles.faceContainer}>
      <View style={styles.eyesRow}>
        <Animated.View style={[styles.eye, eyeStyle]} />
        <Animated.View style={[styles.eye, eyeStyle]} />
      </View>
      <Animated.View style={[styles.mouth, mouthStyle]} />
    </View>
  );
};

export default function FinTwinScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <AnimatedFace />
      </View>
      
      <ScrollView style={styles.chatArea} contentContainerStyle={{ padding: 20 }}>
        
        {/* Mock Dialogue */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.bubbleUser}>
          <Text style={styles.bubbleUserText}>How am I doing this month?</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(1000)} style={styles.bubbleTwin}>
          <Text style={styles.bubbleTwinText}>
            You’re doing better than you think. But food spending is creeping up.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(2000)} style={styles.bubbleTwin}>
          <Text style={styles.bubbleTwinText}>
            I salvaged ₹400 from our target. Want me to stash it in the New Phone Fund?
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(5000)} style={styles.bubbleUser}>
          <Text style={styles.bubbleUserText}>Yes, please do.</Text>
        </Animated.View>

      </ScrollView>

      {/* Input Mock */}
      <View style={styles.inputArea}>
        <View style={styles.inputBox}>
          <TextInput 
            style={styles.textInput} 
            placeholder="Type or speak to Monager..." 
            placeholderTextColor={theme.tabIconDefault}
          />
          <TouchableOpacity style={styles.micButton}>
            <FontAwesome name="microphone" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.paper,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.stone,
    backgroundColor: theme.paperLight,
  },
  faceContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.wood,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.leather,
  },
  eyesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  eye: {
    width: 6,
    height: 8,
    borderRadius: 3,
    backgroundColor: theme.text,
  },
  mouth: {
    width: 14,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.text,
  },
  chatArea: {
    flex: 1,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: theme.stone,
    padding: 15,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    maxWidth: '80%',
    marginBottom: 15,
  },
  bubbleUserText: {
    color: theme.text,
    fontSize: 15,
    fontFamily: 'serif',
  },
  bubbleTwin: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderColor: theme.stone,
    borderWidth: 1,
    padding: 15,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    maxWidth: '80%',
    marginBottom: 15,
    shadowColor: theme.leatherLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bubbleTwinText: {
    color: theme.text,
    fontSize: 15,
    fontFamily: 'serif',
    lineHeight: 22,
  },
  inputArea: {
    padding: 15,
    backgroundColor: theme.paperLight,
    borderTopWidth: 1,
    borderTopColor: theme.stone,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.stone,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  textInput: {
    flex: 1,
    color: theme.text,
    fontSize: 16,
    fontFamily: 'serif',
  },
  micButton: {
    padding: 5,
    marginLeft: 10,
  }
});
