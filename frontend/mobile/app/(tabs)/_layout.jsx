import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, View } from 'react-native';

function TabBarIcon(props) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FCD34D', // Gold accent
        tabBarInactiveTintColor: '#9da3af',
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        headerStyle: {
          backgroundColor: '#0f172a',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#ffffff',
        },
        headerTintColor: '#ffffff',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'Overview',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <View style={{
                    backgroundColor: '#1f2937',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                    marginRight: 15,
                    opacity: pressed ? 0.5 : 1,
                  }}>
                    <FontAwesome name="book" size={16} color="#FCD34D" style={{ marginRight: 4 }} />
                  </View>
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color }) => <TabBarIcon name="pie-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => (
            <View style={{
              backgroundColor: '#10B981', // Green accent
              width: 48,
              height: 48,
              borderRadius: 24,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -15, // Floating active button
              shadowColor: '#10B981',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            }}>
              <FontAwesome name="plus" size={24} color="#0f172a" />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ color }) => <TabBarIcon name="bullseye" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
