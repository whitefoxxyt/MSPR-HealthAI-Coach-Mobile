import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing, Shadows } from '@/constants/theme';
import type { Workout } from '@/types';

const CATEGORY_COLORS: Record<string, string> = {
  Cardio: Colors.coral,
  Force: Colors.sky,
  Récupération: Colors.mint,
};

interface WorkoutCardProps {
  workout: Workout;
  onPress?: () => void;
  compact?: boolean;
  variant?: 'light' | 'dark';
  style?: ViewStyle;
}

export function WorkoutCard({ workout, onPress, compact = false, variant = 'dark', style }: WorkoutCardProps) {
  const accentColor = CATEGORY_COLORS[workout.category] ?? Colors.acid;
  const isDark = variant === 'dark';

  return (
    <TouchableOpacity
      style={[isDark ? styles.cardDark : styles.cardLight, compact && styles.cardCompact, style]}
      onPress={onPress}
      activeOpacity={0.88}
      accessibilityRole="button"
      accessibilityLabel={`${workout.title}, ${workout.durationMinutes} minutes, ${workout.caloriesBurned} calories brûlées`}
    >
      <View style={[styles.categoryStripe, { backgroundColor: accentColor }]} />

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View>
            <Text style={[styles.category, { color: isDark ? accentColor : accentColor }]}>
              {workout.category}
            </Text>
            <Text style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}>
              {workout.title}
            </Text>
          </View>
          {workout.completed && (
            <View style={styles.doneTag}>
              <Text style={styles.doneTagText}>Complété</Text>
            </View>
          )}
        </View>

        {!compact && (
          <Text style={[styles.level, isDark ? styles.levelDark : styles.levelLight]}>
            {workout.level} · {workout.exercises.length} exercices
          </Text>
        )}

        <View style={styles.statsRow}>
          <View style={styles.stat} accessible accessibilityLabel={`${workout.durationMinutes} minutes`}>
            <Text style={[styles.statVal, isDark ? styles.statValDark : styles.statValLight]}>
              {workout.durationMinutes}
            </Text>
            <Text style={[styles.statLabel, isDark ? styles.statLabelDark : styles.statLabelLight]}>min</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : Colors.gray200 }]} />
          <View style={styles.stat} accessible accessibilityLabel={`${workout.caloriesBurned} calories`}>
            <Text style={[styles.statVal, isDark ? styles.statValDark : styles.statValLight]}>
              {workout.caloriesBurned}
            </Text>
            <Text style={[styles.statLabel, isDark ? styles.statLabelDark : styles.statLabelLight]}>kcal</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : Colors.gray200 }]} />
          <View style={styles.stat} accessible accessibilityLabel={`${workout.exercises.length} exercices`}>
            <Text style={[styles.statVal, isDark ? styles.statValDark : styles.statValLight]}>
              {workout.exercises.length}
            </Text>
            <Text style={[styles.statLabel, isDark ? styles.statLabelDark : styles.statLabelLight]}>exos</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardDark: {
    backgroundColor: Colors.onyx,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardLight: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    ...Shadows.sm,
  },
  cardCompact: {},
  categoryStripe: { width: 4 },
  body: { flex: 1, padding: Spacing.md, gap: Spacing.sm },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  category: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, marginBottom: 3 },
  title: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  titleDark: { color: Colors.white },
  titleLight: { color: Colors.text },
  level: { fontSize: 13 },
  levelDark: { color: Colors.gray400 },
  levelLight: { color: Colors.textSecondary },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginTop: Spacing.xs },
  stat: { alignItems: 'center', flexDirection: 'row', gap: 4 },
  statDivider: { width: 1, height: 14 },
  statVal: { fontSize: 16, fontWeight: '700' },
  statValDark: { color: Colors.white },
  statValLight: { color: Colors.text },
  statLabel: { fontSize: 12 },
  statLabelDark: { color: Colors.gray400 },
  statLabelLight: { color: Colors.textSecondary },
  doneTag: {
    backgroundColor: Colors.acidLight,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  doneTagText: { fontSize: 11, fontWeight: '600', color: Colors.acidDark },
});
