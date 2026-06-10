import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing, Radius, Shadows } from '@/constants/theme';
import { OnboardingShell } from '@/components/ui/OnboardingShell';
import useApp from '@/hooks/useApp';
import { ACTIVITY_OPTIONS } from '@/constants/mockData';
import type { ActivityLevel } from '@/types';

export default function ActivityScreen() {
  const { updateProfile } = useApp();
  const [selected, setSelected] = useState<ActivityLevel | null>(null);

  function handleNext() {
    if (!selected) return;
    updateProfile({ activityLevel: selected });
    router.push('/(onboarding)/diet');
  }

  return (
    <OnboardingShell
      step={3}
      totalSteps={5}
      title="Ton niveau d'activité"
      subtitle="Honnêteté totale : ça définit ton métabolisme de base et tes dépenses caloriques."
      onNext={handleNext}
      canContinue={!!selected}
    >
      {ACTIVITY_OPTIONS.map(opt => (
        <TouchableOpacity
          key={opt.id}
          style={[styles.option, selected === opt.id && styles.optionSelected]}
          onPress={() => setSelected(opt.id as ActivityLevel)}
          activeOpacity={0.8}
          accessibilityRole="radio"
          accessibilityLabel={`${opt.label}: ${opt.description}`}
          accessibilityState={{ selected: selected === opt.id }}
        >
          <View style={[styles.icon, selected === opt.id && styles.iconSelected]}>
            <Text style={styles.iconText}>{opt.icon}</Text>
          </View>
          <View style={styles.optionInfo}>
            <Text style={[styles.label, selected === opt.id && styles.labelSelected]}>{opt.label}</Text>
            <Text style={styles.desc}>{opt.description}</Text>
          </View>
          {selected === opt.id && <View style={styles.check}><Text style={styles.checkText}>✓</Text></View>}
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
  optionSelected: { borderColor: Colors.onyx, backgroundColor: Colors.cream },
  icon: {
    width: 44, height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSelected: { backgroundColor: Colors.acid },
  iconText: { fontSize: 20 },
  optionInfo: { flex: 1 },
  label: { fontSize: 15, fontWeight: '600', color: Colors.onyx },
  labelSelected: { color: Colors.onyx },
  desc: { fontSize: 12, color: Colors.gray400, marginTop: 2 },
  check: {
    width: 24, height: 24,
    borderRadius: 12,
    backgroundColor: Colors.acid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { fontSize: 12, fontWeight: '700', color: Colors.onyx },
});
