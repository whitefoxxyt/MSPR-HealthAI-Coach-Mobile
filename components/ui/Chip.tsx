import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}

export function Chip({ label, selected = false, onPress, accessibilityLabel }: ChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.selected]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ selected }}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    backgroundColor: Colors.white,
  },
  selected: {
    backgroundColor: Colors.onyx,
    borderColor: Colors.onyx,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.onyx,
  },
  selectedLabel: {
    color: Colors.acid,
  },
});
