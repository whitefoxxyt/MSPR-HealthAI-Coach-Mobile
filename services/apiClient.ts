import { Platform } from 'react-native';

// Base API configuration with environment variables support
const getEnvVar = (name: string, defaultValue: string): string => {
  // In a real app, you would use a proper env library like react-native-config
  // For now, we'll use a simple approach
  return defaultValue;
};

const getBaseUrl = (service: 'api' | 'nutrition' | 'fitness' | 'auth') => {
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  
  switch (service) {
    case 'api': return getEnvVar('API_SERVICE_URL', `http://${host}:8080/api`);
    case 'nutrition': return getEnvVar('AI_NUTRITION_URL', `http://${host}:8001/api/v1`);
    case 'fitness': return getEnvVar('RECO_FITNESS_URL', `http://${host}:8002/api/v1`);
    case 'auth': return getEnvVar('AUTH_SERVICE_URL', `http://${host}:3000/api`);
    default: return getEnvVar('API_SERVICE_URL', `http://${host}:8080/api`);
  }
};

export const apiClient = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${getBaseUrl('auth')}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
      }
      
      return response.json();
    },
    
    register: async (userData: any) => {
      const response = await fetch(`${getBaseUrl('auth')}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          name: userData.name || userData.email.split('@')[0],
        }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
      }
      
      return response.json();
    },
    
    getSession: async () => {
      const response = await fetch(`${getBaseUrl('auth')}/session`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        return null;
      }
      
      return response.json();
    },
    
    getJwtToken: async () => {
      const response = await fetch(`${getBaseUrl('auth')}/jwt`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to get JWT token');
      }
      
      const data = await response.json();
      return data.token;
    },
    
    logout: async () => {
      const response = await fetch(`${getBaseUrl('auth')}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      return true;
    },
  },
  
  nutrition: {
    analyzeMeal: async (imageUri: string, mealType: string, token: string) => {
      // Convert image URI to blob for upload
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('photo', blob, 'meal-photo.jpg');
      formData.append('meal_type', mealType);
      
      const result = await fetch(`${getBaseUrl('nutrition')}/analyze-meal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      
      if (!result.ok) {
        throw new Error('Meal analysis failed');
      }
      
      return result.json();
    },
    
    generateMealPlan: async (planData: any, token: string) => {
      const response = await fetch(`${getBaseUrl('nutrition')}/generate-meal-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(planData),
      });
      
      if (!response.ok) {
        throw new Error('Meal plan generation failed');
      }
      
      return response.json();
    },
    
    getNutritionGoals: async (token: string) => {
      const response = await fetch(`${getBaseUrl('nutrition')}/nutrition-goals/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to get nutrition goals');
      }
      
      return response.json();
    },
    
    setNutritionGoals: async (goals: any, token: string) => {
      const response = await fetch(`${getBaseUrl('nutrition')}/nutrition-goals/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(goals),
      });
      
      if (!response.ok) {
        throw new Error('Failed to set nutrition goals');
      }
      
      return response.json();
    },
    
    getMealHistory: async (token: string, limit = 20, offset = 0) => {
      const response = await fetch(`${getBaseUrl('nutrition')}/meal-analyses/me?limit=${limit}&offset=${offset}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to get meal history');
      }
      
      return response.json();
    },
    
    getMealPlans: async (token: string, limit = 20, offset = 0) => {
      const response = await fetch(`${getBaseUrl('nutrition')}/meal-plans/me?limit=${limit}&offset=${offset}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to get meal plans');
      }
      
      return response.json();
    },
  },
  
  fitness: {
    getRecommendations: async (token: string) => {
      const response = await fetch(`${getBaseUrl('fitness')}/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get fitness recommendations');
      }
      
      return response.json();
    },
    
    getFitnessProfile: async (token: string) => {
      const response = await fetch(`${getBaseUrl('fitness')}/fitness-profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to get fitness profile');
      }
      
      return response.json();
    },
    
    setFitnessProfile: async (profile: any, token: string) => {
      const response = await fetch(`${getBaseUrl('fitness')}/fitness-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      
      if (!response.ok) {
        throw new Error('Failed to set fitness profile');
      }
      
      return response.json();
    },
    
    getProgramHistory: async (token: string, limit = 20, offset = 0) => {
      const response = await fetch(`${getBaseUrl('fitness')}/program-history?limit=${limit}&offset=${offset}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to get program history');
      }
      
      return response.json();
    },
  },
  
  main: {
    getUserProfile: async (token: string) => {
      const response = await fetch(`${getBaseUrl('api')}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to get user profile');
      }
      
      return response.json();
    },
    
    updateUserProfile: async (profile: any, token: string) => {
      const response = await fetch(`${getBaseUrl('api')}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }
      
      return response.json();
    },
    
    getWorkouts: async (token: string) => {
      const response = await fetch(`${getBaseUrl('api')}/workouts/user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to get workouts');
      }
      
      return response.json();
    },
    
    createWorkout: async (workout: any, token: string) => {
      const response = await fetch(`${getBaseUrl('api')}/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(workout),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create workout');
      }
      
      return response.json();
    },
    
    getNutritionEntries: async (token: string) => {
      const response = await fetch(`${getBaseUrl('api')}/nutrition/user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to get nutrition entries');
      }
      
      return response.json();
    },
    
    createNutritionEntry: async (entry: any, token: string) => {
      const response = await fetch(`${getBaseUrl('api')}/nutrition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(entry),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create nutrition entry');
      }
      
      return response.json();
    },
  },
};

export default apiClient;