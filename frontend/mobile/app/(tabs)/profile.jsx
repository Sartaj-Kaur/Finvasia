import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView,
  Alert, StyleSheet, Platform, StatusBar, ActivityIndicator, ScrollView,
  Modal, TextInput
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect } from 'expo-router';
import { fetchApi } from '../../utils/api';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { C } from '../../constants/Theme';
import { BgShapes } from '../../components/ui/BgShapes';

const MENU = [
  { icon: 'bell', label: 'Notifications', sub: 'Manage alerts' },
  { icon: 'lock', label: 'Privacy & Data', sub: 'Your rights & controls' },
  { icon: 'briefcase', label: 'Linked Accounts', sub: 'Setu / AA framework' },
  { icon: 'info', label: 'About Monager', sub: 'v1.0.0' },
];

export default function ProfileScreen() {
  const { currentUser, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [data, setData] = useState(null);
  const [budgetModal, setBudgetModal] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [savingBudget, setSavingBudget] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (currentUser?.uid) {
        fetchApi(`/binder/${currentUser.uid}`)
          .then(setData)
          .catch(e => console.error('Profile fetch error:', e));
      }
    }, [currentUser])
  );

  const daysActive = data?.user?.created_at 
    ? Math.max(1, Math.floor((Date.now() - new Date(data.user.created_at).getTime()) / (1000 * 60 * 60 * 24)))
    : '-';
  const totalSaved = data?.investments?.total_invested || 0;
  const dispatchCount = data?.letters_count || 0;

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

  const openBudgetModal = () => {
    setBudgetInput(data?.user?.income?.toString() || '');
    setBudgetModal(true);
  };

  const saveBudget = async () => {
    const income = parseFloat(budgetInput);
    if (!income || income <= 0) {
      Alert.alert('Invalid', 'Please enter a valid monthly budget amount.');
      return;
    }
    setSavingBudget(true);
    try {
      await fetchApi(`/users/${currentUser.uid}`, {
        method: 'POST',
        body: JSON.stringify({ name: data?.user?.name || 'User', income }),
      });
      setBudgetModal(false);
      Alert.alert('Updated!', 'Your monthly budget has been saved.');
    } catch (e) {
      Alert.alert('Error', 'Could not update budget. Please try again.');
    } finally {
      setSavingBudget(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <BgShapes variant="profile" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <Animated.View entering={FadeInDown.delay(50)} style={{ marginBottom: 24 }}>
          <Text style={s.pageTitle}>Settings</Text>
          <Text style={s.pageSubtitle}>Your Monager Pocket profile</Text>
        </Animated.View>

        {/* User Card */}
        <Animated.View entering={FadeInDown.delay(150)} style={s.userCard}>
          <View style={s.avatarCircle}>
            <Feather name="user" size={24} color="#1C3B36" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.userName} numberOfLines={1}>{data?.user?.name || currentUser?.displayName || 'Monager User'}</Text>
            <Text style={s.userEmail} numberOfLines={1}>{currentUser?.email || 'No email found'}</Text>
          </View>
          <View style={s.planBadge}>
            <Text style={s.planText}>FREE</Text>
          </View>
        </Animated.View>

        {/* Stats Row */}
        <Animated.View entering={FadeInDown.delay(200)} style={s.statsRow}>
          {[
            { label: 'Days Active', value: daysActive.toString() },
            { label: 'Total Saved', value: totalSaved > 0 ? `₹${totalSaved > 1000 ? (totalSaved / 1000).toFixed(1) + 'k' : totalSaved}` : '₹0' },
            { label: 'Dispatches', value: dispatchCount.toString() },
          ].map(({ label, value }, i) => (
            <View key={i} style={[s.statBox, i === 1 && s.statBoxMid]}>
              <Text style={s.statValue}>{value}</Text>
              <Text style={s.statLabel}>{label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Menu */}
        <Animated.View entering={FadeInDown.delay(300)} style={s.menuCard}>
          {/* Budget Row (interactive) */}
          <TouchableOpacity style={s.menuRow} activeOpacity={0.7} onPress={openBudgetModal}>
            <View style={s.menuIcon}>
              <Feather name="dollar-sign" size={18} color={C.terra} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.menuLabel}>Monthly Budget</Text>
              <Text style={s.menuSub}>
                {data?.user?.income ? `₹${Number(data.user.income).toLocaleString('en-IN')} / month` : 'Tap to set your income'}
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={C.creamFaint} />
          </TouchableOpacity>
          <View style={s.menuDivider} />
          {MENU.map(({ icon, label, sub }, i) => (
            <View key={i}>
              <TouchableOpacity style={s.menuRow} activeOpacity={0.7}>
                <View style={s.menuIcon}>
                  <Feather name={icon} size={18} color={C.terra} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.menuLabel}>{label}</Text>
                  <Text style={s.menuSub}>{sub}</Text>
                </View>
                <Feather name="chevron-right" size={16} color={C.creamFaint} />
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
                <Feather name="log-out" size={18} color="#FF7E7E" style={{ marginRight: 10 }} />
                <Text style={s.logoutText}>Sign Out</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>

      {/* Budget Edit Modal */}
      <Modal visible={budgetModal} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Text style={s.modalTitle}>Monthly Budget</Text>
              <TouchableOpacity onPress={() => setBudgetModal(false)}>
                <View style={s.modalClose}><Feather name="x" size={18} color={C.cream} /></View>
              </TouchableOpacity>
            </View>
            <Text style={s.modalLabel}>Enter your monthly income or budget</Text>
            <View style={s.inputRow}>
              <Text style={s.inputPrefix}>₹</Text>
              <TextInput
                style={s.input}
                value={budgetInput}
                onChangeText={setBudgetInput}
                keyboardType="numeric"
                placeholder="e.g. 50000"
                placeholderTextColor={C.creamFaint}
                autoFocus
              />
            </View>
            <TouchableOpacity
              style={[s.saveBtn, savingBudget && { opacity: 0.6 }]}
              onPress={saveBudget}
              disabled={savingBudget}
              activeOpacity={0.85}
            >
              {savingBudget
                ? <ActivityIndicator size="small" color="#FFFFFF" />
                : <Text style={s.saveBtnText}>Save Budget</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 160 },
  pageTitle: { fontSize: 32, fontWeight: '900', color: C.cream, letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 15, color: C.creamDim, marginTop: 4, fontWeight: '500' },
  userCard: {
    backgroundColor: C.terra, borderRadius: 24,
    padding: 24, flexDirection: 'row', alignItems: 'center', marginBottom: 20,
  },
  avatarCircle: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: C.surface,
    alignItems: 'center', justifyContent: 'center', marginRight: 16,
  },
  userName: { fontSize: 20, fontWeight: '800', color: '#1A3631', marginBottom: 2 },
  userEmail: { fontSize: 13, color: '#1A3631', opacity: 0.7, fontWeight: '500' },
  planBadge: { backgroundColor: '#1A3631', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  planText: { fontSize: 11, fontWeight: '800', color: C.green, letterSpacing: 0.5 },
  statsRow: {
    flexDirection: 'row', backgroundColor: C.surface, borderRadius: 24,
    marginBottom: 24,
  },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 24 },
  statBoxMid: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#FFFFFF' },
  statValue: { fontSize: 22, fontWeight: '800', color: C.cream, marginBottom: 4 },
  statLabel: { fontSize: 11, color: C.creamDim, fontWeight: '600' },
  menuCard: {
    backgroundColor: C.surface, borderRadius: 24,
    marginBottom: 24, overflow: 'hidden',
  },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 18 },
  menuIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  menuLabel: { fontSize: 16, fontWeight: '800', color: C.cream, marginBottom: 2 },
  menuSub: { fontSize: 13, color: C.creamDim, fontWeight: '500' },
  menuDivider: { height: 1, backgroundColor: '#FFFFFF', marginLeft: 80 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.surface, borderRadius: 24, paddingVertical: 20,
  },
  logoutText: { fontSize: 16, fontWeight: '800', color: '#FF7E7E' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: C.bg, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 28, paddingBottom: 44 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: C.cream },
  modalClose: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' },
  modalLabel: { fontSize: 13, color: C.creamDim, fontWeight: '600', marginBottom: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 20, paddingHorizontal: 20, marginBottom: 24 },
  inputPrefix: { fontSize: 22, fontWeight: '800', color: C.cream, marginRight: 6 },
  input: { flex: 1, fontSize: 28, fontWeight: '800', color: C.cream, paddingVertical: 18 },
  saveBtn: { backgroundColor: C.surfaceHigh, borderRadius: 24, paddingVertical: 18, alignItems: 'center' },
  saveBtnText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
});
