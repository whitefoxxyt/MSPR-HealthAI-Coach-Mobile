import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile, MealAnalysis, ProgressEntry } from '@/types';
import apiClient from '../services/apiClient';

const DEFAULT_PROFILE: UserProfile = {
  id: '1',
  name: '',
  email: '',
  age: 28,
  gender: 'male',
  height: 175,
  weight: 75,
  goal: 'general_health',
  activityLevel: 'moderate',
  dietType: 'omnivore',
  allergies: [],
  sportsPreferences: [],
  availableEquipment: [],
  weeklyWorkoutDays: 3,
  sessionDuration: 45,
  physicalLimitations: '',
  budget: 'medium',
  onboardingCompleted: false,
};

interface AppContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  meals: MealAnalysis[];
  addMeal: (meal: MealAnalysis) => void;
  progress: ProgressEntry[];
  isAuthenticated: boolean;
  jwtToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserData: () => Promise<void>;
  analyzeMeal: (imageUri: string, mealType: string) => Promise<any>;
  generateMealPlan: (planData: any) => Promise<any>;
  getFitnessRecommendations: () => Promise<any>;
  getWorkouts: () => Promise<any>;
  createWorkout: (workoutData: any) => Promise<any>;
  getNutritionEntries: () => Promise<any>;
  createNutritionEntry: (entryData: any) => Promise<any>;
  getMealPlans: () => Promise<any>;
  getFitnessProgramHistory: () => Promise<any>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [meals, setMeals] = useState<MealAnalysis[]>([]);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const stored = await AsyncStorage.getItem('@vital_profile');
      const token = await AsyncStorage.getItem('@vital_jwt');
      
      if (stored && token) {
        const parsed = JSON.parse(stored);
        setProfile(parsed);
        setJwtToken(token);
        
        // Verify session with BetterAuth
        try {
          const sessionData = await apiClient.auth.getSession();
          if (sessionData?.user) {
            setIsAuthenticated(true);
          } else {
            // Session expired, clear data
            await logout();
          }
        } catch (error) {
          console.log('Session verification failed, treating as expired');
          await logout();
        }
      }
    } catch {}
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      AsyncStorage.setItem('@vital_profile', JSON.stringify(next)).catch(() => {});
      return next;
    });
    
    if (jwtToken) {
      try {
        await apiClient.main.updateUserProfile(updates, jwtToken);
      } catch (error) {
        console.error('Failed to sync profile with server:', error);
      }
    }
  }

  function addMeal(meal: MealAnalysis) {
    setMeals(prev => [meal, ...prev]);
  }

  async function login(email: string, password: string) {
    try {
      // Login with BetterAuth
      await apiClient.auth.login(email, password);
      
      // Get session info
      const sessionData = await apiClient.auth.getSession();
      if (!sessionData?.user) {
        throw new Error('No session data received');
      }
      
      // Get JWT token for other microservices
      const jwtToken = await apiClient.auth.getJwtToken();
      
      setJwtToken(jwtToken);
      setIsAuthenticated(true);
      
      // Fetch user profile from API
      const userProfile = await apiClient.main.getUserProfile(jwtToken);
      const updatedProfile = {
        ...DEFAULT_PROFILE,
        id: sessionData.user.id,
        name: sessionData.user.name || sessionData.user.email.split('@')[0],
        email: sessionData.user.email,
        ...userProfile,
      };
      
      setProfile(updatedProfile);
      await AsyncStorage.setItem('@vital_profile', JSON.stringify(updatedProfile));
      await AsyncStorage.setItem('@vital_jwt', jwtToken);
      
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async function register(userData: any) {
    try {
      // Register with BetterAuth
      await apiClient.auth.register(userData);
      
      // Get session info
      const sessionData = await apiClient.auth.getSession();
      if (!sessionData?.user) {
        throw new Error('No session data received');
      }
      
      // Get JWT token for other microservices
      const jwtToken = await apiClient.auth.getJwtToken();
      
      setJwtToken(jwtToken);
      setIsAuthenticated(true);
      
      const updatedProfile = {
        ...DEFAULT_PROFILE,
        id: sessionData.user.id,
        name: sessionData.user.name || sessionData.user.email.split('@')[0],
        email: sessionData.user.email,
        ...userData,
      };
      
      setProfile(updatedProfile);
      await AsyncStorage.setItem('@vital_profile', JSON.stringify(updatedProfile));
      await AsyncStorage.setItem('@vital_jwt', jwtToken);
      
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async function logout() {
    try {
      await apiClient.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setIsAuthenticated(false);
    setJwtToken(null);
    setProfile(DEFAULT_PROFILE);
    await AsyncStorage.removeItem('@vital_profile');
    await AsyncStorage.removeItem('@vital_jwt');
  }

  async function fetchUserData() {
    if (!jwtToken) return;
    
    try {
      // Fetch main user profile
      const userProfile = await apiClient.main.getUserProfile(jwtToken);
      setProfile(prev => ({ ...prev, ...userProfile }));
      
      // Fetch nutrition goals
      const nutritionGoals = await apiClient.nutrition.getNutritionGoals(jwtToken);
      
      // Fetch fitness profile
      const fitnessProfile = await apiClient.fitness.getFitnessProfile(jwtToken);
      
      // Fetch meal history
      const mealHistory = await apiClient.nutrition.getMealHistory(jwtToken);
      setMeals(mealHistory.items || []);
      
      // Fetch workout history
      const workouts = await apiClient.main.getWorkouts(jwtToken);
      
      // Fetch progress data (biometrics, etc.)
      const biometrics = await apiClient.main.getNutritionEntries(jwtToken);
      
      // Transform biometrics to progress format
      const progressData = biometrics.map((entry: any) => ({
        date: entry.date || new Date().toISOString(),
        weight: entry.weightKg || profile.weight,
        calories: entry.calories || 0,
        workoutCompleted: !!entry.workoutId
      }));
      setProgress(progressData);
      
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }

  async function analyzeMeal(imageUri: string, mealType: string) {
    if (!jwtToken) {
      throw new Error('Not authenticated');
    }
    
    return await apiClient.nutrition.analyzeMeal(imageUri, mealType, jwtToken);
  }

  async function generateMealPlan(planData: any) {
    if (!jwtToken) {
      throw new Error('Not authenticated');
    }
    
    return await apiClient.nutrition.generateMealPlan(planData, jwtToken);
  }

  async function getFitnessRecommendations() {
    if (!jwtToken) {
      throw new Error('Not authenticated');
    }
    
    return await apiClient.fitness.getRecommendations(jwtToken);
  }

  async function getWorkouts() {
    if (!jwtToken) {
      throw new Error('Not authenticated');
    }
    
    return await apiClient.main.getWorkouts(jwtToken);
  }

  async function createWorkout(workoutData: any) {
    if (!jwtToken) {
      throw new Error('Not authenticated');
    }
    
    return await apiClient.main.createWorkout(workoutData, jwtToken);
  }

  async function getNutritionEntries() {
    if (!jwtToken) {
      throw new Error('Not authenticated');
    }
    
    return await apiClient.main.getNutritionEntries(jwtToken);
  }

  async function createNutritionEntry(entryData: any) {
    if (!jwtToken) {
      throw new Error('Not authenticated');
    }
    
    return await apiClient.main.createNutritionEntry(entryData, jwtToken);
  }

  async function getMealPlans() {
    if (!jwtToken) {
      throw new Error('Not authenticated');
    }
    
    return await apiClient.nutrition.getMealPlans(jwtToken);
  }

  async function getFitnessProgramHistory() {
    if (!jwtToken) {
      throw new Error('Not authenticated');
    }
    
    return await apiClient.fitness.getProgramHistory(jwtToken);
  }

  return (
    <AppContext.Provider value={{ 
      profile, 
      updateProfile, 
      meals, 
      addMeal, 
      progress, 
      isAuthenticated, 
      jwtToken, 
      login, 
      register, 
      logout, 
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
    }}>
      {children}
    </AppContext.Provider>
  );
}

function useAppInternal() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { useAppInternal as useApp };
