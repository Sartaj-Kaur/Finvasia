import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, SafeAreaView, StyleSheet, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { C } from '../constants/Theme';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../utils/api';

export default function LetterScreen() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [letters, setLetters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    if (currentUser?.uid) {
      Promise.all([
        fetchApi(`/letter/history/${currentUser.uid}`),
        fetchApi(`/binder/${currentUser.uid}`)
      ]).then(([historyRes, binderRes]) => {
        if (Array.isArray(historyRes)) {
            setLetters(historyRes);
        }
        if (binderRes?.user?.name) {
            setUserName(binderRes.user.name);
        }
        setLoading(false);
      }).catch((e) => {
          console.error(e);
          setLoading(false);
      });
    }
  }, [currentUser]);

  const currentLetter = letters.length > 0 ? letters[currentIndex] : null;
  const content = currentLetter?.content || "No letter from Monager yet. Keep logging investments to trigger your end-of-month analysis!";
  
  let dateStr = "Current Cycle";
  if (currentLetter?.month && currentLetter?.year) {
      const d = new Date();
      d.setMonth(currentLetter.month - 1);
      d.setFullYear(currentLetter.year);
      dateStr = d.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  const handlePrev = () => { if (currentIndex < letters.length - 1) setCurrentIndex(currentIndex + 1); };
  const handleNext = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1); };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <View>
            <Text style={s.headerLabel}>DISPATCH</Text>
            <Text style={s.headerDate}>{dateStr}</Text>
          </View>
          {letters.length > 1 && (
            <View style={s.navControls}>
              <TouchableOpacity onPress={handlePrev} disabled={currentIndex === letters.length - 1} style={[s.navBtn, currentIndex === letters.length - 1 && s.navBtnDisabled]}>
                <Feather name="chevron-left" size={14} color={C.creamDim} />
              </TouchableOpacity>
              <Text style={s.navText}>{letters.length - currentIndex} of {letters.length}</Text>
              <TouchableOpacity onPress={handleNext} disabled={currentIndex === 0} style={[s.navBtn, currentIndex === 0 && s.navBtnDisabled]}>
                <Feather name="chevron-right" size={14} color={C.creamDim} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={() => router.back()} style={s.closeBtn}>
          <Feather name="x" size={20} color={C.creamDim} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {loading ? (
            <ActivityIndicator size="large" color={C.terra} style={{ marginTop: 60 }} />
        ) : (
            <Animated.View key={currentIndex} entering={FadeInDown.delay(100)}>
              <Text style={s.salutation}>Dear {userName},</Text>

              {content.split('\n').map((para, i) => {
                  if (!para.trim()) return null;
                  if (para.includes('— Monager') || para.includes('- Monager')) return null;
                  return (
                    <Text key={i} style={s.body}>
                        {para.trim()}
                    </Text>
                  );
              })}

              <View style={s.signatureLine} />
              <Text style={s.signature}>— Monager</Text>
            </Animated.View>
        )}
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
  headerLabel: { fontSize: 13, fontWeight: '800', color: C.cream, letterSpacing: 2, marginBottom: 2 },
  headerDate: { fontSize: 16, fontWeight: '700', color: C.creamDim },
  closeBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: C.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: 28, paddingTop: 32 },
  salutation: { fontSize: 26, fontWeight: '800', color: C.cream, marginBottom: 28, letterSpacing: -0.5 },
  body: {
    fontSize: 16, color: C.creamDim, lineHeight: 28,
    marginBottom: 22, letterSpacing: 0.2, fontWeight: '500'
  },
  signatureLine: { height: 1, backgroundColor: '#EAECEB', marginTop: 16, marginBottom: 20 },
  signature: { fontSize: 18, color: C.cream, fontWeight: '800', textAlign: 'right', marginBottom: 10, letterSpacing: 1 },
  navControls: { flexDirection: 'row', alignItems: 'center', marginLeft: 20, backgroundColor: C.surface, borderRadius: 24, paddingHorizontal: 8, paddingVertical: 8 },
  navBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  navBtnDisabled: { opacity: 0.3 },
  navText: { fontSize: 13, fontWeight: '800', color: C.cream, marginHorizontal: 12 },
});
