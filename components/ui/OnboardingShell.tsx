import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeScreen } from './SafeScreen';
import { Button } from './Button';
import { Colors, Spacing } from '@/constants/theme';

interface OnboardingShellProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onNext: () => void;
  nextLabel?: string;
  loading?: boolean;
  canContinue?: boolean;
}

export function OnboardingShell({
  step,
  totalSteps,
  title,
  subtitle,
  children,
  onNext,
  nextLabel = 'Continuer',
  loading = false,
  canContinue = true,
}: OnboardingShellProps) {
  return (
    <SafeScreen backgroundColor={Colors.cream} scrollable>
      {step > 1 && (
        <TouchableOpacity
          style={styles.back}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Étape précédente"
        >
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
      )}

      <View style={styles.steps} accessibilityRole="progressbar" accessibilityValue={{ min: 1, max: totalSteps, now: step }}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <View key={i} style={[styles.stepDot, i + 1 === step && styles.stepActive, i + 1 < step && styles.stepDone]} />
        ))}
      </View>

      <View style={styles.header}>
        <Text style={styles.stepLabel}>{step} / {totalSteps}</Text>
        <Text style={styles.title} accessibilityRole="header">{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <View style={styles.content}>{children}</View>

      <Button
        label={nextLabel}
        variant="acid"
        size="lg"
        fullWidth
        onPress={onNext}
        loading={loading}
        disabled={!canContinue}
        style={styles.cta}
        accessibilityLabel={nextLabel}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  back: { marginBottom: Spacing.sm },
  backText: { fontSize: 15, color: Colors.gray600 },
  steps: { flexDirection: 'row', gap: Spacing.xs, marginBottom: Spacing.lg },
  stepDot: { height: 6, flex: 1, borderRadius: 3, backgroundColor: Colors.gray200 },
  stepActive: { backgroundColor: Colors.onyx, flex: 2.5 },
  stepDone: { backgroundColor: Colors.acid },
  header: { marginBottom: Spacing.xl },
  stepLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 2, color: Colors.gray400, textTransform: 'uppercase', marginBottom: Spacing.xs },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5, color: Colors.onyx, lineHeight: 34 },
  subtitle: { fontSize: 15, color: Colors.gray600, marginTop: Spacing.sm, lineHeight: 22 },
  content: { gap: Spacing.sm, marginBottom: Spacing.xl },
  cta: { marginTop: 'auto' as any },
});
