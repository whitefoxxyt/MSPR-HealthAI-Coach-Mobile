import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors, Spacing } from '@/constants/theme';
import { Button } from '@/components/ui/Button';

export default function WelcomeScreen() {
  return (
    <View style={styles.container} accessibilityRole="none">
      <StatusBar style="light" />

      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <View style={styles.header}>
        <Text style={styles.logo} accessibilityRole="header">
          VIT<Text style={styles.logoAccent}>Á</Text>L
        </Text>
        <Text style={styles.tagline}>Coach IA · Nutrition · Performance</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroText}>Votre corps.</Text>
        <Text style={[styles.heroText, styles.heroAccent]}>Votre data.</Text>
        <Text style={styles.heroSub}>
          Un accompagnement santé personnalisé fondé sur l{"'"}IA — nutrition, sport et progression au quotidien.
        </Text>
      </View>

      <View style={styles.features}>
        {[
          { icon: '🥗', label: 'Analyse nutritionnelle par IA' },
          { icon: '⚡', label: 'Plans d\'entraînement adaptés' },
          { icon: '📈', label: 'Suivi de progression visuel' },
        ].map(f => (
          <View key={f.label} style={styles.feature}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <Text style={styles.featureLabel}>{f.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Button
          label="Commencer gratuitement"
          variant="acid"
          size="lg"
          fullWidth
          onPress={() => router.push('/(auth)/register')}
          accessibilityLabel="Commencer l'inscription gratuite"
        />
        <Button
          label="J'ai déjà un compte"
          variant="outline"
          size="lg"
          fullWidth
          onPress={() => router.push('/(auth)/login')}
          accessibilityLabel="Se connecter à mon compte existant"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.onyx,
    padding: Spacing.lg,
    paddingTop: 60,
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute',
    top: -60, right: -60,
    width: 260, height: 260,
    borderRadius: 130,
    backgroundColor: Colors.acid,
    opacity: 0.08,
  },
  blob2: {
    position: 'absolute',
    bottom: 100, left: -80,
    width: 200, height: 200,
    borderRadius: 100,
    backgroundColor: Colors.mint,
    opacity: 0.06,
  },
  header: { marginBottom: Spacing.xl },
  logo: {
    fontSize: 52,
    fontWeight: '700',
    letterSpacing: -2,
    color: Colors.cream,
    lineHeight: 52,
  },
  logoAccent: { color: Colors.acid },
  tagline: {
    fontSize: 13,
    color: Colors.gray400,
    letterSpacing: 1,
    marginTop: Spacing.xs,
  },
  hero: { marginBottom: Spacing.xl },
  heroText: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.cream,
    letterSpacing: -1.5,
    lineHeight: 52,
  },
  heroAccent: { color: Colors.acid },
  heroSub: {
    fontSize: 16,
    color: Colors.gray400,
    lineHeight: 26,
    marginTop: Spacing.md,
    maxWidth: 300,
  },
  features: { gap: Spacing.md, marginBottom: Spacing.xl },
  feature: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  featureIcon: { fontSize: 20, width: 32 },
  featureLabel: { fontSize: 15, color: Colors.gray200 },
  actions: { gap: Spacing.md, marginTop: 'auto' },
});
