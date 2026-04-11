import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';

// Helper component for Quick Action Buttons
const QuickAction = ({ icon, label }) => (
  <View style={styles.actionContainer}>
    <TouchableOpacity style={styles.actionButton}>
      <FontAwesome name={icon} size={20} color="#FCD34D" />
    </TouchableOpacity>
    <Text style={styles.actionLabel}>{label}</Text>
  </View>
);

// Helper component for Spending Categories
const CategoryRow = ({ title, amount, color, percentage }) => (
  <View style={styles.categoryRow}>
    <View style={styles.categoryInfo}>
      <View style={[styles.categoryDot, { backgroundColor: color }]} />
      <Text style={styles.categoryText}>{title}</Text>
    </View>
    <View style={styles.categoryRight}>
      <Text style={styles.categoryAmount}>₹{amount}</Text>
      <Text style={[styles.categoryPercentage, { color }]}>{percentage}</Text>
    </View>
  </View>
);

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.balance}>₹ 2,45,000</Text>
          <View style={styles.changeBadge}>
            <FontAwesome name="arrow-up" size={12} color="#10B981" />
            <Text style={styles.changeText}>+ ₹12,400 this month</Text>
          </View>
        </View>

        {/* OPEN PLANNER CTA (Alternatively placed here to be extremely visible) */}
        <Link href="/modal" asChild>
          <TouchableOpacity style={styles.plannerBanner}>
            <View style={styles.plannerContent}>
              <FontAwesome name="book" size={20} color="#0f172a" />
              <Text style={styles.plannerText}>Open 3D Desk Planner</Text>
            </View>
            <FontAwesome name="chevron-right" size={14} color="#0f172a" />
          </TouchableOpacity>
        </Link>

        {/* SECTION 1 - QUICK ACTIONS */}
        <View style={styles.quickActions}>
          <QuickAction icon="minus" label="Expense" />
          <QuickAction icon="plus" label="Income" />
          <QuickAction icon="exchange" label="Transfer" />
          <QuickAction icon="download" label="Save" />
        </View>

        {/* SECTION 2 - SPENDING */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending Breakdown</Text>
          <View style={styles.card}>
            <CategoryRow title="Needs" amount="42,000" color="#10B981" percentage="55%" />
            <View style={styles.divider} />
            <CategoryRow title="Wants" amount="21,500" color="#FCD34D" percentage="30%" />
            <View style={styles.divider} />
            <CategoryRow title="Other" amount="8,500" color="#9da3af" percentage="15%" />
          </View>
        </View>

        {/* SECTION 3 - GOALS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Goals</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>
          <View style={styles.card}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>New Phone Fund</Text>
              <Text style={styles.goalAmount}>₹9,200 / ₹30,000</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '30%', backgroundColor: '#FCD34D' }]} />
            </View>
          </View>
        </View>

        {/* SECTION 4 - SAVINGS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Savings</Text>
          <View style={styles.card}>
            <View style={styles.savingsRow}>
              <View>
                <Text style={styles.savingsLabel}>March Goal</Text>
                <Text style={styles.savingsValue}>₹ 15,000</Text>
              </View>
              <View style={styles.savingsRight}>
                <Text style={styles.savingsPercentage}>82%</Text>
                <Text style={styles.savingsSubtext}>Completed</Text>
              </View>
            </View>
            <View style={[styles.progressBarBg, { marginTop: 15 }]}>
              <View style={[styles.progressBarFill, { width: '82%', backgroundColor: '#10B981' }]} />
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroSection: {
    marginTop: 20,
    marginBottom: 25,
  },
  greeting: {
    color: '#9da3af',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  balance: {
    color: '#ffffff',
    fontSize: 42,
    fontWeight: 'bold',
    marginTop: 5,
    letterSpacing: -1,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },
  changeText: {
    color: '#10B981',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  plannerBanner: {
    backgroundColor: '#FCD34D',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#FCD34D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  plannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plannerText: {
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 35,
  },
  actionContainer: {
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#1f2937',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '500',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  seeAll: {
    color: '#FCD34D',
    fontWeight: '600',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 20,
    padding: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  categoryText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '500',
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  categoryPercentage: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 15,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 15,
  },
  goalTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  goalAmount: {
    color: '#9da3af',
    fontSize: 14,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsLabel: {
    color: '#9da3af',
    fontSize: 14,
    marginBottom: 4,
  },
  savingsValue: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  savingsRight: {
    alignItems: 'flex-end',
  },
  savingsPercentage: {
    color: '#10B981',
    fontSize: 24,
    fontWeight: 'bold',
  },
  savingsSubtext: {
    color: '#9da3af',
    fontSize: 12,
  },
});
