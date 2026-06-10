import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors, Spacing } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SafeScreen } from '@/components/ui/SafeScreen';
import useApp from '@/hooks/useApp';

export default function LoginScreen() {
  const { login, updateProfile } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.includes('@')) { setError('Email invalide'); return; }
    if (!password) { setError('Mot de passe requis'); return; }
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      updateProfile({ onboardingCompleted: true });
      router.replace('/(tabs)');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Échec de la connexion');
      setLoading(false);
      return;
    }
    
    setLoading(false);
  }

  return (
    <SafeScreen backgroundColor={Colors.cream}>
      <StatusBar style="dark" />
      <TouchableOpacity
        style={styles.back}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Retour"
      >
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">Bon retour 👋</Text>
        <Text style={styles.sub}>Connecte-toi pour reprendre là où tu {"'"}es arrêté.</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="alex@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          accessibilityLabel="Votre adresse email"
        />
        <Input
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleLogin}
          accessibilityLabel="Votre mot de passe"
        />
        {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
      </View>

      <Button
        label="Se connecter"
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        onPress={handleLogin}
        style={styles.cta}
        accessibilityLabel="Se connecter"
      />

      <View style={styles.registerRow}>
        <Text style={styles.registerText}>Pas encore de compte ? </Text>
        <TouchableOpacity
          onPress={() => router.replace('/(auth)/register')}
          accessibilityRole="link"
          accessibilityLabel="Créer un compte"
        >
          <Text style={styles.registerLink}>S{"'"}inscrire</Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  back: { marginBottom: Spacing.lg },
  backText: { fontSize: 15, color: Colors.gray600 },
  header: { marginBottom: Spacing.xl },
  title: { fontSize: 32, fontWeight: '700', letterSpacing: -1, color: Colors.onyx, lineHeight: 36 },
  sub: { fontSize: 15, color: Colors.gray600, marginTop: Spacing.sm, lineHeight: 22 },
  form: { gap: Spacing.md, marginBottom: Spacing.lg },
  error: { fontSize: 13, color: Colors.coral },
  cta: { marginBottom: Spacing.md },
  registerRow: { flexDirection: 'row', justifyContent: 'center' },
  registerText: { fontSize: 14, color: Colors.gray600 },
  registerLink: { fontSize: 14, fontWeight: '600', color: Colors.onyx, textDecorationLine: 'underline' },
});
