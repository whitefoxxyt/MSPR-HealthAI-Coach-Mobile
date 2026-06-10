import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing, Radius, Shadows } from '@/constants/theme';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LineChart } from '@/components/ui/LineChart';
import useApp from '@/hooks/useApp';
import { GOAL_OPTIONS } from '@/constants/mockData';

export default function ProfileScreen() {
  const { profile, logout, progress } = useApp();

  const goalLabel = GOAL_OPTIONS.find(g => g.id === profile.goal)?.label ?? profile.goal;
  const bmi = profile.height && profile.weight
    ? (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)
    : '--';

  const weightData = progress.slice(-14).map(p => p.weight);
  const currentWeight = weightData[weightData.length - 1]?.toFixed(1) ?? profile.weight;
  const weightChange = weightData.length >= 2
    ? (weightData[weightData.length - 1] - weightData[0]).toFixed(1)
    : '0';

  function confirmLogout() {
    Alert.alert(
      'Se déconnecter',
      'Es-tu sûr de vouloir te déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  }

  const SETTINGS = [
    { icon: '👤', label: 'Modifier mon profil', onPress: () => router.push('/(onboarding)/physical') },
    { icon: '🎯', label: 'Changer mon objectif', onPress: () => router.push('/(onboarding)/goal') },
    { icon: '🥗', label: 'Préférences alimentaires', onPress: () => router.push('/(onboarding)/diet') },
    { icon: '🏋️', label: 'Préférences sportives', onPress: () => router.push('/(onboarding)/sport-prefs') },
  ];

  return (
    <SafeScreen>
      {/* En-tête profil */}
      <View style={styles.header}>
        <View style={styles.avatar} accessibilityRole="image" accessibilityLabel="Photo de profil">
          <Text style={styles.avatarText}>{profile.name ? profile.name[0].toUpperCase() : 'V'}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{profile.name || 'Mon Profil'}</Text>
          <Text style={styles.email}>{profile.email}</Text>
          <Badge variant="acid" label={goalLabel} style={{ marginTop: 6, alignSelf: 'flex-start' }} />
        </View>
      </View>

      {/* Stats physiques */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem} accessible accessibilityLabel={`Poids actuel ${currentWeight} kilogrammes`}>
          <Text style={styles.statValue}>{currentWeight}</Text>
          <Text style={styles.statUnit}>kg</Text>
          <Text style={styles.statLabel}>Poids</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem} accessible accessibilityLabel={`Taille ${profile.height} centimètres`}>
          <Text style={styles.statValue}>{profile.height}</Text>
          <Text style={styles.statUnit}>cm</Text>
          <Text style={styles.statLabel}>Taille</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem} accessible accessibilityLabel={`IMC ${bmi}`}>
          <Text style={styles.statValue}>{bmi}</Text>
          <Text style={styles.statUnit}>IMC</Text>
          <Text style={styles.statLabel}>Corpulence</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem} accessible accessibilityLabel={`Âge ${profile.age} ans`}>
          <Text style={styles.statValue}>{profile.age}</Text>
          <Text style={styles.statUnit}>ans</Text>
          <Text style={styles.statLabel}>Âge</Text>
        </View>
      </View>

      {/* Évolution du poids */}
      <Text style={styles.sectionTitle} accessibilityRole="header">Évolution du poids (14 jours)</Text>
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartValue}>{currentWeight} kg</Text>
            <Text style={styles.chartSub}>poids actuel</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.chartChange, Number(weightChange) <= 0 ? styles.chartChangeGood : styles.chartChangeBad]}>
              {Number(weightChange) > 0 ? '+' : ''}{weightChange} kg
            </Text>
            <Text style={styles.chartSub}>sur 2 semaines</Text>
          </View>
        </View>
        <LineChart
          data={weightData}
          height={120}
          color={Colors.acid}
          accessibilityLabel={`Graphique d'évolution du poids sur 14 jours, de ${weightData[0]?.toFixed(1)} à ${currentWeight} kg`}
        />
      </View>

      {/* Paramètres */}
      <Text style={styles.sectionTitle} accessibilityRole="header">Paramètres</Text>
      <View style={styles.settingsList}>
        {SETTINGS.map((s, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.settingRow, i < SETTINGS.length - 1 && styles.settingRowBorder]}
            onPress={s.onPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={s.label}
          >
            <Text style={styles.settingIcon}>{s.icon}</Text>
            <Text style={styles.settingLabel}>{s.label}</Text>
            <Text style={styles.settingChevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Déconnexion */}
      <Button
        label="Se déconnecter"
        variant="outline"
        fullWidth
        onPress={confirmLogout}
        style={{ marginTop: Spacing.lg }}
        accessibilityLabel="Se déconnecter de l'application"
      />

      <Text style={styles.version}>VITÁL v1.0.0 — HealthAI Coach</Text>
      <View style={{ height: Spacing.xl }} />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.onyx,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: Colors.acid },
  headerInfo: { flex: 1 },
  name: { fontSize: 22, fontWeight: '700', color: Colors.onyx, letterSpacing: -0.5 },
  email: { fontSize: 13, color: Colors.gray400, marginTop: 2 },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.onyx,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 4 },
  statValue: { fontSize: 20, fontWeight: '700', color: Colors.white, letterSpacing: -0.5 },
  statUnit: { fontSize: 10, color: Colors.acid, fontWeight: '600' },
  statLabel: { fontSize: 10, color: Colors.gray400 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.onyx, marginBottom: Spacing.sm, letterSpacing: -0.3 },
  chartCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
  chartValue: { fontSize: 22, fontWeight: '700', color: Colors.onyx, letterSpacing: -0.5 },
  chartSub: { fontSize: 11, color: Colors.gray400, marginTop: 2 },
  chartChange: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  chartChangeGood: { color: Colors.mint },
  chartChangeBad: { color: Colors.coral },
  settingsList: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  settingRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  settingIcon: { fontSize: 18, width: 28 },
  settingLabel: { flex: 1, fontSize: 15, color: Colors.onyx, fontWeight: '500' },
  settingChevron: { fontSize: 20, color: Colors.gray400 },
  version: { textAlign: 'center', fontSize: 11, color: Colors.gray400, marginTop: Spacing.lg },
});
