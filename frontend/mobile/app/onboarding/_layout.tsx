import { Stack } from 'expo-router';
import { C } from '../../src/theme';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: C.BASE },
        animation: 'fade',
      }}
    />
  );
}
