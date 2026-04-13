import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { FadeInUp, Layout, ZoomIn } from 'react-native-reanimated';
import Colors from '@/constants/Colors';

const theme = Colors.light;

const PiggyBankGrid = () => {
  // Simulate 7 out of 10 cells being filled for prototype
  const cells = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    filled: i < 7
  }));

  return (
    <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
      <Text style={styles.sectionTitle}>Salvaged Money</Text>
      <View style={styles.card}>
        <Text style={styles.gridSubtitle}>₹700 moved to savings this week</Text>
        <View style={styles.gridContainer}>
          {cells.map((cell, index) => (
            <Animated.View 
              key={cell.id} 
              entering={ZoomIn.delay(300 + (index * 100))}
              style={[
                styles.gridCell,
                cell.filled ? styles.gridCellFilled : styles.gridCellEmpty
              ]}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

const CaseFile = () => (
  <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
    <Text style={styles.sectionTitle}>Case File: Food Delivery</Text>
    <View style={[styles.card, styles.manilaFolder]}>
      <View style={styles.folderTab} />
      <View style={styles.folderBody}>
        <Text style={styles.folderText}>
          You've ordered significantly less food this week compared to last. 
          The surplus ₹400 was automatically kept working.
        </Text>
        <View style={styles.folderDivider} />
        <View style={styles.folderFooter}>
          <Text style={styles.folderFooterLabel}>STATUS:</Text>
          <Text style={styles.folderFooterValue}>OPTIMIZED</Text>
        </View>
      </View>
    </View>
  </Animated.View>
);

const LetterPreview = () => (
  <Animated.View entering={FadeInUp.delay(500)} style={styles.section}>
    <Text style={styles.sectionTitle}>Monthly Letter</Text>
    <TouchableOpacity style={[styles.card, styles.letterCard]}>
      <Text style={styles.letterText} numberOfLines={3}>
        Dear Navya,{"\n\n"}
        March was a quiet month, and quiet is good. You managed to rein in the impulsive weekend spending, and we are starting to see the compound effects taking root...
      </Text>
      <Text style={styles.readMore}>Tap to break the seal</Text>
    </TouchableOpacity>
  </Animated.View>
)

export default function ActivityScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.headerState}>Money working in the background...</Text>
        
        <PiggyBankGrid />
        
        <CaseFile />

        <LetterPreview />

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.paper,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  headerState: {
    color: theme.tabIconDefault,
    fontFamily: 'serif',
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 25,
    marginTop: 10,
  },
  section: {
    marginBottom: 35,
  },
  sectionTitle: {
    color: theme.text,
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: theme.paperLight,
    borderWidth: 1,
    borderColor: theme.stone,
    shadowColor: theme.leatherLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  gridSubtitle: {
    color: theme.tabIconDefault,
    fontSize: 14,
    marginBottom: 15,
    padding: 20,
    paddingBottom: 0,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    justifyContent: 'space-between',
    gap: 10,
  },
  gridCell: {
    width: '18%', 
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  gridCellFilled: {
    backgroundColor: theme.gold,
    borderColor: '#c29a27', // darker gold
  },
  gridCellEmpty: {
    backgroundColor: 'transparent',
    borderColor: theme.stone,
  },
  manilaFolder: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    shadowOpacity: 0,
  },
  folderTab: {
    backgroundColor: theme.wood,
    width: '40%',
    height: 15,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: theme.stone,
    marginLeft: 10,
  },
  folderBody: {
    backgroundColor: theme.wood,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.stone,
    borderRadius: 8,
    borderTopLeftRadius: 0,
    shadowColor: theme.leather,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  folderText: {
    color: theme.text,
    fontFamily: 'serif',
    fontSize: 16,
    lineHeight: 24,
  },
  folderDivider: {
    height: 1,
    backgroundColor: theme.stone,
    marginVertical: 15,
    opacity: 0.5,
  },
  folderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  folderFooterLabel: {
    color: theme.leather,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  folderFooterValue: {
    color: '#10B981', // green stamp
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontFamily: 'serif', // stamp look
  },
  letterCard: {
    padding: 25,
    backgroundColor: theme.paper, // slightly darker to look folded
  },
  letterText: {
    color: theme.text,
    fontFamily: 'serif',
    fontSize: 16,
    lineHeight: 26,
    opacity: 0.8,
  },
  readMore: {
    color: theme.leatherLight,
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 20,
    textAlign: 'center',
  }
});
