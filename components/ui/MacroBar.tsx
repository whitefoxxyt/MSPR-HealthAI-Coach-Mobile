import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

interface MacroBarProps {
  label: string;
  current: number;
  target: number;
  unit?: string;
  color: string;
}

export function MacroBar({ label, current, target, unit = 'g', color }: MacroBarProps) {
  const progress = Math.min(current / (target || 1), 1);
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: progress,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [progress, animValue]);

  const width = animValue.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const pct = Math.round(progress * 100);

  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: target, now: current }}
      accessibilityLabel={`${label}: ${current}${unit} sur ${target}${unit} (${pct}%)`}
    >
      <View style={styles.header}>
        <View style={styles.labelRow}>
          <View style={[styles.dot, { backgroundColor: color }]} />
          <Text style={styles.name}>{label}</Text>
        </View>
        <Text style={styles.value}>
          {current}
          <Text style={styles.target}> / {target}{unit}</Text>
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 7, marginBottom: Spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  name: { fontSize: 13, fontWeight: '500', color: Colors.text },
  value: { fontSize: 13, fontWeight: '600', color: Colors.text },
  target: { fontWeight: '400', color: Colors.textSecondary },
  track: { height: 7, backgroundColor: Colors.gray200, borderRadius: Radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: Radius.pill },
});
