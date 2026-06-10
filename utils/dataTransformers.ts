import type { MealAnalysis, Workout, ProgressEntry, NutritionPlan, DailyNutrition } from '@/types';

/**
 * Transforms API meal analysis response to app format
 */
export function transformMealAnalysis(apiResponse: any): MealAnalysis {
  return {
    id: apiResponse.analysis_id?.toString() || Date.now().toString(),
    date: apiResponse.created_at || new Date().toISOString(),
    name: apiResponse.detected_foods?.[0]?.label || 'Repas non identifié',
    calories: apiResponse.macros?.calories || 0,
    macros: {
      protein: apiResponse.macros?.protein_g || 0,
      carbs: apiResponse.macros?.carbs_g || 0,
      fat: apiResponse.macros?.fat_g || 0,
      fiber: apiResponse.macros?.fiber_g || 0
    },
    ingredients: apiResponse.detected_foods?.map((food: any) => food.label) || [],
    aiSuggestion: apiResponse.recommendations?.[0] || 'Aucune suggestion disponible',
    score: calculateMealScore(apiResponse)
  };
}

/**
 * Transforms API workout response to app format
 */
export function transformWorkout(apiResponse: any): Workout {
  return {
    id: apiResponse.id?.toString() || Date.now().toString(),
    title: apiResponse.title || apiResponse.name || 'Séance d\'entraînement',
    category: apiResponse.category || 'Général',
    level: apiResponse.level || 'Intermédiaire',
    durationMinutes: apiResponse.durationMin || 30,
    caloriesBurned: apiResponse.caloriesBurned || 0,
    completed: apiResponse.completed || false,
    date: apiResponse.date || apiResponse.createdAt || null,
    exercises: apiResponse.exercises?.map((ex: any) => ({
      name: ex.name || 'Exercice non nommé',
      sets: ex.sets || 3,
      reps: ex.reps?.toString() || '10-12',
      restSeconds: ex.restSeconds || 60,
      muscleGroup: ex.muscleGroup || 'Corps entier'
    })) || []
  };
}

/**
 * Transforms API nutrition plan to app format
 */
export function transformNutritionPlan(apiResponse: any): NutritionPlan {
  return {
    id: apiResponse.plan_id?.toString() || Date.now().toString(),
    name: apiResponse.name || 'Plan nutritionnel personnalisé',
    description: apiResponse.description || 'Plan adapté à vos objectifs',
    dailyCalories: apiResponse.daily_calories || 2000,
    meals: apiResponse.meals?.map((meal: any) => ({
      type: meal.meal_type || 'repas',
      name: meal.name || 'Repas non nommé',
      calories: meal.calories || 0,
      macros: {
        protein: meal.protein_g || 0,
        carbs: meal.carbs_g || 0,
        fat: meal.fat_g || 0,
        fiber: meal.fiber_g || 0
      }
    })) || []
  };
}

/**
 * Transforms API progress data to app format
 */
export function transformProgress(apiResponse: any): ProgressEntry {
  return {
    date: apiResponse.date || new Date().toISOString(),
    weight: apiResponse.weightKg || 75,
    calories: apiResponse.calories || 0,
    workoutCompleted: !!apiResponse.workoutCompleted
  };
}

/**
 * Transforms API daily nutrition to app format
 */
export function transformDailyNutrition(apiResponse: any): DailyNutrition {
  return {
    date: apiResponse.date || new Date().toISOString(),
    totalCalories: apiResponse.totalCalories || 0,
    targetCalories: apiResponse.targetCalories || 2000,
    macros: {
      protein: apiResponse.macros?.protein || 0,
      carbs: apiResponse.macros?.carbs || 0,
      fat: apiResponse.macros?.fat || 0,
      fiber: apiResponse.macros?.fiber || 0
    },
    targetMacros: {
      protein: apiResponse.targetMacros?.protein || 0,
      carbs: apiResponse.targetMacros?.carbs || 0,
      fat: apiResponse.targetMacros?.fat || 0,
      fiber: apiResponse.targetMacros?.fiber || 0
    },
    meals: apiResponse.meals?.map(transformMealAnalysis) || []
  };
}

/**
 * Calculates a meal score based on nutritional balance
 */
function calculateMealScore(apiResponse: any): number {
  if (!apiResponse.macros) return 50;
  
  const { protein, carbs, fat, fiber } = apiResponse.macros;
  const total = protein + carbs + fat;
  
  if (total === 0) return 50;
  
  // Simple scoring algorithm
  let score = 50;
  
  // Protein quality
  const proteinRatio = protein / total;
  if (proteinRatio > 0.2 && proteinRatio < 0.4) score += 15;
  
  // Fiber content
  if (fiber > 5) score += 10;
  if (fiber > 10) score += 5;
  
  // Balance
  const balance = Math.abs((protein - carbs) / total);
  if (balance < 0.2) score += 10;
  
  // Cap at 100
  return Math.min(100, Math.max(20, score));
}

/**
 * Generates AI suggestions based on current data
 */
export function generateAISuggestions(
  meals: MealAnalysis[],
  progress: ProgressEntry[],
  profile: any
): string[] {
  const suggestions: string[] = [];
  
  // Analyze recent meals
  const recentMeals = meals.slice(0, 3);
  const avgCalories = recentMeals.reduce((sum, meal) => sum + meal.calories, 0) / recentMeals.length;
  const targetCalories = profile.weight * 25; // Simple estimate
  
  if (avgCalories < targetCalories * 0.8) {
    suggestions.push(`Tu es en dessous de tes besoins caloriques (${Math.round(targetCalories)} kcal/jour). Ajoute une collation riche en protéines.`);
  } else if (avgCalories > targetCalories * 1.2) {
    suggestions.push(`Tu dépasses tes besoins caloriques. Considère des portions plus petites ou des aliments moins denses.`);
  }
  
  // Check protein intake
  const avgProtein = recentMeals.reduce((sum, meal) => sum + meal.macros.protein, 0) / recentMeals.length;
  if (avgProtein < profile.weight * 1.6) {
    suggestions.push(`Ton apport en protéines est faible. Ajoute des sources comme poulet, poisson, ou légumineuses.`);
  }
  
  // Check workout consistency
  const recentWorkouts = progress.slice(0, 7).filter(p => p.workoutCompleted);
  if (recentWorkouts.length < 3) {
    suggestions.push(`Tu as fait ${recentWorkouts.length} séances cette semaine. Essaye d'atteindre 3-4 pour de meilleurs résultats.`);
  }
  
  // General encouragement
  if (suggestions.length === 0) {
    suggestions.push('Bravo ! Ton équilibre nutritionnel et ton activité physique sont excellents cette semaine.');
  }
  
  return suggestions;
}

/**
 * Creates workout data for API submission
 */
export function createWorkoutData(
  title: string,
  durationMinutes: number,
  caloriesBurned: number,
  exercises: { name: string; sets: number; reps: string; restSeconds: number; muscleGroup: string }[]
): any {
  return {
    title,
    durationMin: durationMinutes,
    caloriesBurned,
    exercises: exercises.map(ex => ({
      name: ex.name,
      sets: ex.sets,
      reps: ex.reps,
      restSeconds: ex.restSeconds,
      muscleGroup: ex.muscleGroup
    }))
  };
}

/**
 * Creates nutrition entry data for API submission
 */
export function createNutritionEntryData(
  foodName: string,
  calories: number,
  protein: number,
  carbs: number,
  fat: number,
  fiber: number,
  mealType: string
): any {
  return {
    foodName,
    calories,
    protein,
    carbs,
    fat,
    fiber,
    mealType,
    date: new Date().toISOString()
  };
}