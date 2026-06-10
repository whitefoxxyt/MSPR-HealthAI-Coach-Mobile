import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing, Radius, Shadows } from '@/constants/theme';
import { OnboardingShell } from '@/components/ui/OnboardingShell';
import useApp from '@/hooks/useApp';
import { GOAL_OPTIONS } from '@/constants/mockData';
import type { Goal } from '@/types';

export default function GoalScreen() {
  const { updateProfile } = useApp();
  const [selected, setSelected] = useState<Goal | null>(null);

  function handleNext() {
    if (!selected) return;
    updateProfile({ goal: selected });
    router.push('/(onboarding)/physical');
  }

  return (
    <OnboardingShell
      step={1}
      totalSteps={5}
      title="Quel est ton objectif principal ?"
      subtitle="On va personnaliser ton expérience en fonction de tes ambitions."
      onNext={handleNext}
      canContinue={!!selected}
    >
      {GOAL_OPTIONS.map(opt => (
        <TouchableOpacity
          key={opt.id}
          style={[styles.option, selected === opt.id && styles.optionSelected]}
          onPress={() => setSelected(opt.id as Goal)}
          activeOpacity={0.8}
          accessibilityRole="radio"
          accessibilityLabel={`${opt.label}: ${opt.description}`}
          accessibilityState={{ selected: selected === opt.id }}
        >
          <View style={[styles.icon, selected === opt.id && styles.iconSelected]}>
            <Text style={styles.iconText}>{opt.icon}</Text>
          </View>
          <View style={styles.optionText}>
            <Text style={[styles.optionLabel, selected === opt.id && styles.optionLabelSelected]}>
              {opt.label}
            </Text>
            <Text style={styles.optionDesc}>{opt.description}</Text>
          </View>
          <View style={[styles.radio, selected === opt.id && styles.radioSelected]} />
        </TouchableOpacity>
      ))}
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.gray100,
    ...Shadows.sm,
  },
  optionSelected: {
    borderColor: Colors.onyx,
    backgroundColor: Colors.cream,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconSelected: { backgroundColor: Colors.acid },
  iconText: { fontSize: 20 },
  optionText: { flex: 1 },
  optionLabel: { fontSize: 15, fontWeight: '600', color: Colors.onyx },
  optionLabelSelected: { color: Colors.onyx },
  optionDesc: { fontSize: 12, color: Colors.gray400, marginTop: 2 },
  radio: {
    width: 18, height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.gray200,
    flexShrink: 0,
  },
  radioSelected: {
    backgroundColor: Colors.acid,
    borderColor: Colors.onyx,
  },
});
