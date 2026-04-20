import { Stack } from 'expo-router';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Syne_600SemiBold, Syne_700Bold, Syne_800ExtraBold } from '@expo-google-fonts/syne';
import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import { JetBrainsMono_400Regular, JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { C } from '../src/theme';
import HeyMonagerOverlay from '../src/components/HeyMonagerOverlay';
import BackgroundShapes from '../src/components/BackgroundShapes';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Syne_600SemiBold,
    Syne_700Bold,
    Syne_800ExtraBold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold
  });

  if (!fontsLoaded) return null;

  const transparentTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent',
    },
  };

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: C.BASE }}>
      <BackgroundShapes />
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ThemeProvider value={transparentTheme}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' }, animation: 'fade' }} />
      </ThemeProvider>
      
      {/* Global AI Floating Overlay Button */}
      <HeyMonagerOverlay />
    </SafeAreaProvider>
  );
}
