import React, { ReactNode } from 'react';
import { StyleSheet, ScrollView, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';

interface SafeScreenProps {
  children: ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  backgroundColor?: string;
}

export function SafeScreen({
  children,
  scrollable = true,
  style,
  contentStyle,
  backgroundColor = Colors.background,
}: SafeScreenProps) {
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }, style]} edges={['top', 'left', 'right']}>
      {scrollable ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: Spacing.md, paddingBottom: Spacing.xl },
});
