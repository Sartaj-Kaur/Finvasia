import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard, Zap, Circle } from 'react-native-feather';
import { Svg, Path, Circle as SvgCircle } from 'react-native-svg';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { C, FONTS, globalStyles } from '../../src/theme';
import { MOCK_MICRO, MOCK_USER } from '../../src/data/mockData';
import { useAuth } from '../../context/AuthContext';
import { fetchApi } from '../../utils/api';

export default function MicroInvest() {
  const { currentUser } = useAuth() as any;
  const [data, setData] = React.useState<any>(null);

  React.useEffect(() => {
    async function load() {
      if (!currentUser?.uid) return;
      try {
        const res = await fetchApi(`/binder/${currentUser.uid}`);
        if (res && res.investments) {
          setData(res.investments);
        }
      } catch (err) { }
    }
    load();
  }, [currentUser]);

  const total = data?.amount || MOCK_MICRO.total;
  return (
    <View style={s.root}>
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <View style={s.header}>
        <Text style={s.title}>MICRO INVEST</Text>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Top Agent Msg */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <View style={s.agentMsgCard}>
            <View style={s.agentMsgCircle}><Text style={s.agentMsgInit}>M</Text></View>
            <Text style={s.agentMsgText}>"You didn't have to think about this. It just works. ⚡"</Text>
          </View>
        </Animated.View>

        {/* Hero */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <View style={[globalStyles.cardStyle, s.heroCard]}>
            <Text style={globalStyles.sectionLabelStyle}>AUTO-SAVED THIS MONTH</Text>
            <Text style={s.heroMain}>₹{total.toLocaleString('en-IN')}</Text>
            <Text style={s.heroSub}>+₹890 vs last month ↑</Text>

            <View style={s.heroStats}>
              <View style={s.hStatCol}>
                <Text style={s.hStatVal}>₹1,840</Text>
                <Text style={s.hStatLbl}>Cashbacks</Text>
              </View>
              <View style={s.hStatDivider} />
              <View style={s.hStatCol}>
                <Text style={s.hStatVal}>₹1,190</Text>
                <Text style={s.hStatLbl}>Bill Savings</Text>
              </View>
              <View style={s.hStatDivider} />
              <View style={s.hStatCol}>
                <Text style={s.hStatVal}>₹1,200</Text>
                <Text style={s.hStatLbl}>Roundups</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Source 1 */}
        <Animated.View entering={FadeInDown.delay(300)}>
          <View style={[globalStyles.cardStyle, s.sourceCard]}>
            <View style={s.sourceHead}>
              <View style={[s.sourceIcon, { backgroundColor: C.BLUE_DIM }]}>
                <CreditCard color={C.BLUE} width={24} height={24} />
              </View>
              <View>
                <Text style={[globalStyles.sectionLabelStyle, { marginBottom: 4 }]}>CASHBACK HARVEST</Text>
                <Text style={[s.sourceAmt, { color: C.BLUE }]}>₹1,840</Text>
              </View>
            </View>

            <View style={s.sourceList}>
              {(data ? [{ merchant: 'Autosweep (Invested)', amount: total }] : MOCK_MICRO.cashbacks).map((c: any, i: number) => (
                <View key={i} style={s.slItem}>
                  <Text style={s.slName}>{c.merchant}</Text>
                  <Text style={[s.slVal, { color: C.BLUE }]}>+₹{c.amount}</Text>
                </View>
              ))}
            </View>

            <View style={[s.statusPill, { backgroundColor: C.BLUE_DIM, borderColor: C.BORDER }]}>
              <Text style={[s.statusPillText, { color: C.BLUE }]}>→ Invested in Nifty 50 SIP ✓</Text>
            </View>
          </View>
        </Animated.View>

        {/* Timeline Wrapper (Placeholder for space) */}
        <Animated.View entering={FadeInDown.delay(400)}>
          <View style={[globalStyles.cardStyle, s.timelineWrapper]}>
            <Text style={[globalStyles.sectionLabelStyle, { marginBottom: 16 }]}>TIMELINE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Svg width={400} height={90} viewBox="0 0 400 90">
                <Path d="M0 45 L400 45" stroke={C.BORDER} strokeWidth={2} />

                {/* Dots */}
                <SvgCircle cx={30} cy={45} r={6} fill={C.BLUE} />
                <SvgCircle cx={80} cy={45} r={6} fill={C.YELLOW} />
                <SvgCircle cx={150} cy={45} r={6} fill={C.BLUE} />
                <SvgCircle cx={220} cy={45} r={6} fill={C.YELLOW} />
                <SvgCircle cx={300} cy={45} r={6} fill={C.AMBER} />
                <SvgCircle cx={360} cy={45} r={6} fill={C.BLUE} />

                {/* Fake legends */}
                <SvgText x={30} y={30} fill={C.T3} font={'10px JetBrainsMono'}>Apr 1</SvgText>
                <SvgText x={80} y={30} fill={C.T3} font={'10px JetBrainsMono'}>Apr 3</SvgText>
                <SvgText x={30} y={70} fill={C.GREEN} font={'10px JetBrainsMono'}>+₹120</SvgText>
                <SvgText x={80} y={70} fill={C.AMBER} font={'10px JetBrainsMono'}>+₹340</SvgText>
              </Svg>
            </ScrollView>
          </View>
        </Animated.View>

        {/* Projection strip */}
        <Animated.View entering={FadeInDown.delay(500)}>
          <View style={s.projectionCard}>
            <View>
              <Text style={globalStyles.sectionLabelStyle}>AT THIS RATE:</Text>
              <Text style={s.projVal}>₹50,760 / year</Text>
              <Text style={s.projSub}>auto-invested without thinking</Text>
            </View>
            <Svg width={40} height={40} viewBox="0 0 40 40">
              <Path d="M5 35 L20 20 L28 25 L38 5" stroke={C.GREEN} strokeWidth={3} fill="none" strokeLinecap="round" />
            </Svg>
          </View>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  </View>
  );
}

// Temporary SvgText workaround since it's not exported by default from react-native-svg usually, we'll just not use text in SVG and keep it abstract
function SvgText(props: any) {
  return <></>; // Fallback
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  title: { fontFamily: FONTS.SYNE, fontSize: 28, color: C.T1 },
  scroll: {},

  agentMsgCard: { marginHorizontal: 16, marginBottom: 16, backgroundColor: C.SURFACE, borderRadius: 16, borderLeftWidth: 3, borderLeftColor: C.BLUE, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 5, elevation: 1 },
  agentMsgCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.YELLOW, alignItems: 'center', justifyContent: 'center' },
  agentMsgInit: { fontFamily: FONTS.SYNE, fontSize: 13, color: C.T1 },
  agentMsgText: { flex: 1, fontFamily: FONTS.JAKARTA, fontSize: 13, color: C.T2, lineHeight: 20 },

  heroCard: { marginHorizontal: 16, marginBottom: 16 },
  heroMain: { fontFamily: FONTS.SYNE, fontSize: 52, color: C.BLUE, lineHeight: 56, marginTop: 12 },
  heroSub: { fontFamily: FONTS.JAKARTA, fontSize: 14, color: C.T2 },

  heroStats: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: C.BORDER, paddingTop: 14, marginTop: 16 },
  hStatCol: { flex: 1, alignItems: 'center' },
  hStatDivider: { width: 1, backgroundColor: C.BORDER, height: '80%', alignSelf: 'center' },
  hStatVal: { fontFamily: FONTS.MONO, fontSize: 13, color: C.T1, marginBottom: 4 },
  hStatLbl: { fontFamily: FONTS.JAKARTA, fontSize: 11, color: C.T2 },

  sourceCard: { marginHorizontal: 16, marginBottom: 16 },
  sourceHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  sourceIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  sourceAmt: { fontFamily: FONTS.SYNE, fontSize: 28 },

  sourceList: { borderTopWidth: 1, borderTopColor: C.BORDER, paddingTop: 12, gap: 10 },
  slItem: { flexDirection: 'row', justifyContent: 'space-between' },
  slName: { fontFamily: FONTS.JAKARTA, fontSize: 14, color: C.T1 },
  slVal: { fontFamily: FONTS.MONO, fontSize: 13 },

  statusPill: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1, marginTop: 16 },
  statusPillText: { fontFamily: FONTS.MONO, fontSize: 11 },

  timelineWrapper: { marginHorizontal: 16, marginBottom: 16 },

  projectionCard: { backgroundColor: C.DARK_NAVY, borderRadius: 20, padding: 20, marginHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  projVal: { fontFamily: FONTS.SYNE, fontSize: 22, color: C.YELLOW, marginTop: 4, marginBottom: 2 },
  projSub: { fontFamily: FONTS.JAKARTA, fontSize: 12, color: '#FFFFFF99' }
});
