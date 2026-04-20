
import { Tabs as ExpoTabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Home, FileText, Zap, User, TrendingUp } from 'react-native-feather';
import { C, FONTS } from '../../src/theme';

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <ExpoTabs
      sceneContainerStyle={{ backgroundColor: 'transparent' }}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.SURFACE,
          borderTopWidth: 1,
          borderTopColor: C.BORDER,
          height: 84,
          paddingBottom: 24,
          paddingTop: 12,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 10,
        },
        tabBarActiveTintColor: C.BLUE,
        tabBarInactiveTintColor: C.T3,
        tabBarLabelStyle: {
          fontFamily: FONTS.JAKARTA_SEMI,
          fontSize: 10,
          marginTop: 6,
        }
      }}
    >
      <ExpoTabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Home stroke={color} width={24} height={24} />
              {focused && <View style={s.dot} />}
            </View>
          ),
        }}
      />
      <ExpoTabs.Screen
        name="receipts"
        options={{
          tabBarLabel: 'Receipts',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <FileText stroke={color} width={24} height={24} />
              {focused && <View style={s.dot} />}
            </View>
          ),
        }}
      />
      <ExpoTabs.Screen
        name="bills"
        options={{
          tabBarLabel: 'Bills',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Zap stroke={color} width={24} height={24} />
              {focused && <View style={s.dot} />}
            </View>
          ),
        }}
      />
      <ExpoTabs.Screen
        name="micro"
        options={{
          tabBarLabel: 'Invest',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <TrendingUp stroke={color} width={24} height={24} />
              {focused && <View style={s.dot} />}
            </View>
          ),
        }}
      />
      <ExpoTabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <User stroke={color} width={24} height={24} />
              {focused && <View style={s.dot} />}
            </View>
          ),
        }}
      />
    </ExpoTabs>
    </View>
  );
}

const s = StyleSheet.create({
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.BLUE,
    position: 'absolute',
    bottom: -10,
  }
});
