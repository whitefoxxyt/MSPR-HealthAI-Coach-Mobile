import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, ScrollView, Image } from 'react-native';
import useHealthAI from '../hooks/useHealthAI';
import { launchImageLibrary } from 'react-native-image-picker';

const AIFeaturesDemo = () => {
  const {
    isLoading,
    error,
    aiSuggestions,
    workouts,
    nutritionPlans,
    analyzeMealPhoto,
    generatePersonalizedMealPlan,
    getPersonalizedWorkoutRecommendations,
    getDailySummary,
    getWeeklyProgress
  } = useHealthAI();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mealAnalysisResult, setMealAnalysisResult] = useState<any>(null);
  const [workoutRecommendations, setWorkoutRecommendations] = useState<any>(null);
  const [mealPlan, setMealPlan] = useState<any>(null);

  const dailySummary = getDailySummary();
  const weeklyProgress = getWeeklyProgress();

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets[0].uri) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    try {
      const result = await analyzeMealPhoto(selectedImage, 'lunch');
      setMealAnalysisResult(result);
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  const generateMealPlan = async () => {
    try {
      const plan = await generatePersonalizedMealPlan({
        health_goal: 'balance',
        diet_type: 'omnivore',
        duration_days: 7,
        allergies: [],
        budget_eur_per_day: 20
      });
      setMealPlan(plan);
    } catch (err) {
      console.error('Meal plan generation failed:', err);
    }
  };

  const getWorkoutRecs = async () => {
    try {
      const recs = await getPersonalizedWorkoutRecommendations();
      setWorkoutRecommendations(recs);
    } catch (err) {
      console.error('Workout recommendations failed:', err);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement des données...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erreur: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Fonctionnalités AI HealthAI Coach</Text>

      {/* AI Suggestions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🤖 Suggestions AI Personnalisées</Text>
        {aiSuggestions.length > 0 ? (
          aiSuggestions.map((suggestion, index) => (
            <Text key={index} style={styles.suggestion}>{suggestion}</Text>
          ))
        ) : (
          <Text style={styles.infoText}>Aucune suggestion disponible pour le moment</Text>
        )}
      </View>

      {/* Meal Analysis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🍽️ Analyse de Repas par IA</Text>
        <Button title="Sélectionner une photo" onPress={pickImage} />
        {selectedImage && (
          <>
            <Image source={{ uri: selectedImage }} style={styles.image} />
            <Button title="Analyser le repas" onPress={analyzeImage} />
          </>
        )}
        {mealAnalysisResult && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>{mealAnalysisResult.name}</Text>
            <Text>Calories: {mealAnalysisResult.calories} kcal</Text>
            <Text>Protéines: {mealAnalysisResult.macros.protein}g</Text>
            <Text>Glucides: {mealAnalysisResult.macros.carbs}g</Text>
            <Text>Lipides: {mealAnalysisResult.macros.fat}g</Text>
            <Text>Score: {mealAnalysisResult.score}/100</Text>
            <Text style={styles.aiSuggestion}>{mealAnalysisResult.aiSuggestion}</Text>
          </View>
        )}
      </View>

      {/* Meal Plan Generation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Génération de Plan Alimentaire</Text>
        <Button title="Générer un plan de 7 jours" onPress={generateMealPlan} />
        {mealPlan && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>{mealPlan.name}</Text>
            <Text>Calories quotidiennes: {mealPlan.dailyCalories}</Text>
            <Text>Nombre de repas: {mealPlan.meals.length}</Text>
            {mealPlan.meals.map((meal: any, index: number) => (
              <View key={index} style={styles.mealItem}>
                <Text style={styles.mealType}>{meal.type}</Text>
                <Text>{meal.name} - {meal.calories} kcal</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Workout Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💪 Recommandations d'Entraînement</Text>
        <Button title="Obtenir des recommandations" onPress={getWorkoutRecs} />
        {workoutRecommendations && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Programme sur {workoutRecommendations.durationWeeks} semaines</Text>
            <Text>Nombre de séances: {workoutRecommendations.workouts.length}</Text>
            <Text>Stratégie: {workoutRecommendations.scoringStrategy}</Text>
          </View>
        )}
      </View>

      {/* Daily Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Résumé Quotidien</Text>
        {dailySummary ? (
          <View style={styles.resultContainer}>
            <Text>Calories: {dailySummary.totalCalories} / {dailySummary.targetCalories}</Text>
            <Text>Protéines: {dailySummary.macros.protein}g / {dailySummary.targetMacros.protein}g</Text>
            <Text>Glucides: {dailySummary.macros.carbs}g / {dailySummary.targetMacros.carbs}g</Text>
            <Text>Lipides: {dailySummary.macros.fat}g / {dailySummary.targetMacros.fat}g</Text>
            <Text>Fibres: {dailySummary.macros.fiber}g / {dailySummary.targetMacros.fiber}g</Text>
          </View>
        ) : (
          <Text style={styles.infoText}>Aucune donnée disponible pour aujourd'hui</Text>
        )}
      </View>

      {/* Weekly Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 Progrès Hebdomadaire</Text>
        {weeklyProgress ? (
          <View style={styles.resultContainer}>
            <Text>Séances complétées: {weeklyProgress.completedWorkouts}/{weeklyProgress.totalWorkouts}</Text>
            <Text>Poids moyen: {weeklyProgress.avgWeight.toFixed(1)} kg</Text>
            <Text>Variation: {weeklyProgress.weightChange.toFixed(1)} kg</Text>
          </View>
        ) : (
          <Text style={styles.infoText}>Aucune donnée de progression disponible</Text>
        )}
      </View>

      {/* Existing Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Données Existantes</Text>
        <Text>Séances d'entraînement: {workouts.length}</Text>
        <Text>Plans nutritionnels: {nutritionPlans.length}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  section: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  suggestion: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 8
  },
  aiSuggestion: {
    backgroundColor: '#e8f5e9',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    fontStyle: 'italic'
  },
  infoText: {
    color: '#666',
    fontStyle: 'italic'
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
    borderRadius: 10
  },
  resultContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5
  },
  resultTitle: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  mealItem: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 5
  },
  mealType: {
    fontWeight: 'bold',
    color: '#2e7d32'
  }
});

export default AIFeaturesDemo;