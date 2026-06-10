import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

type Variant = 'primary' | 'acid' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
  accessibilityLabel?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  fullWidth = false,
  accessibilityLabel,
}: ButtonProps) {
  const containerStyle: ViewStyle[] = [
    styles.base,
    styles[variant],
    styles[`size_${size}` as keyof typeof styles] as ViewStyle,
    fullWidth && { width: '100%' as any },
    (disabled || loading) && styles.disabled,
    style as ViewStyle,
  ].filter(Boolean) as ViewStyle[];

  const textStyle: TextStyle[] = [
    styles.text,
    styles[`text_${variant}` as keyof typeof styles] as TextStyle,
    styles[`textSize_${size}` as keyof typeof styles] as TextStyle,
  ].filter(Boolean) as TextStyle[];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'acid' ? Colors.onyx : Colors.acid} size="small" />
      ) : (
        <Text style={textStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: Colors.onyx,
  },
  acid: {
    backgroundColor: Colors.acid,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.onyx,
  },
  ghost: {
    backgroundColor: Colors.gray100,
  },
  size_sm: { height: 36, paddingHorizontal: 16 },
  size_md: { height: 48 },
  size_lg: { height: 56, paddingHorizontal: 32 },
  disabled: { opacity: 0.4 },
  text: {
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  text_primary: { color: Colors.acid },
  text_acid: { color: Colors.onyx },
  text_outline: { color: Colors.onyx },
  text_ghost: { color: Colors.onyx },
  textSize_sm: { fontSize: 13 },
  textSize_md: { fontSize: 14 },
  textSize_lg: { fontSize: 16 },
});
