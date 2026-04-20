import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Svg, Circle, Path } from 'react-native-svg';
import Animated, { FadeInDown, withRepeat, withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Mic, UploadCloud, Bell, Award, Home as HomeIcon, Zap } from 'react-native-feather';
import { C, FONTS, globalStyles } from '../../src/theme';
import { MOCK_USER, MOCK_BUDGETS, MOCK_TRANSACTIONS } from '../../src/data/mockData';
import { useAuth } from '../../context/AuthContext';
import { fetchApi } from '../../utils/api';

export default function Home() {
  const { currentUser } = useAuth() as any;
  const [userName, setUserName] = useState(MOCK_USER.name);
  const [agent, setAgent] = useState(MOCK_USER.agent);
  
  const [loadingData, setLoadingData] = useState(true);
  const [binderSections, setBinderSections] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [dynamicUser, setDynamicUser] = useState(null);
  const [insights, setInsights] = useState([]);

  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.5, { duration: 1500 }), -1, true);
    
    AsyncStorage.getItem('monager_user_name').then(n => n && setUserName(n));
    AsyncStorage.getItem('monager_user_agent').then(a => a && setAgent(a));
  }, []);

  useEffect(() => {
    async function loadData() {
      if (!currentUser?.uid) return;
      try {
        const [binder, txRes] = await Promise.all([
          fetchApi(`/binder/${currentUser.uid}`).catch(() => null),
          fetchApi(`/transactions/${currentUser.uid}`).catch(() => null)
        ]);
        
        if (binder) {
          if (binder.user?.name) setUserName(binder.user.name);
          if (binder.user?.archetype && binder.user.archetype !== 'Pending') setAgent(binder.user.archetype.toUpperCase());
          setDynamicUser(binder.user);
          setBinderSections(binder.binder_sections || []);
          setInsights(binder.sticky_notes || []);
        }
        
        if (txRes && txRes.transactions) {
          setTransactions(txRes.transactions);
        }
      } catch (err) {
        console.error('Failed fetching dynamic data:', err);
      } finally {
        setLoadingData(false);
      }
    }
    loadData();
  }, [currentUser]);

  const micPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 2 - pulse.value
  }));

  const AGENT_COLOR = agent === 'SPROUT' ? C.GREEN : agent === 'VOLT' ? C.AMBER : C.BLUE;

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        
        {/* PREMIUM YELLOW HEADER */}
        <View style={s.yellowHeader}>
          <SafeAreaView edges={['top']}>
            <View style={s.headerTop}>
              <View style={s.headerLeft}>
                <View style={s.avatarWrapper}>
                   <Text style={s.avatarInitial}>
                     {userName && userName.toLowerCase() !== 'cont' ? userName.charAt(0).toUpperCase() : MOCK_USER.name.charAt(0)}
                   </Text>
                </View>
                <Text style={s.hiText}>
                  Hi {userName && userName.toLowerCase() !== 'cont' ? userName.split(' ')[0] : MOCK_USER.name.split(' ')[0]}
                </Text>
              </View>

              <View style={s.headerRightIcons}>
                <TouchableOpacity style={s.iconBtn}>
                  <Award color={C.T1} width={20} height={20} />
                </TouchableOpacity>
                <TouchableOpacity style={s.iconBtn}>
                  <Bell color={C.T1} width={20} height={20} />
                </TouchableOpacity>
              </View>
            </View>

            {/* TAB SWITCHER */}
            <View style={s.tabsRow}>
               <TouchableOpacity style={[s.tabPill, s.tabPillActive]}>
                  <HomeIcon color={C.BLUE} width={16} height={16} />
                  <Text style={[s.tabText, s.tabTextActive]}>Snapshot</Text>
               </TouchableOpacity>
               
               <TouchableOpacity style={s.tabPill}>
                  <Zap color={C.T2} width={16} height={16} />
                  <Text style={s.tabText}>FinSights</Text>
               </TouchableOpacity>
            </View>
          </SafeAreaView>
          
          <View style={s.headerCurve} />
        </View>

        {/* 4.2 BUDGET OVERVIEW CARD */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <View style={[globalStyles.cardStyle, s.netWorthCard]}>
            <View style={s.rowSpace}>
              <View>
                <Text style={globalStyles.sectionLabelStyle}>NET WORTH</Text>
                <Text style={s.heroAmount}>₹3,48,220</Text>
                <View style={s.statusBadge}>
                  <Text style={s.statusText}>Stable ✓</Text>
                </View>
              </View>
              {/* Donut Chart Mock */}
              <View style={s.donutWrap}>
                <Svg width="80" height="80" viewBox="0 0 100 100">
                  <Circle cx="50" cy="50" r="40" stroke={C.GREEN} strokeWidth="10" strokeDasharray="180 251" fill="none" />
                  <Circle cx="50" cy="50" r="40" stroke={C.RED} strokeWidth="10" strokeDasharray="40 251" strokeDashoffset="-180" fill="none" />
                  <Circle cx="50" cy="50" r="40" stroke={C.AMBER} strokeWidth="10" strokeDasharray="31 251" strokeDashoffset="-220" fill="none" />
                </Svg>
                <View style={s.donutCenter}><Text style={s.donutCenterText}>58%</Text></View>
              </View>
            </View>

            <View style={s.statsRow}>
              <View style={s.statCol}>
                <Text style={s.statLbl}>INCOME</Text>
                <Text style={[s.statVal, { color: C.GREEN }]}>₹{dynamicUser?.income || '72,500'}</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.statCol}>
                <Text style={s.statLbl}>SPEND</Text>
                <Text style={[s.statVal, { color: C.RED }]}>₹{binderSections.reduce((acc, s) => acc + (s.amount_spent || 0), 0).toFixed(0) || '13,500'}</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.statCol}>
                <Text style={s.statLbl}>SAVED</Text>
                <Text style={[s.statVal, { color: C.GREEN }]}>₹{
                  dynamicUser?.income 
                    ? (dynamicUser.income - binderSections.reduce((acc, s) => acc + (s.amount_spent || 0), 0)).toFixed(0) 
                    : '41,200'
                }</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* 4.3 BUDGET TRACKER */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <View style={[globalStyles.cardStyle, s.trackerCard]}>
            <Text style={[globalStyles.sectionLabelStyle, { marginBottom: 12 }]}>BUDGET TRACKER</Text>

            {(binderSections.length > 0 ? binderSections : Object.entries(MOCK_BUDGETS).map(([k, v]) => ({
              category: k, amount_spent: v.spent, allocated_budget: v.limit, id: k
            }))).map((val) => {
              const spent = val.amount_spent || 0;
              const limit = val.allocated_budget || 1;
              const pct = Math.min(spent / limit, 1);
              const trackColor = pct > 0.85 ? C.RED : pct > 0.6 ? C.AMBER : C.GREEN;
              return (
                <View key={val.id || val.category} style={s.trackRow}>
                  <View style={s.rowSpace}>
                    <Text style={s.trackCat}>{val.category.charAt(0).toUpperCase() + val.category.slice(1)}</Text>
                    <Text style={s.trackVals}>₹{Math.round(spent)} / ₹{Math.round(limit)}</Text>
                  </View>
                  <View style={s.progressBar}>
                    <View style={[s.progressFill, { width: `${pct * 100}%`, backgroundColor: trackColor }]} />
                  </View>
                  <Text style={s.pctLabel}>{Math.round(pct * 100)}%</Text>
                </View>
              )
            })}
          </View>
        </Animated.View>

        {/* 4.5 AI INSIGHTS STRIP */}
        <Animated.View entering={FadeInDown.delay(300)}>
          <View style={s.sectionHeader}>
            <Text style={globalStyles.sectionLabelStyle}>MONAGER INSIGHTS</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {(insights.length > 0 ? insights : [
              { id: 'MG-041', title: 'Subscription Creep', content: '7 subs active. 4 overlap. Cut ₹1,200/mo.', type: 'warning' },
              { id: 'MG-042', title: 'Food Overspend', content: '14 Zomato orders. ₹4,200 gone on Friday nights.', type: 'danger' },
              { id: 'MG-043', title: 'Saving Streak', content: '8 weeks positive. ₹30,670 saved this month.', type: 'success' },
            ]).map((insight, i) => {
              const borderC = insight.type === 'warning' ? C.AMBER : insight.type === 'danger' ? C.RED : C.GREEN;
              return (
                <View key={insight.id || i} style={[s.insightCard, { borderLeftColor: borderC }]}>
                  <Text style={s.insightId}>{insight.id ? insight.id.substring(0,6) : `MG-0${41+i}`}</Text>
                  <Text style={s.insightTitle}>{insight.title}</Text>
                  <Text style={s.insightText}>{insight.content || insight.text}</Text>
                  <Text style={[s.insightOpen, { color: C.GREEN }]}>Open →</Text>
                </View>
              )
            })}
            <View style={{ width: 16 }} />
          </ScrollView>
        </Animated.View>

        {/* 4.4 RECENT ACTIVITY */}
        <Animated.View entering={FadeInDown.delay(400)}>
          <View style={[s.sectionHeader, { marginTop: 16, paddingHorizontal: 16 }]}>
            <Text style={globalStyles.sectionLabelStyle}>RECENT ACTIVITY</Text>
            <Text style={s.seeAll}>See all →</Text>
          </View>
          <View style={s.txList}>
            {(transactions.length > 0 ? transactions : MOCK_TRANSACTIONS).slice(0, 5).map((tx, i, arr) => (
              <View key={tx.id} style={[s.txItem, i === arr.length - 1 && s.txNoBorder]}>
                <View style={s.txIcon}><Text style={{ color: C.T1 }}>{tx.merchant.charAt(0).toUpperCase()}</Text></View>
                <View style={s.txMid}>
                  <Text style={s.txTitle}>{tx.merchant}</Text>
                  <Text style={s.txSub}>{tx.category} · {tx.date && tx.date.includes('-') ? new Date(tx.date).toLocaleDateString() : tx.date}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[s.txAmt, { color: tx.type === 'credit' ? C.GREEN : C.T1 }]}>
                    {tx.type === 'credit' ? '+' : '−'}₹{tx.amount}
                  </Text>
                  {(tx.is_scanned || tx.scanned) && <View style={s.ocrBadge}><Text style={s.ocrText}>OCR</Text></View>}
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* 4.6 ANALYZER CARD */}
        <Animated.View entering={FadeInDown.delay(500)}>
          <View style={s.analyzerCard}>
            <Text style={[globalStyles.sectionLabelStyle, { color: C.BLUE }]}>SCREEN ANALYZER</Text>
            <Text style={s.analyzerSub}>Open any app → say Hey Monager → get instant analysis</Text>

            <View style={s.rowSpace}>
              <TouchableOpacity style={s.heyBtn}>
                <Mic color="#FFF" width={16} height={16} />
                <Text style={s.heyBtnText}>Hey Monager</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={s.uploadBtn}>
                <UploadCloud color={C.T2} width={16} height={16} />
                <Text style={s.uploadBtnText}>Screenshot</Text>
              </TouchableOpacity>
            </View>

            <View style={s.previewCard}>
              <View style={s.previewThumb}><Text style={{fontSize:9,color:C.T3,fontFamily:FONTS.MONO}}>IMG</Text></View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={s.previewTitle}>Zomato · ₹850 cart detected</Text>
                <Text style={s.previewSub}>2 mins ago · Food budget 77% used</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  scroll: { paddingBottom: 100 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  
  yellowHeader: { backgroundColor: C.YELLOW, paddingBottom: 0, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, overflow: 'hidden' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarWrapper: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF99', borderWidth: 1, borderColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontFamily: FONTS.SYNE, fontSize: 16, color: C.T1 },
  hiText: { fontFamily: FONTS.JAKARTA_SEMI, fontSize: 20, color: C.T1 },
  headerRightIcons: { flexDirection: 'row', gap: 12 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  
  tabsRow: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 24, marginBottom: 20, gap: 10 },
  tabPill: { flex: 1, flexDirection: 'row', height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', gap: 8 },
  tabPillActive: { backgroundColor: C.SURFACE },
  tabText: { fontFamily: FONTS.JAKARTA_SEMI, fontSize: 14, color: C.T2 },
  tabTextActive: { color: C.BLUE },
  
  headerCurve: { height: 10 },
  
  micBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.BASE, position: 'absolute', right: 20, bottom: -22, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, alignItems: 'center', justifyContent: 'center' },
  micDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.BLUE },
  micPulse: { position: 'absolute', width: 42, height: 42, borderRadius: 21, backgroundColor: C.BLUE_DIM },

  netWorthCard: { marginHorizontal: 16, marginBottom: 16, marginTop: -15 },
  rowSpace: { flexDirection: 'row', justifyContent: 'space-between' },
  heroAmount: { fontFamily: FONTS.SYNE, fontSize: 38, color: C.T1, marginTop: 4 },
  statusBadge: { backgroundColor: C.BLUE_DIM, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, alignSelf: 'flex-start', marginTop: 8 },
  statusText: { fontFamily: FONTS.MONO, fontSize: 11, color: C.BLUE },
  
  donutWrap: { position: 'relative', width: 80, height: 80 },
  donutCenter: { position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  donutCenterText: { fontFamily: FONTS.MONO, fontSize: 14, color: C.BLUE },

  statsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: C.BORDER, paddingTop: 14, marginTop: 14 },
  statCol: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: C.BORDER, height: '80%', alignSelf: 'center' },
  statLbl: { fontFamily: FONTS.MONO, fontSize: 9, color: C.T2, letterSpacing: 1, marginBottom: 3 },
  statVal: { fontFamily: FONTS.MONO, fontSize: 13, color: C.T1 },

  trackerCard: { marginHorizontal: 16, marginBottom: 16, borderRadius: 20 },
  trackRow: { marginBottom: 14 },
  trackCat: { fontFamily: FONTS.JAKARTA, fontSize: 14, color: C.T1 },
  trackVals: { fontFamily: FONTS.MONO, fontSize: 12, color: C.T2 },
  progressBar: { height: 4, backgroundColor: C.SURFACE, borderRadius: 2, marginTop: 6 },
  progressFill: { height: '100%', borderRadius: 2 },
  pctLabel: { fontFamily: FONTS.MONO, fontSize: 10, color: C.T2, marginTop: 4 },

  sectionHeader: { paddingHorizontal: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seeAll: { fontFamily: FONTS.MONO, fontSize: 10, color: C.BLUE },
  
  insightCard: { minWidth: 220, backgroundColor: C.SURFACE, borderRadius: 20, padding: 16, borderLeftWidth: 3, marginRight: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  insightId: { fontFamily: FONTS.MONO, fontSize: 9, color: C.T2, marginBottom: 4 },
  insightTitle: { fontFamily: FONTS.SYNE, fontSize: 14, color: C.T1, marginBottom: 6 },
  insightText: { fontFamily: FONTS.JAKARTA, fontSize: 12, color: C.T2, lineHeight: 18 },
  insightOpen: { fontFamily: FONTS.MONO, fontSize: 10, marginTop: 8 },
  txList: { backgroundColor: C.SURFACE, borderRadius: 20, marginHorizontal: 16, overflow: 'hidden', borderWidth: 1, borderColor: C.BORDER },
  txItem: { flexDirection: 'row', padding: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: C.BORDER, alignItems: 'center', gap: 12 },
  txNoBorder: { borderBottomWidth: 0 },
  txIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.BASE, alignItems: 'center', justifyContent: 'center' },
  txMid: { flex: 1 },
  txTitle: { fontFamily: FONTS.JAKARTA_SEMI, fontSize: 14, color: C.T1 },
  txSub: { fontFamily: FONTS.JAKARTA, fontSize: 12, color: C.T2, marginTop: 2 },
  txAmt: { fontFamily: FONTS.MONO, fontSize: 14, color: C.T1 },
  ocrBadge: { backgroundColor: C.BLUE_DIM, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, marginTop: 4 },
  ocrText: { fontFamily: FONTS.MONO, fontSize: 8, color: C.BLUE },
  
  analyzerCard: { backgroundColor: C.SURFACE, borderWidth: 1, borderColor: C.BORDER, borderRadius: 24, padding: 20, marginHorizontal: 16, marginTop: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  analyzerSub: { fontFamily: FONTS.JAKARTA, fontSize: 13, color: C.T2, lineHeight: 20, marginBottom: 16, marginTop: 4 },
  heyBtn: { flex: 1, backgroundColor: C.BLUE, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginRight: 5 },
  heyBtnText: { fontFamily: FONTS.SYNE, fontSize: 14, color: '#FFF' },
  uploadBtn: { flex: 1, backgroundColor: C.SURFACE, borderWidth: 1, borderColor: C.BORDER, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginLeft: 5 },
  uploadBtnText: { fontFamily: FONTS.JAKARTA_SEMI, fontSize: 14, color: C.T1 },
  previewCard: { backgroundColor: C.BASE, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.BORDER, flexDirection: 'row', marginTop: 16, alignItems: 'center' },
  previewThumb: { width: 40, height: 40, borderRadius: 8, backgroundColor: C.SURFACE, borderWidth: 1, borderColor: C.BORDER, alignItems: 'center', justifyContent: 'center' },
  previewTitle: { fontFamily: FONTS.JAKARTA_SEMI, fontSize: 13, color: C.T1 },
  previewSub: { fontFamily: FONTS.MONO, fontSize: 10, color: C.T2, marginTop: 2 },
});
