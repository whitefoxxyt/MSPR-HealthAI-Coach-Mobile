import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors, Spacing, Radius, Shadows } from '@/constants/theme';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { MacroBar } from '@/components/ui/MacroBar';
import { MealCard } from '@/components/ui/MealCard';
import { AICard } from '@/components/ui/AICard';
import { Badge } from '@/components/ui/Badge';
import useApp from '@/hooks/useApp';
import useHealthAI from '@/hooks/useHealthAI';

type Tab = 'journal' | 'plan';

export default function NutritionScreen() {
  const { meals, isAuthenticated } = useApp();
  const [tab, setTab] = useState<Tab>('journal');
  const {
    isLoading,
    error,
    aiSuggestions,
    nutritionPlans,
    getDailySummary,
    refreshAllData
  } = useHealthAI();

  const dailySummary = getDailySummary();
  const currentPlan = nutritionPlans[0]; // Get the most recent plan
  
  // Auto-refresh when screen comes into focus
  useEffect(() => {
    if (isAuthenticated) {
      refreshAllData();
    }
  }, [isAuthenticated]);

  if (isLoading && meals.length === 0) {
    return (
      <SafeScreen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.acid} />
          <Text style={styles.loadingText}>Chargement des données nutritionnelles...</Text>
        </View>
      </SafeScreen>
    );
  }

  if (error) {
    return (
      <SafeScreen>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erreur de chargement des données</Text>
          <TouchableOpacity onPress={refreshAllData} style={styles.retryButton}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeScreen>
    );
  }

  // Use real data if available, otherwise show placeholders
  const today = dailySummary || {
    totalCalories: 0,
    targetCalories: profile.weight * 25,
    macros: { protein: 0, carbs: 0, fat: 0, fiber: 0 },
    targetMacros: {
      protein: profile.weight * 1.6,
      carbs: (profile.weight * 25) * 0.4 / 4,
      fat: (profile.weight * 25) * 0.3 / 9,
      fiber: 30
    }
  };
  
  const plan = currentPlan || {
    name: 'Aucun plan généré',
    description: 'Génère un plan alimentaire personnalisé avec l\'IA',
    dailyCalories: profile.weight * 25,
    meals: []
  };
  
  const caloriesPct = dailySummary 
    ? Math.round((dailySummary.totalCalories / dailySummary.targetCalories) * 100)
    : 0;

  return (
    <SafeScreen>
      <Text style={styles.title} accessibilityRole="header">Nutrition</Text>

      {/* Résumé calorique */}
      <View style={styles.calorieCard}>
        <View style={styles.calorieRow}>
          <View>
            <Text style={styles.calorieValue}>{today.totalCalories}</Text>
            <Text style={styles.calorieLabel}>kcal consommées</Text>
          </View>
          <View style={styles.calorieCenter}>
            <View
              style={styles.ring}
              accessible
              accessibilityRole="progressbar"
              accessibilityValue={{ min: 0, max: 100, now: caloriesPct }}
              accessibilityLabel={`${caloriesPct}% de l'objectif calorique atteint`}
            >
              <Text style={styles.ringPct}>{caloriesPct}%</Text>
              <Text style={styles.ringLabel}>objectif</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.calorieValue}>{today.targetCalories - today.totalCalories}</Text>
            <Text style={styles.calorieLabel}>kcal restantes</Text>
          </View>
        </View>

        <View style={styles.macrosRow}>
          <View style={styles.macroMini} accessible accessibilityLabel={`Protéines : ${today.macros.protein}g`}>
            <Text style={[styles.macroMiniVal, { color: Colors.sky }]}>{today.macros.protein}g</Text>
            <Text style={styles.macroMiniLabel}>Protéines</Text>
          </View>
          <View style={styles.macroMini} accessible accessibilityLabel={`Glucides : ${today.macros.carbs}g`}>
            <Text style={[styles.macroMiniVal, { color: Colors.acidDark }]}>{today.macros.carbs}g</Text>
            <Text style={styles.macroMiniLabel}>Glucides</Text>
          </View>
          <View style={styles.macroMini} accessible accessibilityLabel={`Lipides : ${today.macros.fat}g`}>
            <Text style={[styles.macroMiniVal, { color: Colors.coral }]}>{today.macros.fat}g</Text>
            <Text style={styles.macroMiniLabel}>Lipides</Text>
          </View>
          <View style={styles.macroMini} accessible accessibilityLabel={`Fibres : ${today.macros.fiber}g`}>
            <Text style={[styles.macroMiniVal, { color: Colors.mint }]}>{today.macros.fiber}g</Text>
            <Text style={styles.macroMiniLabel}>Fibres</Text>
          </View>
        </View>
      </View>

      {/* Macro bars */}
      <View style={styles.barsCard}>
        <MacroBar label="Protéines" current={today.macros.protein} target={today.targetMacros.protein} unit="g" color={Colors.sky} />
        <MacroBar label="Glucides" current={today.macros.carbs} target={today.targetMacros.carbs} unit="g" color={Colors.acidDark} />
        <MacroBar label="Lipides" current={today.macros.fat} target={today.targetMacros.fat} unit="g" color={Colors.coral} />
        <MacroBar label="Fibres" current={today.macros.fiber} target={today.targetMacros.fiber} unit="g" color={Colors.mint} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs} accessibilityRole="tablist">
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'journal' && styles.tabBtnActive]}
          onPress={() => setTab('journal')}
          accessibilityRole="tab"
          accessibilityState={{ selected: tab === 'journal' }}
          accessibilityLabel="Journal alimentaire"
        >
          <Text style={[styles.tabLabel, tab === 'journal' && styles.tabLabelActive]}>Journal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'plan' && styles.tabBtnActive]}
          onPress={() => setTab('plan')}
          accessibilityRole="tab"
          accessibilityState={{ selected: tab === 'plan' }}
          accessibilityLabel="Plan alimentaire"
        >
          <Text style={[styles.tabLabel, tab === 'plan' && styles.tabLabelActive]}>Plan IA</Text>
        </TouchableOpacity>
      </View>

      {tab === 'journal' && (
        <>
          {aiSuggestions.length > 0 ? (
            <AICard
              variant="coach"
              title="Conseil nutritionnel"
              body={aiSuggestions[0]}
              style={{ marginBottom: Spacing.md }}
            />
          ) : (
            <AICard
              variant="coach"
              title="Conseil nutritionnel"
              body="Analyse tes repas pour recevoir des conseils personnalisés par notre IA"
              style={{ marginBottom: Spacing.md }}
            />
          )}
          {meals.map(meal => (
            <MealCard key={meal.id} meal={meal} style={{ marginBottom: Spacing.sm }} />
          ))}
        </>
      )}

      {tab === 'plan' && (
        <>
          <View style={styles.planHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planDesc}>{plan.description}</Text>
            </View>
            <Badge variant="acid" label={`${plan.dailyCalories} kcal`} />
          </View>
          {plan.meals.map((meal, i) => (
            <View key={i} style={styles.planMeal}>
              <View style={styles.planMealLeft}>
                <Badge variant="neutral" label={meal.type} />
                <Text style={styles.planMealName}>{meal.name}</Text>
                <View style={styles.planMealMacros}>
                  <Text style={styles.planMealMacro}>{meal.macros.protein}g prot</Text>
                  <Text style={styles.planMealMacro}>{meal.macros.carbs}g gluc</Text>
                  <Text style={styles.planMealMacro}>{meal.macros.fat}g lip</Text>
                </View>
              </View>
              <Text style={styles.planMealCal}>{meal.calories} kcal</Text>
            </View>
          ))}
        </>
      )}

      <View style={{ height: Spacing.xl }} />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700', color: Colors.text, marginBottom: Spacing.lg, letterSpacing: -0.5 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.textSecondary,
    fontSize: 16
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg
  },
  errorText: {
    color: Colors.coral,
    fontSize: 18,
    marginBottom: Spacing.lg,
    textAlign: 'center'
  },
  retryButton: {
    backgroundColor: Colors.acid,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg
  },
  retryText: {
    color: Colors.onyx,
    fontWeight: '600',
    fontSize: 16
  },
  calorieCard: {
    backgroundColor: Colors.onyx,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  calorieRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  calorieValue: { fontSize: 24, fontWeight: '700', color: Colors.white, letterSpacing: -0.5 },
  calorieLabel: { fontSize: 11, color: Colors.gray400, marginTop: 2 },
  calorieCenter: { alignItems: 'center' },
  ring: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 3, borderColor: Colors.acid,
    alignItems: 'center', justifyContent: 'center',
  },
  ringPct: { fontSize: 18, fontWeight: '700', color: Colors.acid },
  ringLabel: { fontSize: 9, color: Colors.gray400 },
  macrosRow: { flexDirection: 'row', justifyContent: 'space-between' },
  macroMini: { alignItems: 'center' },
  macroMiniVal: { fontSize: 16, fontWeight: '700' },
  macroMiniLabel: { fontSize: 10, color: Colors.gray400, marginTop: 2 },
  barsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surface2,
    borderRadius: Radius.lg,
    padding: 4,
    marginBottom: Spacing.md,
  },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: Radius.md },
  tabBtnActive: { backgroundColor: Colors.surface, ...Shadows.sm },
  tabLabel: { fontSize: 14, fontWeight: '600', color: Colors.textTertiary },
  tabLabelActive: { color: Colors.text },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.surface2,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.acidDark,
  },
  planName: { fontSize: 16, fontWeight: '700', color: Colors.text },
  planDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  planMeal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  planMealLeft: { flex: 1, gap: 4 },
  planMealName: { fontSize: 14, fontWeight: '600', color: Colors.text },
  planMealMacros: { flexDirection: 'row', gap: Spacing.sm },
  planMealMacro: { fontSize: 11, color: Colors.textTertiary },
  planMealCal: { fontSize: 15, fontWeight: '700', color: Colors.text },
});
