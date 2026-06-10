import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius, Shadows } from '@/constants/theme';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { WorkoutCard } from '@/components/ui/WorkoutCard';
import { AICard } from '@/components/ui/AICard';
import { MOCK_WORKOUTS, WEEKLY_PLAN, AI_SUGGESTIONS } from '@/constants/mockData';
import useApp from '@/hooks/useApp';

type Filter = 'all' | 'Force' | 'Cardio' | 'Récupération';

export default function SportScreen() {
  const { profile } = useApp();
  const [filter, setFilter] = useState<Filter>('all');
  const FILTERS: Filter[] = ['all', 'Force', 'Cardio', 'Récupération'];

  const filtered = filter === 'all'
    ? MOCK_WORKOUTS
    : MOCK_WORKOUTS.filter(w => w.category === filter);

  const weekDone = WEEKLY_PLAN.filter(d => d.done).length;
  const totalKcal = WEEKLY_PLAN
    .filter(d => d.done && d.workout)
    .reduce((acc, d) => acc + (d.workout?.caloriesBurned ?? 0), 0);

  return (
    <SafeScreen>
      <Text style={styles.title} accessibilityRole="header">Sport</Text>

      {/* Stats semaine */}
      <View style={styles.statsRow}>
        <View style={styles.statCard} accessible accessibilityLabel={`${weekDone} séances complétées cette semaine`}>
          <Text style={styles.statValue}>{weekDone}</Text>
          <Text style={styles.statLabel}>Séances{'\n'}complétées</Text>
        </View>
        <View style={styles.statCard} accessible accessibilityLabel={`${totalKcal} calories brûlées cette semaine`}>
          <Text style={styles.statValue}>{totalKcal}</Text>
          <Text style={styles.statLabel}>Kcal{'\n'}brûlées</Text>
        </View>
        <View style={styles.statCard} accessible accessibilityLabel={`Objectif ${profile.weeklyWorkoutDays} séances par semaine`}>
          <Text style={styles.statValue}>{profile.weeklyWorkoutDays}</Text>
          <Text style={styles.statLabel}>Objectif{'\n'}/ semaine</Text>
        </View>
      </View>

      {/* Planning semaine */}
      <Text style={styles.sectionTitle} accessibilityRole="header">Planning de la semaine</Text>
      <View style={styles.weekGrid}>
        {WEEKLY_PLAN.map((day, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.dayCard, day.done && styles.dayCardDone, !day.workout && styles.dayCardRest]}
            activeOpacity={0.8}
            accessible
            accessibilityRole="button"
            accessibilityLabel={`${day.day}: ${day.done ? 'complété' : day.workout ? day.workout.title : 'jour de repos'}`}
            accessibilityState={{ selected: day.done }}
          >
            <Text style={[styles.dayName, day.done && styles.dayNameDone]}>{day.day}</Text>
            {day.workout ? (
              <>
                <Text style={styles.dayWorkout} numberOfLines={1}>{day.workout.category}</Text>
                <Text style={styles.dayDuration}>{day.workout.durationMinutes}min</Text>
              </>
            ) : (
              <Text style={styles.dayRest}>Repos</Text>
            )}
            {day.done && (
              <View style={styles.doneCheck} accessibilityLabel="Complété">
                <Text style={styles.doneCheckText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* AI Card */}
      <AICard
        variant="coach"
        title="Recommandation IA"
        body={AI_SUGGESTIONS[2]}
        style={{ marginVertical: Spacing.md }}
      />

      {/* Filtres */}
      <Text style={styles.sectionTitle} accessibilityRole="header">Bibliothèque d{"'"}entraînements</Text>
      <View style={styles.filters} accessibilityRole="tablist">
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
            accessibilityRole="tab"
            accessibilityState={{ selected: filter === f }}
            accessibilityLabel={f === 'all' ? 'Tous les entraînements' : `Entraînements ${f}`}
          >
            <Text style={[styles.filterLabel, filter === f && styles.filterLabelActive]}>
              {f === 'all' ? 'Tous' : f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.map(workout => (
        <WorkoutCard key={workout.id} workout={workout} style={{ marginBottom: Spacing.sm }} />
      ))}

      <View style={{ height: Spacing.xl }} />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700', color: Colors.onyx, marginBottom: Spacing.lg, letterSpacing: -0.5 },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  statCard: {
    flex: 1,
    backgroundColor: Colors.onyx,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  statValue: { fontSize: 24, fontWeight: '700', color: Colors.acid, letterSpacing: -0.5 },
  statLabel: { fontSize: 10, color: Colors.gray400, textAlign: 'center', lineHeight: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.onyx, marginBottom: Spacing.sm, letterSpacing: -0.3 },
  weekGrid: { flexDirection: 'row', gap: 6, marginBottom: Spacing.sm },
  dayCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: 8,
    alignItems: 'center',
    gap: 3,
    borderWidth: 1.5,
    borderColor: Colors.gray100,
    ...Shadows.sm,
  },
  dayCardDone: { backgroundColor: Colors.onyx, borderColor: Colors.onyx },
  dayCardRest: { backgroundColor: Colors.cream2, borderColor: Colors.gray100 },
  dayName: { fontSize: 10, fontWeight: '700', color: Colors.gray400, textTransform: 'uppercase' },
  dayNameDone: { color: Colors.acid },
  dayWorkout: { fontSize: 9, color: Colors.gray400, textAlign: 'center' },
  dayDuration: { fontSize: 9, fontWeight: '600', color: Colors.gray400 },
  dayRest: { fontSize: 9, color: Colors.gray400 },
  doneCheck: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: Colors.acid,
    alignItems: 'center', justifyContent: 'center',
  },
  doneCheckText: { fontSize: 9, fontWeight: '700', color: Colors.onyx },
  filters: { flexDirection: 'row', gap: Spacing.xs, marginBottom: Spacing.md, flexWrap: 'wrap' },
  filterBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.xl,
    backgroundColor: Colors.gray100,
  },
  filterBtnActive: { backgroundColor: Colors.onyx },
  filterLabel: { fontSize: 13, fontWeight: '600', color: Colors.gray400 },
  filterLabelActive: { color: Colors.acid },
});
