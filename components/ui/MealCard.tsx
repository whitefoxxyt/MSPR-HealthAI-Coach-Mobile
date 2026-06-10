import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing, Shadows } from '@/constants/theme';
import type { MealAnalysis } from '@/types';

interface MealCardProps {
  meal: MealAnalysis;
  onPress?: () => void;
  style?: ViewStyle;
}

const MEAL_EMOJIS: Record<string, string> = {
  'Bol': '🥗',
  'Oeufs': '🍳',
  'Saumon': '🐟',
  'Poulet': '🍗',
  'Porridge': '🥣',
  'Salade': '🥗',
  default: '🍽️',
};

function getScoreColor(score: number): string {
  if (score >= 85) return Colors.success;
  if (score >= 65) return Colors.warning;
  return Colors.coral;
}

function getMealEmoji(name: string): string {
  for (const [key, emoji] of Object.entries(MEAL_EMOJIS)) {
    if (name.includes(key)) return emoji;
  }
  return MEAL_EMOJIS.default;
}

export function MealCard({ meal, onPress, style }: MealCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`${meal.name}, ${meal.calories} kilocalories`}
    >
      <View style={styles.iconWrap}>
        <Text style={styles.emoji}>{getMealEmoji(meal.name)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{meal.name}</Text>
        <View style={styles.macroRow}>
          <Text style={styles.macroItem}>
            <Text style={[styles.macroVal, { color: Colors.sky }]}>{meal.macros.protein}g</Text>
            {' '}prot
          </Text>
          <Text style={styles.sep}>·</Text>
          <Text style={styles.macroItem}>
            <Text style={[styles.macroVal, { color: Colors.acidDark }]}>{meal.macros.carbs}g</Text>
            {' '}gluc
          </Text>
          <Text style={styles.sep}>·</Text>
          <Text style={styles.macroItem}>
            <Text style={[styles.macroVal, { color: Colors.coral }]}>{meal.macros.fat}g</Text>
            {' '}lip
          </Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.cal}>{meal.calories}</Text>
        <Text style={styles.calUnit}>kcal</Text>
        {meal.score && (
          <View style={[styles.score, { backgroundColor: getScoreColor(meal.score) + '20' }]}>
            <Text style={[styles.scoreText, { color: getScoreColor(meal.score) }]}>{meal.score}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.xs,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  iconWrap: {
    width: 48, height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface2,
    alignItems: 'center', justifyContent: 'center',
  },
  emoji: { fontSize: 22 },
  info: { flex: 1, gap: 5 },
  name: { fontSize: 14, fontWeight: '600', color: Colors.text },
  macroRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  macroItem: { fontSize: 12, color: Colors.textSecondary },
  macroVal: { fontWeight: '600' },
  sep: { fontSize: 12, color: Colors.gray400 },
  right: { alignItems: 'flex-end', gap: 2 },
  cal: { fontSize: 18, fontWeight: '700', color: Colors.text, letterSpacing: -0.5 },
  calUnit: { fontSize: 11, color: Colors.textTertiary },
  score: {
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 3,
  },
  scoreText: { fontSize: 11, fontWeight: '700' },
});
