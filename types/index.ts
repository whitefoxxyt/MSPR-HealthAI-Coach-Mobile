export type Goal = 'weight_loss' | 'muscle_gain' | 'endurance' | 'balance' | 'general_health';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Gender = 'male' | 'female' | 'other';
export type DietType = 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'gluten_free';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  goal: Goal;
  activityLevel: ActivityLevel;
  dietType: DietType;
  allergies: string[];
  sportsPreferences: string[];
  availableEquipment: string[];
  weeklyWorkoutDays: number;
  sessionDuration: number;
  physicalLimitations: string;
  budget: 'low' | 'medium' | 'high';
  onboardingCompleted: boolean;
}

export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface MealAnalysis {
  id: string;
  date: string;
  imageUri?: string;
  name: string;
  calories: number;
  macros: MacroNutrients;
  ingredients: string[];
  aiSuggestion: string;
  score: number;
}

export interface DailyNutrition {
  date: string;
  totalCalories: number;
  targetCalories: number;
  macros: MacroNutrients;
  targetMacros: MacroNutrients;
  meals: MealAnalysis[];
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  muscleGroup: string;
}

export interface Workout {
  id: string;
  title: string;
  category: string;
  level: string;
  durationMinutes: number;
  caloriesBurned: number;
  exercises: Exercise[];
  completed: boolean;
  date?: string;
}

export interface WeeklyWorkoutPlan {
  weekNumber: number;
  workouts: { day: string; workout: Workout | null }[];
}

export interface ProgressEntry {
  date: string;
  weight: number;
  calories: number;
  workoutCompleted: boolean;
}

export interface NutritionPlan {
  id: string;
  name: string;
  description: string;
  dailyCalories: number;
  meals: { type: string; name: string; calories: number; macros: MacroNutrients }[];
}
