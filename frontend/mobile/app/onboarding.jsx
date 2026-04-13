import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';

const theme = Colors.light;

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Personality Baseline</Text>
        <Text style={styles.subtext}>
          Before we begin, we need to understand your financial psychology. 
          Help Monager map your OCEAN traits.
        </Text>

        <View style={styles.questionBlock}>
          <Text style={styles.question}>1. I am disciplined with budgets.</Text>
          <View style={styles.scale}>
            {['1 (Never)', '2', '3', '4', '5 (Always)'].map((opt) => (
              <TouchableOpacity key={opt} style={styles.radio}>
                <Text style={styles.radioText}>{opt[0]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Complete Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.paper,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.stone,
    shadowColor: theme.leatherLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 24,
    color: theme.leather,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtext: {
    color: theme.tabIconDefault,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40,
  },
  questionBlock: {
    marginBottom: 40,
  },
  question: {
    fontFamily: 'serif',
    fontSize: 18,
    color: theme.text,
    marginBottom: 20,
  },
  scale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radio: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.paperLight,
    borderWidth: 1,
    borderColor: theme.wood,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioText: {
    color: theme.text,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: theme.gold,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
