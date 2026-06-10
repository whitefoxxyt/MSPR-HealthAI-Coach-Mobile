import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors, Spacing } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SafeScreen } from '@/components/ui/SafeScreen';
import useApp from '@/hooks/useApp';

export default function RegisterScreen() {
  const { login } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Le prénom est requis';
    if (!email.includes('@')) e.email = 'Email invalide';
    if (password.length < 6) e.password = 'Au moins 6 caractères';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;
    setLoading(true);
    
    try {
      await register({ email, password: password, name });
      router.replace('/(onboarding)/goal');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Échec de l\'inscription';
      setErrors(prev => ({ ...prev, form: errorMessage }));
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
        <Text style={styles.title} accessibilityRole="header">Créer un compte</Text>
        <Text style={styles.sub}>Rejoins des milliers d{"'"}utilisateurs qui transforment leur santé.</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Prénom"
          value={name}
          onChangeText={setName}
          placeholder="Alex"
          error={errors.name}
          autoCapitalize="words"
          returnKeyType="next"
          accessibilityLabel="Votre prénom"
        />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="alex@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          returnKeyType="next"
          accessibilityLabel="Votre adresse email"
        />
        <Input
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          error={errors.password}
          hint="Au moins 6 caractères"
          returnKeyType="done"
          accessibilityLabel="Votre mot de passe"
        />
      </View>
      {errors.form && <Text style={styles.error} accessibilityRole="alert">{errors.form}</Text>}

      <Button
        label="Créer mon compte"
        variant="acid"
        size="lg"
        fullWidth
        loading={loading}
        onPress={handleRegister}
        style={styles.cta}
        accessibilityLabel="Créer mon compte et continuer"
      />

      <View style={styles.loginRow}>
        <Text style={styles.loginText}>Déjà un compte ? </Text>
        <TouchableOpacity
          onPress={() => router.replace('/(auth)/login')}
          accessibilityRole="link"
          accessibilityLabel="Aller à la page de connexion"
        >
          <Text style={styles.loginLink}>Se connecter</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.legal}>
        En créant un compte, vous acceptez nos Conditions d{"'"}utilisation et notre Politique de confidentialité.
      </Text>
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
  cta: { marginBottom: Spacing.md },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: Spacing.xl },
  loginText: { fontSize: 14, color: Colors.gray600 },
  loginLink: { fontSize: 14, fontWeight: '600', color: Colors.onyx, textDecorationLine: 'underline' },
  legal: { fontSize: 11, color: Colors.gray400, textAlign: 'center', lineHeight: 16 },
  error: { fontSize: 13, color: Colors.coral, marginBottom: Spacing.sm },
});
