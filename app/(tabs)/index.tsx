import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, Shadows } from '@/constants/theme';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { MacroBar } from '@/components/ui/MacroBar';
import { MealCard } from '@/components/ui/MealCard';
import { WorkoutCard } from '@/components/ui/WorkoutCard';
import { AICard } from '@/components/ui/AICard';
import { Badge } from '@/components/ui/Badge';
import useApp from '@/hooks/useApp';
import { MOCK_TODAY, WEEKLY_PLAN, AI_SUGGESTIONS, GOAL_OPTIONS } from '@/constants/mockData';

export default function DashboardScreen() {
  const { profile } = useApp();
  const today = MOCK_TODAY;
  const goalLabel = GOAL_OPTIONS.find(g => g.id === profile.goal)?.label ?? '';
  const caloriesPct = Math.round((today.totalCalories / today.targetCalories) * 100);
  const remaining = today.targetCalories - today.totalCalories;
  const todayWorkout = WEEKLY_PLAN.find(d => !d.done && d.workout)?.workout ?? null;
  const weekDone = WEEKLY_PLAN.filter(d => d.done).length;
  const weekday = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });

  return (
    <SafeScreen>
      {/* En-tête */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Bonjour{profile.name ? `, ${profile.name.split(' ')[0]}` : ''} 👋
          </Text>
          <Text style={styles.weekday}>{weekday.charAt(0).toUpperCase() + weekday.slice(1)}</Text>
        </View>
        <View
          style={styles.avatar}
          accessibilityRole="image"
          accessibilityLabel={`Avatar de ${profile.name || 'profil'}`}
        >
          <Text style={styles.avatarText}>{profile.name ? profile.name[0].toUpperCase() : 'V'}</Text>
        </View>
      </View>

      {goalLabel ? <Badge variant="acid" label={goalLabel} style={{ marginBottom: Spacing.lg }} /> : null}

      {/* Carte calories principale */}
      <View
        style={styles.calorieCard}
        accessible
        accessibilityLabel={`${today.totalCalories} calories consommées sur ${today.targetCalories} objectif, ${remaining} restantes`}
      >
        <View style={styles.calorieLeft}>
          <Text style={styles.calorieTitle}>Calories du jour</Text>
          <Text style={styles.calorieValue}>{today.totalCalories.toLocaleString('fr-FR')}</Text>
          <Text style={styles.calorieTarget}>sur {today.targetCalories.toLocaleString('fr-FR')} kcal</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${caloriesPct}%` as any }]} />
          </View>
          <Text style={styles.calorieRemaining}>{remaining} kcal restantes</Text>
        </View>
        <View
          style={styles.calorieRing}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: caloriesPct }}
        >
          <Text style={styles.ringPct}>{caloriesPct}%</Text>
          <Text style={styles.ringLabel}>objectif</Text>
        </View>
      </View>

      {/* Conseil IA */}
      <AICard
        body={AI_SUGGESTIONS[0]}
        style={{ marginBottom: Spacing.lg }}
      />

      {/* Macros */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Macronutriments aujourd{"'"}hui</Text>
        <MacroBar label="Protéines" current={today.macros.protein} target={today.targetMacros.protein} unit="g" color={Colors.sky} />
        <MacroBar label="Glucides" current={today.macros.carbs} target={today.targetMacros.carbs} unit="g" color={Colors.acidDark} />
        <MacroBar label="Lipides" current={today.macros.fat} target={today.targetMacros.fat} unit="g" color={Colors.coral} />
        <MacroBar label="Fibres" current={today.macros.fiber} target={today.targetMacros.fiber} unit="g" color={Colors.mint} />
      </View>

      {/* Séance du jour */}
      {todayWorkout && (
        <View style={{ marginBottom: Spacing.md }}>
          <Text style={styles.sectionTitle}>Séance du jour</Text>
          <WorkoutCard workout={todayWorkout} variant="dark" />
        </View>
      )}

      {/* Planning semaine */}
      <Text style={styles.sectionTitle}>Semaine en cours</Text>
      <View style={styles.weekCard}>
        {WEEKLY_PLAN.map((day, i) => {
          const isToday = i === new Date().getDay() - 1;
          return (
            <View
              key={i}
              style={[styles.dayCol, isToday && styles.dayColToday]}
              accessible
              accessibilityLabel={`${day.day}: ${day.done ? 'complété' : day.workout ? day.workout.title : 'repos'}`}
            >
              <Text style={[styles.dayName, day.done && styles.dayNameDone, isToday && styles.dayNameToday]}>
                {day.day}
              </Text>
              <View style={[
                styles.dayDot,
                day.done ? styles.dayDotDone : day.workout ? styles.dayDotPlanned : styles.dayDotRest,
                isToday && !day.done && styles.dayDotToday,
              ]} />
            </View>
          );
        })}
      </View>
      <Text style={styles.weekSummary}>{weekDone} séance{weekDone > 1 ? 's' : ''} complétée{weekDone > 1 ? 's' : ''} · objectif {profile.weeklyWorkoutDays}/sem.</Text>

      {/* Derniers repas */}
      <Text style={styles.sectionTitle}>Repas récents</Text>
      {today.meals.map(meal => (
        <MealCard key={meal.id} meal={meal} style={{ marginBottom: Spacing.sm }} />
      ))}

      <View style={{ height: Spacing.xl }} />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  greeting: { fontSize: 24, fontWeight: '700', color: Colors.text, letterSpacing: -0.5 },
  weekday: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.onyx,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 17, fontWeight: '700', color: Colors.acid },
  calorieCard: {
    backgroundColor: Colors.onyx,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  calorieLeft: { flex: 1, gap: 4 },
  calorieTitle: { fontSize: 12, color: Colors.gray400, fontWeight: '500' },
  calorieValue: { fontSize: 40, fontWeight: '700', color: Colors.white, letterSpacing: -1.5, lineHeight: 44 },
  calorieTarget: { fontSize: 12, color: Colors.gray400 },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.pill,
    overflow: 'hidden',
    marginTop: 6,
    width: '80%',
  },
  progressFill: { height: '100%', backgroundColor: Colors.acid, borderRadius: Radius.pill },
  calorieRemaining: { fontSize: 12, color: Colors.acid, fontWeight: '500' },
  calorieRing: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 3, borderColor: Colors.acid,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: Spacing.md,
  },
  ringPct: { fontSize: 17, fontWeight: '700', color: Colors.acid },
  ringLabel: { fontSize: 9, color: Colors.gray400 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  cardTitle: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.sm },
  sectionTitle: {
    fontSize: 17, fontWeight: '700', color: Colors.text,
    marginBottom: Spacing.sm, letterSpacing: -0.3,
  },
  weekCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadows.xs,
    marginBottom: Spacing.xs,
  },
  dayCol: { alignItems: 'center', gap: 8, flex: 1 },
  dayColToday: {},
  dayName: { fontSize: 11, fontWeight: '500', color: Colors.textTertiary },
  dayNameDone: { color: Colors.text },
  dayNameToday: { color: Colors.text, fontWeight: '700' },
  dayDot: { width: 10, height: 10, borderRadius: 5 },
  dayDotDone: { backgroundColor: Colors.acid },
  dayDotPlanned: { backgroundColor: Colors.gray200, borderWidth: 2, borderColor: Colors.gray400 },
  dayDotRest: { backgroundColor: Colors.gray200 },
  dayDotToday: { backgroundColor: Colors.onyx },
  weekSummary: { fontSize: 12, color: Colors.textSecondary, marginBottom: Spacing.lg },
});
