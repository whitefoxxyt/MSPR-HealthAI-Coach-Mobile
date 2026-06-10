import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="goal" />
      <Stack.Screen name="physical" />
      <Stack.Screen name="activity" />
      <Stack.Screen name="diet" />
      <Stack.Screen name="sport-prefs" />
    </Stack>
  );
}
