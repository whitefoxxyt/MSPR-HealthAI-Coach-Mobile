import { Redirect } from 'expo-router';
import { useApp } from '@/store/AppContext';

export default function Index() {
  const { isAuthenticated, profile } = useApp();

  if (!isAuthenticated) return <Redirect href="/(auth)/welcome" />;
  if (!profile.onboardingCompleted) return <Redirect href="/(onboarding)/goal" />;
  return <Redirect href="/(tabs)" />;
}
