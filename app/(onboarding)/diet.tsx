import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { OnboardingShell } from '@/components/ui/OnboardingShell';
import { Chip } from '@/components/ui/Chip';
import useApp from '@/hooks/useApp';
import { DIET_OPTIONS, ALLERGY_OPTIONS } from '@/constants/mockData';
import type { DietType } from '@/types';

export default function DietScreen() {
  const { updateProfile } = useApp();
  const [diet, setDiet] = useState<DietType>('omnivore');
  const [allergies, setAllergies] = useState<string[]>([]);

  function toggleAllergy(a: string) {
    setAllergies(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  }

  function handleNext() {
    updateProfile({ dietType: diet, allergies });
    router.push('/(onboarding)/sport-prefs');
  }

  return (
    <OnboardingShell
      step={4}
      totalSteps={5}
      title="Tes préférences alimentaires"
      subtitle="On s'adapte à ton régime, tes intolérances et ton mode de vie."
      onNext={handleNext}
    >
      <View>
        <Text style={styles.sectionTitle}>Type de régime</Text>
        <View style={styles.chips}>
          {DIET_OPTIONS.map(opt => (
            <Chip
              key={opt.id}
              label={opt.label}
              selected={diet === opt.id}
              onPress={() => setDiet(opt.id as DietType)}
              accessibilityLabel={`Régime ${opt.label}`}
            />
          ))}
        </View>
      </View>

      <View>
        <Text style={styles.sectionTitle}>Allergies & intolérances</Text>
        <Text style={styles.hint}>Sélectionne tout ce qui s{"'"}applique à toi</Text>
        <View style={styles.chips}>
          {ALLERGY_OPTIONS.map(a => (
            <Chip
              key={a}
              label={a}
              selected={allergies.includes(a)}
              onPress={() => toggleAllergy(a)}
              accessibilityLabel={`Intolérance ${a}`}
            />
          ))}
        </View>
      </View>

      {allergies.length > 0 && (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {allergies.length} intolérance(s) sélectionnée(s) — tes plans seront adaptés automatiquement.
          </Text>
        </View>
      )}
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 15, fontWeight: '600', color: Colors.onyx, marginBottom: Spacing.sm },
  hint: { fontSize: 13, color: Colors.gray400, marginBottom: Spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  summary: {
    backgroundColor: Colors.cream2,
    borderRadius: 12,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.acid,
  },
  summaryText: { fontSize: 13, color: Colors.gray600, lineHeight: 20 },
});
