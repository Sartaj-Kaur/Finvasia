import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, View, Text } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

function TabBarIcon(props) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.leather,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.paper,
          borderTopWidth: 1,
          borderTopColor: colors.stone,
          elevation: 0,
          shadowOpacity: 0,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        headerStyle: {
          backgroundColor: colors.paper,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.stone,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: colors.text,
          fontFamily: 'serif',
        },
        headerTintColor: colors.text,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Desk',
          headerTitle: 'Monager',
          tabBarIcon: ({ color }) => <TabBarIcon name="inbox" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <View style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}>
                    <FontAwesome name="envelope-open-o" size={20} color={colors.leather} />
                  </View>
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          headerTitle: 'Working Money',
          tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color }) => (
            <View style={{
              backgroundColor: colors.gold,
              width: 56,
              height: 56,
              borderRadius: 28,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -20, 
              shadowColor: colors.gold,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 5,
              borderWidth: 3,
              borderColor: colors.paper
            }}>
              <FontAwesome name="camera" size={22} color="#fcfaf5" />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="fintwin"
        options={{
          title: 'FinTwin',
          headerTitle: 'Talk to Monager',
          tabBarIcon: ({ color }) => <TabBarIcon name="comment-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="futureself"
        options={{
          title: 'Future',
          headerTitle: 'Future Self',
          tabBarIcon: ({ color }) => <TabBarIcon name="user-circle-o" color={color} />,
        }}
      />
    </Tabs>
  );
}
