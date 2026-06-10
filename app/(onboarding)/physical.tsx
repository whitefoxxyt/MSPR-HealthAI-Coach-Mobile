import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { OnboardingShell } from '@/components/ui/OnboardingShell';
import { Input } from '@/components/ui/Input';
import useApp from '@/hooks/useApp';
import type { Gender } from '@/types';

const GENDERS: { id: Gender; label: string }[] = [
  { id: 'male', label: 'Homme' },
  { id: 'female', label: 'Femme' },
  { id: 'other', label: 'Autre' },
];

export default function PhysicalScreen() {
  const { updateProfile, profile } = useApp();
  const [age, setAge] = useState(String(profile.age || 28));
  const [height, setHeight] = useState(String(profile.height || 175));
  const [weight, setWeight] = useState(String(profile.weight || 75));
  const [gender, setGender] = useState<Gender>(profile.gender || 'male');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!age || isNaN(Number(age)) || Number(age) < 10 || Number(age) > 100) e.age = 'Âge invalide (10–100)';
    if (!height || isNaN(Number(height)) || Number(height) < 100 || Number(height) > 250) e.height = 'Taille invalide (100–250 cm)';
    if (!weight || isNaN(Number(weight)) || Number(weight) < 20 || Number(weight) > 300) e.weight = 'Poids invalide (20–300 kg)';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (!validate()) return;
    updateProfile({ age: Number(age), height: Number(height), weight: Number(weight), gender });
    router.push('/(onboarding)/activity');
  }

  const isValid = age && height && weight && !isNaN(Number(age)) && !isNaN(Number(height)) && !isNaN(Number(weight));

  return (
    <OnboardingShell
      step={2}
      totalSteps={5}
      title="Ton profil physique"
      subtitle="Ces données nous permettent de calculer tes besoins caloriques et nutritionnels."
      onNext={handleNext}
      canContinue={!!isValid}
    >
      <View style={styles.genderRow}>
        {GENDERS.map(g => (
          <TouchableOpacity
            key={g.id}
            style={[styles.genderBtn, gender === g.id && styles.genderSelected]}
            onPress={() => setGender(g.id)}
            accessibilityRole="radio"
            accessibilityLabel={g.label}
            accessibilityState={{ selected: gender === g.id }}
          >
            <Text style={[styles.genderText, gender === g.id && styles.genderTextSelected]}>
              {g.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Input
        label="Âge"
        value={age}
        onChangeText={setAge}
        placeholder="28"
        keyboardType="number-pad"
        error={errors.age}
        hint="En années"
        accessibilityLabel="Votre âge en années"
      />
      <Input
        label="Taille (cm)"
        value={height}
        onChangeText={setHeight}
        placeholder="175"
        keyboardType="number-pad"
        error={errors.height}
        accessibilityLabel="Votre taille en centimètres"
      />
      <Input
        label="Poids (kg)"
        value={weight}
        onChangeText={setWeight}
        placeholder="70"
        keyboardType="decimal-pad"
        error={errors.weight}
        accessibilityLabel="Votre poids en kilogrammes"
      />

      <View style={styles.imt}>
        {isValid && (
          <>
            <Text style={styles.imtLabel}>IMC estimé</Text>
            <Text style={styles.imtValue}>
              {(Number(weight) / Math.pow(Number(height) / 100, 2)).toFixed(1)}
            </Text>
          </>
        )}
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  genderRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  genderBtn: {
    flex: 1,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderSelected: { backgroundColor: Colors.onyx, borderColor: Colors.onyx },
  genderText: { fontSize: 14, fontWeight: '500', color: Colors.onyx },
  genderTextSelected: { color: Colors.acid },
  imt: { alignItems: 'center', paddingVertical: Spacing.md },
  imtLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 2, color: Colors.gray400, textTransform: 'uppercase' },
  imtValue: { fontSize: 36, fontWeight: '700', color: Colors.onyx, letterSpacing: -1 },
});
