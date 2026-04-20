import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, Smartphone, Wifi, Droplet, CreditCard } from 'react-native-feather';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { C, FONTS, globalStyles } from '../../src/theme';
import { MOCK_BILLS_DUE } from '../../src/data/mockData';

const QUICK_BILLS = [
  { icon: <Zap color={C.AMBER} />, name: 'Electricity', last: '₹1,240', date: 'Apr 1', color: C.YELLOW_DIM },
  { icon: <Smartphone color={C.BLUE} />, name: 'Mobile/DTH', last: '₹399', date: 'Apr 3', color: C.BLUE_DIM },
  { icon: <Wifi color={C.BLUE} />, name: 'Broadband', last: '₹999', date: 'Mar 31', color: C.BLUE_DIM },
  { icon: <Droplet color="#38BDF8" />, name: 'Water', last: '₹340', date: 'Apr 2', color: 'rgba(56,189,248,0.1)' },
];

export default function Bills() {
  return (
    <View style={s.root}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        
        <View style={s.header}>
          <Text style={s.title}>PAY BILLS</Text>
        </View>

        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          
          <Animated.View entering={FadeInDown.delay(100)} style={s.gridRow}>
            {QUICK_BILLS.map((b, i) => (
              <TouchableOpacity key={i} style={[globalStyles.cardStyle, s.gridCard]} activeOpacity={0.8}>
                <View style={[s.iconCirc, { backgroundColor: b.color }]}>
                  {b.icon}
                </View>
                <Text style={s.gridName}>{b.name}</Text>
                <Text style={s.gridSub}>Last: {b.last} · {b.date}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200)}>
            <View style={s.sectionHeader}>
              <Text style={[globalStyles.sectionLabelStyle, { color: C.AMBER }]}>DUE SOON</Text>
              <View style={s.amberDot} />
            </View>

            <View style={s.listCont}>
              {MOCK_BILLS_DUE.map((b, i) => (
                <View key={b.id} style={[s.item, i === MOCK_BILLS_DUE.length - 1 && s.noBorder]}>
                  <View style={s.itemIcon}>
                    <Text style={{ fontFamily: FONTS.SYNE, color: C.T1 }}>{b.operator.charAt(0)}</Text>
                  </View>
                  <View style={s.itemMid}>
                    <Text style={s.itemTitle}>{b.name}</Text>
                    <Text style={s.itemSub}>{b.operator}</Text>
                  </View>
                  <View style={s.itemRight}>
                    <Text style={s.amt}>₹{b.amount}</Text>
                    <View style={[s.dueBadge, { backgroundColor: i === 0 ? C.RED_DIM : C.AMBER_DIM }]}>
                      <Text style={[s.dueBadgeText, { color: i === 0 ? C.RED : C.AMBER }]}>
                        {i === 0 ? 'Tomorrow' : 'In 3 days'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  title: { fontFamily: FONTS.SYNE, fontSize: 28, color: C.T1 },
  
  scroll: { paddingHorizontal: 16 },

  gridRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  gridCard: { width: '48%', flexGrow: 1, padding: 20, alignItems: 'center' },
  iconCirc: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  gridName: { fontFamily: FONTS.JAKARTA_SEMI, fontSize: 14, color: C.T1, marginBottom: 4 },
  gridSub: { fontFamily: FONTS.MONO, fontSize: 10, color: C.T2 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  amberDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.AMBER },

  listCont: { backgroundColor: C.SURFACE, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: C.BORDER, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 3 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: C.BORDER },
  noBorder: { borderBottomWidth: 0 },
  itemIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.BASE, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  itemMid: { flex: 1 },
  itemTitle: { fontFamily: FONTS.JAKARTA_SEMI, fontSize: 14, color: C.T1 },
  itemSub: { fontFamily: FONTS.MONO, fontSize: 11, color: C.T2, marginTop: 2 },
  itemRight: { alignItems: 'flex-end' },
  amt: { fontFamily: FONTS.MONO, fontSize: 15, color: C.T1, marginBottom: 4 },
  dueBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  dueBadgeText: { fontFamily: FONTS.MONO, fontSize: 10 },
});
