import React from 'react';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { View, Platform } from 'react-native';
import { C } from '../../constants/Theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.tabActive,
        tabBarInactiveTintColor: C.tabInactive,
        tabBarStyle: {
          backgroundColor: C.tabBg,
          borderTopWidth: 0,
          borderTopColor: 'transparent',
          height: Platform.OS === 'ios' ? 108 : 88,
          paddingBottom: Platform.OS === 'ios' ? 42 : 22,
          paddingTop: 18,
          elevation: 20,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
        },
        tabBarShowLabel: false,
      }}>

      <Tabs.Screen
        name="index"
        options={{ tabBarIcon: ({ color }) => <Feather name="grid" size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="activity"
        options={{ tabBarIcon: ({ color }) => <Feather name="pie-chart" size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          tabBarIcon: () => (
            <View style={{
              backgroundColor: C.green, width: 56, height: 56, borderRadius: 28,
              justifyContent: 'center', alignItems: 'center', marginBottom: 20,
              shadowColor: C.green, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
            }}>
              <Feather name="maximize" size={24} color={C.tabBg} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} /> }}
      />
    </Tabs>
  );
}
