import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
  style?: StyleProp<TextStyle>;
}

export function Input({ label, error, hint, containerStyle, style, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label} accessibilityRole="text">
          {label}
        </Text>
      )}
      <TextInput
        style={[styles.input, focused && styles.inputFocused, error && styles.inputError, style]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor={Colors.gray400}
        accessibilityLabel={label}
        accessibilityHint={hint}
        {...props}
      />
      {error && (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      )}
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.xs },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray600,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    fontSize: 15,
    backgroundColor: Colors.white,
    color: Colors.onyx,
  },
  inputFocused: { borderColor: Colors.onyx },
  inputError: { borderColor: Colors.coral },
  error: { fontSize: 12, color: Colors.coral },
  hint: { fontSize: 12, color: Colors.gray400 },
});
