import { useState, useEffect } from 'react';
import useApp from './useApp';
import { transformMealAnalysis, transformWorkout, transformNutritionPlan, generateAISuggestions } from '../utils/dataTransformers';
import { Alert } from 'react-native';

export function useHealthAI() {
  const {
    jwtToken,
    profile,
    meals,
    progress,
    fetchUserData,
    analyzeMeal,
    generateMealPlan,
    getFitnessRecommendations,
    getWorkouts,
    createWorkout,
    getNutritionEntries,
    createNutritionEntry,
    getMealPlans,
    getFitnessProgramHistory
  } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiSuggestions, setAISuggestions] = useState<string[]>([]);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [nutritionPlans, setNutritionPlans] = useState<any[]>([]);
  const [fitnessPrograms, setFitnessPrograms] = useState<any[]>([]);

  // Auto-fetch data when authenticated
  useEffect(() => {
    if (jwtToken) {
      refreshAllData();
    }
  }, [jwtToken]);

  // Generate AI suggestions whenever data changes
  useEffect(() => {
    if (meals.length > 0 && progress.length > 0) {
      const suggestions = generateAISuggestions(meals, progress, profile);
      setAISuggestions(suggestions);
    }
  }, [meals, progress, profile]);

  const refreshAllData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await fetchUserData();
      await loadWorkouts();
      await loadNutritionPlans();
      await loadFitnessPrograms();
    } catch (err) {
      setError('Failed to load data');
      console.error('Refresh failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadWorkouts = async () => {
    try {
      const data = await getWorkouts();
      const transformed = data.map(transformWorkout);
      setWorkouts(transformed);
      return transformed;
    } catch (err) {
      console.error('Failed to load workouts:', err);
      setError('Failed to load workouts');
      return [];
    }
  };

  const loadNutritionPlans = async () => {
    try {
      const data = await getMealPlans();
      const transformed = data.items.map(transformNutritionPlan);
      setNutritionPlans(transformed);
      return transformed;
    } catch (err) {
      console.error('Failed to load nutrition plans:', err);
      setError('Failed to load nutrition plans');
      return [];
    }
  };

  const loadFitnessPrograms = async () => {
    try {
      const data = await getFitnessProgramHistory();
      setFitnessPrograms(data.items || []);
      return data.items || [];
    } catch (err) {
      console.error('Failed to load fitness programs:', err);
      setError('Failed to load fitness programs');
      return [];
    }
  };

  const analyzeMealPhoto = async (imageUri: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' = 'lunch') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await analyzeMeal(imageUri, mealType);
      const transformed = transformMealAnalysis(result);
      
      // Update local state
      useApp().addMeal(transformed);
      
      return transformed;
    } catch (err) {
      setError('Failed to analyze meal');
      console.error('Meal analysis failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const generatePersonalizedMealPlan = async (planData: {
    health_goal: string;
    diet_type: string;
    duration_days: number;
    allergies?: string[];
    budget_eur_per_day?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await generateMealPlan(planData);
      const transformed = transformNutritionPlan(result);
      
      // Refresh nutrition plans
      await loadNutritionPlans();
      
      return transformed;
    } catch (err) {
      setError('Failed to generate meal plan');
      console.error('Meal plan generation failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getPersonalizedWorkoutRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getFitnessRecommendations();
      
      // Transform the workout program
      const transformedProgram = {
        id: result.program_id,
        durationWeeks: result.duration_weeks,
        workouts: result.weeks.flat().map((week: any[]) => 
          week.map(ex => transformWorkout(ex))
        ),
        scoringStrategy: result.scoring_strategy,
        tier: result.tier_at_generation
      };
      
      return transformedProgram;
    } catch (err) {
      setError('Failed to get workout recommendations');
      console.error('Workout recommendations failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logWorkout = async (workoutData: {
    title: string;
    durationMinutes: number;
    caloriesBurned: number;
    exercises: { name: string; sets: number; reps: string; restSeconds: number; muscleGroup: string }[];
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await createWorkout(workoutData);
      const transformed = transformWorkout(result);
      
      // Refresh workouts
      await loadWorkouts();
      
      return transformed;
    } catch (err) {
      setError('Failed to log workout');
      console.error('Workout logging failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logNutritionEntry = async (entryData: {
    foodName: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    mealType: string;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await createNutritionEntry(entryData);
      
      // Refresh nutrition data
      await fetchUserData();
      
      return result;
    } catch (err) {
      setError('Failed to log nutrition entry');
      console.error('Nutrition logging failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getDailySummary = () => {
    if (meals.length === 0) return null;
    
    const todayMeals = meals.filter(meal => {
      const mealDate = new Date(meal.date);
      const today = new Date();
      return mealDate.toDateString() === today.toDateString();
    });
    
    if (todayMeals.length === 0) return null;
    
    const totalCalories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);
    const targetCalories = profile.weight * 25; // Simple estimate
    
    const macros = todayMeals.reduce((acc, meal) => ({
      protein: acc.protein + meal.macros.protein,
      carbs: acc.carbs + meal.macros.carbs,
      fat: acc.fat + meal.macros.fat,
      fiber: acc.fiber + meal.macros.fiber
    }), { protein: 0, carbs: 0, fat: 0, fiber: 0 });
    
    return {
      totalCalories,
      targetCalories,
      macros,
      targetMacros: {
        protein: profile.weight * 1.6,
        carbs: targetCalories * 0.4 / 4,
        fat: targetCalories * 0.3 / 9,
        fiber: 30
      },
      meals: todayMeals
    };
  };

  const getWeeklyProgress = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const weeklyProgress = progress.filter(p => {
      const progressDate = new Date(p.date);
      return progressDate >= startOfWeek && progressDate <= today;
    });
    
    const completedWorkouts = weeklyProgress.filter(p => p.workoutCompleted).length;
    const avgWeight = weeklyProgress.reduce((sum, p) => sum + p.weight, 0) / weeklyProgress.length;
    const weightChange = weeklyProgress.length > 1 
      ? avgWeight - weeklyProgress[0].weight
      : 0;
    
    return {
      completedWorkouts,
      totalWorkouts: weeklyProgress.length,
      avgWeight,
      weightChange,
      progress: weeklyProgress
    };
  };

  // Helper to show error alerts
  const showError = (message: string) => {
    setError(message);
    Alert.alert('Erreur', message);
  };

  return {
    isLoading,
    error,
    aiSuggestions,
    workouts,
    nutritionPlans,
    fitnessPrograms,
    
    // Data loading functions
    refreshAllData,
    loadWorkouts,
    loadNutritionPlans,
    loadFitnessPrograms,
    
    // AI-powered functions
    analyzeMealPhoto,
    generatePersonalizedMealPlan,
    getPersonalizedWorkoutRecommendations,
    
    // Data logging functions
    logWorkout,
    logNutritionEntry,
    
    // Summary functions
    getDailySummary,
    getWeeklyProgress,
    
    // Utility
    showError
  };
}

export default useHealthAI;