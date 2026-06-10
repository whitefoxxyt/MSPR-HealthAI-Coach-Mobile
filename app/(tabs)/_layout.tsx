import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TABS = [
  { name: 'index', label: 'Accueil', icon: '⌂' },
  { name: 'nutrition', label: 'Nutrition', icon: '◎' },
  { name: 'scan', label: 'Scanner', icon: '+', isFab: true },
  { name: 'sport', label: 'Sport', icon: '◈' },
  { name: 'profile', label: 'Profil', icon: '◉' },
];

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const tab = TABS[index];
          const isFocused = state.index === index;

          function onPress() {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          }

          if (tab?.isFab) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.fabWrap}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Scanner un repas"
                accessibilityState={{ selected: isFocused }}
              >
                <View style={[styles.fab, isFocused && styles.fabActive]}>
                  <Text style={styles.fabIcon}>+</Text>
                </View>
                <Text style={[styles.navLabel, isFocused && styles.navLabelActive]}>Scanner</Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[styles.navItem, isFocused && styles.navItemActive]}
              activeOpacity={0.8}
              accessibilityRole="tab"
              accessibilityLabel={tab?.label}
              accessibilityState={{ selected: isFocused }}
            >
              <Text style={[styles.navIcon, isFocused && styles.navIconActive]}>{tab?.icon}</Text>
              <Text style={[styles.navLabel, isFocused && styles.navLabelActive]}>{tab?.label}</Text>
              {isFocused && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="nutrition" />
      <Tabs.Screen name="scan" />
      <Tabs.Screen name="sport" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 24 : Spacing.md,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.cream,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.onyx,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 8,
    gap: 4,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
  },
  navItemActive: { backgroundColor: 'rgba(200,255,71,0.12)' },
  navIcon: { fontSize: 20, color: Colors.gray400 },
  navIconActive: { color: Colors.acid },
  navLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Colors.gray400,
  },
  navLabelActive: { color: Colors.acid },
  activeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.acid },
  fabWrap: { flex: 1, alignItems: 'center', gap: 3 },
  fab: {
    width: 48, height: 48,
    borderRadius: 24,
    backgroundColor: Colors.acid,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
    shadowColor: Colors.acid,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  fabActive: { backgroundColor: Colors.acidDark },
  fabIcon: { fontSize: 24, fontWeight: '300', color: Colors.onyx },
});
