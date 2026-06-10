import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Spacing, Radius, Shadows } from '@/constants/theme';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { Button } from '@/components/ui/Button';
import { MacroBar } from '@/components/ui/MacroBar';
import { AICard } from '@/components/ui/AICard';
import { Badge } from '@/components/ui/Badge';
import useApp from '@/hooks/useApp';
import useHealthAI from '@/hooks/useHealthAI';
import type { MealAnalysis } from '@/types';

export default function ScanScreen() {
  const { addMeal, isAuthenticated } = useApp();
  const { analyzeMealPhoto, isLoading: aiLoading } = useHealthAI();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MealAnalysis | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setAnalysis(null);
      setSaved(false);
      runAnalysis();
    }
  }

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setAnalysis(null);
      setSaved(false);
      runAnalysis();
    }
  }

  async function runAnalysis() {
    if (!isAuthenticated) {
      setError('Tu dois être connecté pour utiliser l\'analyse IA');
      setAnalyzing(false);
      return;
    }
    
    try {
      setAnalyzing(true);
      setError(null);
      
      if (!imageUri) {
        setError('Aucune image sélectionnée');
        setAnalyzing(false);
        return;
      }
      
      // Call the real AI analysis
      const result = await analyzeMealPhoto(imageUri, 'lunch');
      setAnalysis(result);
    } catch (err) {
      console.error('AI Analysis failed:', err);
      setError('Échec de l\'analyse IA. Veuillez réessayer.');
    } finally {
      setAnalyzing(false);
    }
  }

  function handleSave() {
    if (!analysis) return;
    addMeal({
      ...analysis,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    });
    setSaved(true);
  }

  function reset() {
    setImageUri(null);
    setAnalysis(null);
    setSaved(false);
  }

  return (
    <SafeScreen>
      <Text style={styles.title} accessibilityRole="header">Scanner un repas</Text>
      <Text style={styles.subtitle}>Prends en photo ton assiette et laisse l{"'"}IA analyser ses valeurs nutritionnelles.</Text>

      {!imageUri && (
        <View style={styles.uploadZone} accessible accessibilityLabel="Zone de capture photo">
          <View style={styles.uploadIcon}>
            <Text style={styles.uploadIconText}>📸</Text>
          </View>
          <Text style={styles.uploadTitle}>Photo de ton repas</Text>
          <Text style={styles.uploadHint}>JPG, PNG — analyse IA instantanée</Text>
          <View style={styles.btnRow}>
            <Button
              label="Prendre une photo"
              variant="primary"
              onPress={takePhoto}
              style={{ flex: 1 }}
              accessibilityLabel="Ouvrir l'appareil photo"
            />
            <Button
              label="Galerie"
              variant="outline"
              onPress={pickImage}
              style={{ flex: 1 }}
              accessibilityLabel="Choisir depuis la galerie"
            />
          </View>
        </View>
      )}

      {imageUri && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            accessible
            accessibilityLabel="Photo du repas capturé"
          />
          <TouchableOpacity
            style={styles.retakeBtn}
            onPress={reset}
            accessibilityRole="button"
            accessibilityLabel="Reprendre une photo"
          >
            <Text style={styles.retakeBtnText}>↩ Reprendre</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {analyzing && (
        <View style={styles.analyzingCard} accessible accessibilityLabel="Analyse en cours">
          <ActivityIndicator size="large" color={Colors.acid} />
          <Text style={styles.analyzingText}>Analyse IA en cours...</Text>
          <Text style={styles.analyzingHint}>Détection des aliments, calcul des macros</Text>
        </View>
      )}

      {analysis && !analyzing && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.resultName}>{analysis.name}</Text>
              <View style={styles.badgeRow}>
                <Badge variant="acid" label={`Score ${analysis.score}/100`} />
              </View>
            </View>
            <View style={styles.calBadge} accessibilityLabel={`${analysis.calories} calories`}>
              <Text style={styles.calValue}>{analysis.calories}</Text>
              <Text style={styles.calUnit}>kcal</Text>
            </View>
          </View>

          <View style={styles.macrosSection}>
            <MacroBar label="Protéines" current={analysis.macros.protein} target={50} unit="g" color={Colors.sky} />
            <MacroBar label="Glucides" current={analysis.macros.carbs} target={80} unit="g" color={Colors.acid} />
            <MacroBar label="Lipides" current={analysis.macros.fat} target={30} unit="g" color={Colors.coral} />
            <MacroBar label="Fibres" current={analysis.macros.fiber} target={15} unit="g" color={Colors.mint} />
          </View>

          <View style={styles.ingredientsList}>
            <Text style={styles.ingredientsTitle}>Ingrédients détectés</Text>
            <View style={styles.ingredientPills}>
              {analysis.ingredients.map((ing, i) => (
                <View key={i} style={styles.pill} accessible accessibilityLabel={ing}>
                  <Text style={styles.pillText}>{ing}</Text>
                </View>
              ))}
            </View>
          </View>

          <AICard
            variant="analysis"
            title="Analyse nutritionnelle"
            body={analysis.aiSuggestion}
            style={{ marginTop: Spacing.md }}
          />

          {!saved ? (
            <Button
              label="Ajouter à mon journal"
              variant="acid"
              fullWidth
              onPress={handleSave}
              style={{ marginTop: Spacing.md }}
              accessibilityLabel="Enregistrer ce repas dans mon journal nutritionnel"
            />
          ) : (
            <View style={styles.savedBanner} accessible accessibilityLabel="Repas enregistré avec succès">
              <Text style={styles.savedText}>✓ Repas ajouté à ton journal !</Text>
            </View>
          )}
        </View>
      )}

      <View style={{ height: Spacing.xl }} />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700', color: Colors.onyx, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: Colors.gray400, marginTop: 4, marginBottom: Spacing.lg, lineHeight: 20 },
  uploadZone: {
    backgroundColor: Colors.cream2,
    borderRadius: Radius.xl,
    borderWidth: 2,
    borderColor: Colors.gray200,
    borderStyle: 'dashed',
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  uploadIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    ...Shadows.sm,
  },
  uploadIconText: { fontSize: 32 },
  uploadTitle: { fontSize: 17, fontWeight: '700', color: Colors.onyx },
  uploadHint: { fontSize: 12, color: Colors.gray400 },
  btnRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm, width: '100%' },
  imageContainer: { borderRadius: Radius.xl, overflow: 'hidden', marginBottom: Spacing.md },
  image: { width: '100%', height: 260 },
  retakeBtn: {
    position: 'absolute', top: Spacing.sm, right: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: Radius.md, paddingHorizontal: Spacing.sm, paddingVertical: 6,
  },
  retakeBtnText: { color: Colors.white, fontSize: 13, fontWeight: '600' },
  analyzingCard: {
    backgroundColor: Colors.onyx,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  analyzingText: { fontSize: 16, fontWeight: '700', color: Colors.white },
  analyzingHint: { fontSize: 12, color: Colors.gray400 },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.coral,
  },
  errorText: {
    color: Colors.coral,
    fontSize: 14,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  resultHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, marginBottom: Spacing.md },
  resultName: { fontSize: 18, fontWeight: '700', color: Colors.onyx, letterSpacing: -0.3 },
  badgeRow: { flexDirection: 'row', marginTop: 6 },
  calBadge: {
    backgroundColor: Colors.onyx,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
  },
  calValue: { fontSize: 20, fontWeight: '700', color: Colors.acid },
  calUnit: { fontSize: 10, color: Colors.gray400 },
  macrosSection: { marginBottom: Spacing.md },
  ingredientsList: {},
  ingredientsTitle: { fontSize: 13, fontWeight: '600', color: Colors.gray400, textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.sm },
  ingredientPills: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  pill: {
    backgroundColor: Colors.cream2,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  pillText: { fontSize: 12, color: Colors.gray600 },
  savedBanner: {
    backgroundColor: 'rgba(200,255,71,0.15)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.acid,
  },
  savedText: { fontSize: 15, fontWeight: '700', color: Colors.onyx },
});
