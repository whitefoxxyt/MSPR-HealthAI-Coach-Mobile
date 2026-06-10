import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing, Shadows } from '@/constants/theme';

type Variant = 'light' | 'dark';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  change?: string;
  changePositive?: boolean;
  variant?: Variant;
  accentColor?: string;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  subtitle,
  change,
  changePositive,
  variant = 'light',
  accentColor = Colors.acid,
  style,
  accessibilityLabel,
}: MetricCardProps) {
  const isDark = variant === 'dark';

  return (
    <View
      style={[styles.card, isDark ? styles.cardDark : styles.cardLight, style]}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? `${label}: ${value}${unit ?? ''}`}
    >
      <View style={[styles.accent, { backgroundColor: isDark ? 'rgba(200,255,71,0.12)' : accentColor + '20' }]} />
      <Text style={[styles.label, isDark ? styles.labelDark : styles.labelLight]}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, isDark ? styles.valueDark : styles.valueLight]}>{value}</Text>
        {unit && (
          <Text style={[styles.unit, isDark ? styles.unitDark : styles.unitLight]}>{unit}</Text>
        )}
      </View>
      {subtitle && (
        <Text style={[styles.subtitle, isDark ? styles.subtitleDark : styles.subtitleLight]}>
          {subtitle}
        </Text>
      )}
      {change && (
        <Text style={[styles.change, changePositive === false ? styles.changeNeg : styles.changePos]}>
          {change}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    overflow: 'hidden',
  },
  cardLight: {
    backgroundColor: Colors.surface,
    ...Shadows.sm,
  },
  cardDark: {
    backgroundColor: Colors.onyx,
  },
  accent: {
    position: 'absolute',
    top: -20, right: -20,
    width: 80, height: 80,
    borderRadius: 40,
  },
  label: { fontSize: 12, fontWeight: '500', marginBottom: Spacing.xs },
  labelLight: { color: Colors.textSecondary },
  labelDark: { color: Colors.gray400 },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 3 },
  value: { fontSize: 32, fontWeight: '700', letterSpacing: -1.5, lineHeight: 38 },
  valueLight: { color: Colors.text },
  valueDark: { color: Colors.white },
  unit: { fontSize: 14, fontWeight: '500' },
  unitLight: { color: Colors.textSecondary },
  unitDark: { color: Colors.gray400 },
  subtitle: { fontSize: 11, marginTop: 2 },
  subtitleLight: { color: Colors.textTertiary },
  subtitleDark: { color: Colors.gray400 },
  change: { fontSize: 12, fontWeight: '600', marginTop: Spacing.xs },
  changePos: { color: Colors.success },
  changeNeg: { color: Colors.coral },
});
