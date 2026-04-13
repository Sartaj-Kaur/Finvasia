import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView,
  Alert, StyleSheet, Platform, StatusBar, ActivityIndicator, ScrollView
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { C } from '../../constants/Theme';

const MENU = [
  { icon: 'bell-o', label: 'Notifications', sub: 'Manage alerts' },
  { icon: 'lock', label: 'Privacy & Data', sub: 'Your rights & controls' },
  { icon: 'bank', label: 'Linked Accounts', sub: 'Setu / AA framework' },
  { icon: 'info-circle', label: 'About Monager', sub: 'v1.0.0' },
];

export default function ProfileScreen() {
  const { currentUser, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert('Sign Out?', 'You will need to unlock your journal again.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        setIsLoggingOut(true);
        try { await logout(); }
        catch (e) { Alert.alert('Error', e.message); setIsLoggingOut(false); }
      }},
    ]);
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <Animated.View entering={FadeInDown.delay(50)} style={{ marginBottom: 24 }}>
          <Text style={s.pageTitle}>Settings</Text>
          <Text style={s.pageSubtitle}>Your Monager Pocket profile</Text>
        </Animated.View>

        {/* User Card */}
        <Animated.View entering={FadeInDown.delay(150)} style={s.userCard}>
          <View style={s.avatarCircle}>
            <FontAwesome name="user" size={28} color={C.terra} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.userName} numberOfLines={1}>{currentUser?.displayName || 'Monager User'}</Text>
            <Text style={s.userEmail} numberOfLines={1}>{currentUser?.email || 'No email found'}</Text>
          </View>
          <View style={s.planBadge}>
            <Text style={s.planText}>FREE</Text>
          </View>
        </Animated.View>

        {/* Stats Row */}
        <Animated.View entering={FadeInDown.delay(200)} style={s.statsRow}>
          {[
            { label: 'Days Active', value: '18' },
            { label: 'Total Saved', value: '₹4.2k' },
            { label: 'Dispatches', value: '3' },
          ].map(({ label, value }, i) => (
            <View key={i} style={[s.statBox, i === 1 && s.statBoxMid]}>
              <Text style={s.statValue}>{value}</Text>
              <Text style={s.statLabel}>{label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Menu */}
        <Animated.View entering={FadeInDown.delay(300)} style={s.menuCard}>
          {MENU.map(({ icon, label, sub }, i) => (
            <View key={i}>
              <TouchableOpacity style={s.menuRow} activeOpacity={0.7}>
                <View style={s.menuIcon}>
                  <FontAwesome name={icon} size={15} color={C.terra} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.menuLabel}>{label}</Text>
                  <Text style={s.menuSub}>{sub}</Text>
                </View>
                <FontAwesome name="chevron-right" size={12} color={C.creamFaint} />
              </TouchableOpacity>
              {i < MENU.length - 1 && <View style={s.menuDivider} />}
            </View>
          ))}
        </Animated.View>

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(400)}>
          <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} disabled={isLoggingOut} activeOpacity={0.85}>
            {isLoggingOut ? (
              <ActivityIndicator size="small" color={C.red} />
            ) : (
              <>
                <FontAwesome name="sign-out" size={16} color={C.red} style={{ marginRight: 10 }} />
                <Text style={s.logoutText}>Sign Out</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },
  pageTitle: { fontSize: 28, fontWeight: '700', color: C.cream, letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 14, color: C.creamDim, marginTop: 2 },
  userCard: {
    backgroundColor: C.surface, borderRadius: 20, borderWidth: 1, borderColor: C.border,
    padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5,
  },
  avatarCircle: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: C.terra + '20',
    borderWidth: 2, borderColor: C.terra + '40', alignItems: 'center', justifyContent: 'center', marginRight: 16,
  },
  userName: { fontSize: 17, fontWeight: '700', color: C.cream, marginBottom: 3 },
  userEmail: { fontSize: 13, color: C.creamDim },
  planBadge: { backgroundColor: C.sand + '30', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  planText: { fontSize: 11, fontWeight: '800', color: C.sand, letterSpacing: 1 },
  statsRow: {
    flexDirection: 'row', backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border,
    marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3,
  },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 18 },
  statBoxMid: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: C.border },
  statValue: { fontSize: 20, fontWeight: '700', color: C.cream, marginBottom: 4 },
  statLabel: { fontSize: 10, color: C.creamFaint, textTransform: 'uppercase', letterSpacing: 0.8 },
  menuCard: {
    backgroundColor: C.surface, borderRadius: 20, borderWidth: 1, borderColor: C.border,
    marginBottom: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 4,
  },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.terra + '18', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  menuLabel: { fontSize: 15, fontWeight: '600', color: C.cream, marginBottom: 2 },
  menuSub: { fontSize: 12, color: C.creamFaint },
  menuDivider: { height: 1, backgroundColor: C.border, marginLeft: 70 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.red + '15', borderWidth: 1.5, borderColor: C.red + '40',
    borderRadius: 16, paddingVertical: 16,
  },
  logoutText: { fontSize: 16, fontWeight: '700', color: C.red },
});
