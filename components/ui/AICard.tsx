import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

interface AICardProps {
  title?: string;
  body: string;
  variant?: 'coach' | 'analysis';
  style?: ViewStyle;
}

export function AICard({ title, body, variant = 'coach', style }: AICardProps) {
  const isAnalysis = variant === 'analysis';

  return (
    <View
      style={[styles.card, isAnalysis ? styles.cardAnalysis : styles.cardCoach, style]}
      accessibilityRole="text"
      accessibilityLabel={`${title ?? (isAnalysis ? 'Analyse' : 'Conseil IA')}: ${body}`}
    >
      <View style={[styles.iconWrap, isAnalysis ? styles.iconWrapAnalysis : styles.iconWrapCoach]}>
        <Text style={styles.iconText}>{isAnalysis ? '✦' : '◆'}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.label, isAnalysis ? styles.labelAnalysis : styles.labelCoach]}>
          {title ?? (isAnalysis ? 'Analyse nutritionnelle' : 'Conseil de ton coach')}
        </Text>
        <Text style={styles.body}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
  },
  cardCoach: {
    backgroundColor: Colors.acidLight,
    borderColor: Colors.acid,
  },
  cardAnalysis: {
    backgroundColor: Colors.skyLight,
    borderColor: Colors.sky,
  },
  iconWrap: {
    width: 36, height: 36,
    borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  iconWrapCoach: { backgroundColor: Colors.acidDark },
  iconWrapAnalysis: { backgroundColor: Colors.sky },
  iconText: { fontSize: 16, color: Colors.white },
  content: { flex: 1 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  labelCoach: { color: Colors.acidDark },
  labelAnalysis: { color: Colors.sky },
  body: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.text,
  },
});
