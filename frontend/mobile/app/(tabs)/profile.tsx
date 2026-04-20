import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Link, Lock, Download, HelpCircle, ChevronRight, LogOut } from 'react-native-feather';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../src/services/firebase';
import { C, FONTS, globalStyles } from '../../src/theme';
import { useAuth } from '../../context/AuthContext';
import { fetchApi } from '../../utils/api';

export default function Profile() {
  const router = useRouter();
  const { currentUser } = useAuth() as any;
  const [userData, setUserData] = React.useState<any>(null);
  
  React.useEffect(() => {
    async function load() {
      if (!currentUser?.uid) return;
      try {
        const res = await fetchApi(`/binder/${currentUser.uid}`);
        if(res && res.user) {
          setUserData(res.user);
        }
      } catch (err) {}
    }
    load();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('demo_bypassed_auth');
      await AsyncStorage.removeItem('setuLinked');
      router.replace('/(auth)/login');
    } catch (e) {
      alert("Error logging out.");
    }
  };

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        
        {/* 8.1 PROFILE HERO */}
        <View style={s.yellowHeader}>
          <SafeAreaView edges={['top']} style={s.hero}>
            <View style={s.avatarCirc}>
              <Text style={s.avatarTxt}>{userData?.name ? userData.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'JS'}</Text>
            </View>
            <Text style={s.name}>{userData?.name || 'Jaskaran Singh'}</Text>
            
            <View style={s.agentRow}>
              <View style={s.agentDot}><Text style={s.agentDotTxt}>{userData?.archetype ? userData.archetype.charAt(0).toUpperCase() : 'V'}</Text></View>
              <Text style={s.agentSub}>{userData?.archetype ? userData.archetype.toUpperCase() : 'VOLT'} · Intermediate</Text>
            </View>
            
            <View style={s.jumppRow}>
              <Text style={s.jText}>jUMPP Connected · Synced 2m ago</Text>
            </View>
          </SafeAreaView>
        </View>

        {/* 8.2 STATS ROW */}
        <Animated.View entering={FadeInDown.delay(100)} style={s.statsRow}>
          <View style={s.statBox}>
            <Text style={s.sNum}>12</Text>
            <Text style={s.sLbl}>RECEIPTS</Text>
          </View>
          <View style={[s.statBox, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: C.BORDER }]}>
            <Text style={s.sNum}>₹4.2k</Text>
            <Text style={s.sLbl}>AUTO-SAVED</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.sNum}>8</Text>
            <Text style={s.sLbl}>WK STREAK</Text>
          </View>
        </Animated.View>

        {/* 8.3 FINANCIAL DNA */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <View style={[globalStyles.cardStyle, s.dnaCard]}>
            <Text style={[globalStyles.sectionLabelStyle, { marginBottom: 16 }]}>YOUR FINANCIAL DNA</Text>
            
            <View style={s.dnaRow}>
              <Text style={s.dnaKey}>Financial Level</Text>
              <Text style={s.dnaValAm}>Intermediate</Text>
            </View>
            
            <View style={s.dnaRow}>
              <Text style={s.dnaKey}>Knowledge Level</Text>
              <View style={s.dotsRow}>
                <View style={[s.kd, s.kdf]} />
                <View style={[s.kd, s.kdf]} />
                <View style={s.kd} />
              </View>
            </View>

            <View style={s.dnaRow}>
              <Text style={s.dnaKey}>Communication</Text>
              <View style={s.pillAm}><Text style={s.pillAmT}>Direct</Text></View>
            </View>
          </View>
        </Animated.View>

        {/* 8.4 SETTINGS */}
        <Animated.View entering={FadeInDown.delay(300)}>
          <View style={s.settingsList}>
            {[
              { icon: <User color={C.T1} width={18} />, label: 'Agent Voice', val: 'VOLT' },
              { icon: <Bell color={C.T1} width={18} />, label: 'Notifications', val: 'On' },
              { icon: <Link color={C.T1} width={18} />, label: 'jUMPP Sync', val: 'Connected' },
              { icon: <Lock color={C.T1} width={18} />, label: 'Privacy', val: '' },
              { icon: <Download color={C.T1} width={18} />, label: 'Data Export', val: '' },
              { icon: <HelpCircle color={C.T1} width={18} />, label: 'Help', val: '' },
              { icon: <LogOut color={C.RED} width={18} />, label: 'Log Out', val: '', onPress: handleLogout, color: C.RED },
            ].map((sitem, i) => (
              <TouchableOpacity key={i} style={s.setRow} activeOpacity={0.7} onPress={sitem.onPress}>
                <View style={s.setLeft}>
                  <View style={s.setIconX}>{sitem.icon}</View>
                  <Text style={[s.setLbl, sitem.color ? { color: sitem.color } : {}]}>{sitem.label}</Text>
                </View>
                <View style={s.setRight}>
                  {!!sitem.val && <Text style={s.setVal}>{sitem.val}</Text>}
                  <ChevronRight color={C.T3} width={16} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  scroll: {},

  yellowHeader: { backgroundColor: C.YELLOW, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, overflow: 'hidden' },
  hero: { alignItems: 'center', paddingVertical: 32 },
  avatarCirc: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.4)', borderWidth: 2, borderColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontFamily: FONTS.SYNE, fontSize: 28, color: C.T1 },
  name: { fontFamily: FONTS.SYNE, fontSize: 24, color: C.T1, marginTop: 12 },
  
  agentRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  agentDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: C.T1, alignItems: 'center', justifyContent: 'center' },
  agentDotTxt: { fontFamily: FONTS.SYNE, fontSize: 10, color: C.YELLOW },
  agentSub: { fontFamily: FONTS.JAKARTA_SEMI, fontSize: 13, color: C.T1 },

  jumppRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  jText: { fontFamily: FONTS.MONO, fontSize: 10, color: 'rgba(0,0,0,0.5)' },

  statsRow: { flexDirection: 'row', margin: 16, backgroundColor: C.SURFACE, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: C.BORDER, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  statBox: { flex: 1, paddingVertical: 20, alignItems: 'center' },
  sNum: { fontFamily: FONTS.SYNE, fontSize: 24, color: C.T1 },
  sLbl: { fontFamily: FONTS.MONO, fontSize: 9, color: C.T2, marginTop: 4 },

  dnaCard: { marginHorizontal: 16, marginBottom: 16 },
  dnaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  dnaKey: { fontFamily: FONTS.JAKARTA, fontSize: 14, color: C.T1 },
  dnaValAm: { fontFamily: FONTS.MONO, fontSize: 12, color: C.BLUE },
  dotsRow: { flexDirection: 'row', gap: 6 },
  kd: { width: 10, height: 10, borderRadius: 5, borderWidth: 1, borderColor: C.T3 },
  kdf: { backgroundColor: C.BLUE, borderColor: C.BLUE },
  pillAm: { backgroundColor: C.BLUE_DIM, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  pillAmT: { fontFamily: FONTS.JAKARTA_SEMI, fontSize: 12, color: C.BLUE },

  settingsList: { marginHorizontal: 16, backgroundColor: C.SURFACE, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: C.BORDER, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  setRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: C.BORDER },
  setLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  setIconX: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.BASE, alignItems: 'center', justifyContent: 'center' },
  setLbl: { fontFamily: FONTS.JAKARTA, fontSize: 14, color: C.T1 },
  setRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  setVal: { fontFamily: FONTS.MONO, fontSize: 11, color: C.T2 }
});
