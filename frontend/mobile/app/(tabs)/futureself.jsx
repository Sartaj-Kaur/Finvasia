import React, { useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, FadeIn } from 'react-native-reanimated';

export default function FutureSelfScreen() {
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    // Breathing animation loop (4 seconds in, 4 seconds out)
    glowScale.value = withRepeat(
      withTiming(1.5, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    glowOpacity.value = withRepeat(
      withTiming(0.6, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const animatedGlowView = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Core Entity */}
        <View style={styles.avatarContainer}>
          <Animated.View style={[styles.glow, animatedGlowView]} />
          <View style={styles.avatarCore} />
        </View>

        {/* Monologue */}
        <Animated.View entering={FadeIn.delay(1000).duration(2000)} style={styles.monologueBox}>
          <Text style={styles.monologueText}>
            "You’ll thank yourself for this ₹500 you didn’t spend."
          </Text>
          <Text style={styles.monologueSubtext}>
            Small habits now. Freedom later.
          </Text>
        </Animated.View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#161412', // Very dark warm brown/black
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  glow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#d4af37', // Gold aura
    filter: 'blur(10px)', // web only, fallback to opacity below
  },
  avatarCore: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f1e8', // Pure light paper
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  monologueBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  monologueText: {
    color: '#e0d8c8', // Stone/warm gray
    fontFamily: 'serif',
    fontSize: 22,
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  monologueSubtext: {
    color: '#a06a45', // Leather light / amber
    fontFamily: 'serif',
    fontSize: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  }
});
