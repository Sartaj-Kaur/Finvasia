import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, SafeAreaView, StyleSheet, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { C } from '../constants/Theme';

export default function LetterScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <View>
          <Text style={s.headerLabel}>DISPATCH</Text>
          <Text style={s.headerDate}>March 2026</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()} style={s.closeBtn}>
          <FontAwesome name="times" size={20} color={C.creamDim} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100)}>
          <Text style={s.salutation}>Dear Navya,</Text>

          <Text style={s.body}>
            March was a quiet month, and quiet is good. You managed to rein in the impulsive weekend spending,
            and we are starting to see the compound effects taking root in your emergency allocation.
          </Text>

          <Text style={s.body}>
            We noticed your Swiggy orders spiked on Tuesday evenings. I went ahead and moved an additional
            ₹800 into your short-term liquid fund using the surplus salvaged from your lowered utility bills.
            Do not adjust your routine — just be aware that your capital is still working.
          </Text>

          <Text style={s.body}>
            Your OCEAN profile suggests you respond well to visible progress markers. The Piggy Bank grid
            has been updated. Watch it fill. It is not a game — it is proof that patience compounds.
          </Text>

          <Text style={s.body}>Stay the course. Until next time.</Text>

          <View style={s.signatureLine} />
          <Text style={s.signature}>— Monager</Text>
        </Animated.View>
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1, backgroundColor: C.bg,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  headerLabel: { fontSize: 10, fontWeight: '700', color: C.terra, letterSpacing: 2, marginBottom: 2 },
  headerDate: { fontSize: 15, fontWeight: '600', color: C.cream },
  closeBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: C.surface,
    borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: 28, paddingTop: 32 },
  salutation: { fontSize: 24, fontWeight: '700', color: C.cream, marginBottom: 28 },
  body: {
    fontSize: 16, color: C.creamDim, lineHeight: 28,
    marginBottom: 22, letterSpacing: 0.1,
  },
  signatureLine: { height: 1, backgroundColor: C.border, marginTop: 16, marginBottom: 20 },
  signature: { fontSize: 20, color: C.sand, fontStyle: 'italic', textAlign: 'right', marginBottom: 10 },
});
