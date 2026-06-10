import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

type BadgeVariant = 'acid' | 'onyx' | 'coral' | 'sky' | 'mint' | 'neutral' | 'success' | 'warning';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

const BG: Record<BadgeVariant, string> = {
  acid: Colors.acid,
  onyx: Colors.onyx,
  coral: Colors.coralLight,
  sky: Colors.skyLight,
  mint: Colors.mintLight,
  neutral: Colors.surface2,
  success: Colors.successLight,
  warning: Colors.warningLight,
};

const FG: Record<BadgeVariant, string> = {
  acid: Colors.onyx,
  onyx: Colors.acid,
  coral: Colors.coral,
  sky: Colors.sky,
  mint: Colors.mint,
  neutral: Colors.textSecondary,
  success: Colors.success,
  warning: Colors.warning,
};

export function Badge({ label, variant = 'neutral', style }: BadgeProps) {
  return (
    <View
      style={[styles.badge, { backgroundColor: BG[variant] }, style]}
      accessibilityLabel={label}
    >
      <Text style={[styles.text, { color: FG[variant] }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 11, fontWeight: '600', letterSpacing: 0.3 },
});
