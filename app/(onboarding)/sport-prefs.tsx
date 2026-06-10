import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { OnboardingShell } from '@/components/ui/OnboardingShell';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import useApp from '@/hooks/useApp';
import { SPORT_OPTIONS, EQUIPMENT_OPTIONS } from '@/constants/mockData';

export default function SportPrefsScreen() {
  const { updateProfile } = useApp();
  const [sports, setSports] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [days, setDays] = useState('3');
  const [duration, setDuration] = useState('45');
  const [limitations, setLimitations] = useState('');
  const [loading, setLoading] = useState(false);

  function toggle(arr: string[], setArr: (v: string[]) => void, item: string) {
    setArr(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]);
  }

  async function handleNext() {
    setLoading(true);
    updateProfile({
      sportsPreferences: sports,
      availableEquipment: equipment,
      weeklyWorkoutDays: Number(days) || 3,
      sessionDuration: Number(duration) || 45,
      physicalLimitations: limitations,
      onboardingCompleted: true,
    });
    await new Promise(r => setTimeout(r, 600));
    router.replace('/(tabs)');
  }

  return (
    <OnboardingShell
      step={5}
      totalSteps={5}
      title="Tes préférences sportives"
      subtitle="On construit ton programme sur mesure selon tes envies et contraintes."
      onNext={handleNext}
      nextLabel="Finaliser mon profil"
      loading={loading}
    >
      <View>
        <Text style={styles.sectionTitle}>Sports & activités appréciés</Text>
        <View style={styles.chips}>
          {SPORT_OPTIONS.map(s => (
            <Chip
              key={s}
              label={s}
              selected={sports.includes(s)}
              onPress={() => toggle(sports, setSports, s)}
              accessibilityLabel={`Activité ${s}`}
            />
          ))}
        </View>
      </View>

      <View>
        <Text style={styles.sectionTitle}>Équipement disponible</Text>
        <View style={styles.chips}>
          {EQUIPMENT_OPTIONS.map(e => (
            <Chip
              key={e}
              label={e}
              selected={equipment.includes(e)}
              onPress={() => toggle(equipment, setEquipment, e)}
              accessibilityLabel={`Équipement ${e}`}
            />
          ))}
        </View>
      </View>

      <View style={styles.row}>
        <Input
          label="Jours / semaine"
          value={days}
          onChangeText={setDays}
          keyboardType="number-pad"
          style={{ flex: 1 }}
          placeholder="3"
          accessibilityLabel="Nombre de jours d'entraînement par semaine"
        />
        <Input
          label="Durée (min)"
          value={duration}
          onChangeText={setDuration}
          keyboardType="number-pad"
          style={{ flex: 1 }}
          placeholder="45"
          accessibilityLabel="Durée de chaque séance en minutes"
        />
      </View>

      <Input
        label="Limitations physiques (optionnel)"
        value={limitations}
        onChangeText={setLimitations}
        placeholder="Ex: genou fragilisé, hernie discale..."
        multiline
        numberOfLines={2}
        accessibilityLabel="Vos limitations physiques ou contre-indications médicales"
        hint="Ces informations sont prises en compte pour éviter les exercices inappropriés"
      />
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 15, fontWeight: '600', color: Colors.onyx, marginBottom: Spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.sm },
  row: { flexDirection: 'row', gap: Spacing.md },
});
