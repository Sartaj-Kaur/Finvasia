import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
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
          borderTopWidth: 1,
          borderTopColor: C.border,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          elevation: 0,
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          borderRadius: 22,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
        },
        tabBarShowLabel: false,
      }}>

      <Tabs.Screen
        name="index"
        options={{ tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="activity"
        options={{ tabBarIcon: ({ color }) => <FontAwesome name="line-chart" size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          tabBarIcon: () => (
            <View style={{
              backgroundColor: C.terra, width: 52, height: 52, borderRadius: 26,
              justifyContent: 'center', alignItems: 'center', marginBottom: 16,
              shadowColor: C.terra, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10,
            }}>
              <FontAwesome name="camera" size={20} color={C.cream} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarIcon: ({ color }) => <FontAwesome name="user" size={22} color={color} /> }}
      />
    </Tabs>
  );
}
