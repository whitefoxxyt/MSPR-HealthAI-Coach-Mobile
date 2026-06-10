import type { MealAnalysis, Workout, ProgressEntry, NutritionPlan, DailyNutrition } from '@/types';

export const MOCK_MEALS: MealAnalysis[] = [
  {
    id: '1',
    date: new Date().toISOString(),
    name: 'Bol de quinoa & avocat',
    calories: 485,
    macros: { protein: 22, carbs: 58, fat: 18, fiber: 8 },
    ingredients: ['Quinoa', 'Avocat', 'Tomates cerises', 'Citron', 'Huile d\'olive'],
    aiSuggestion: 'Excellent choix post-entraînement ! Ce repas couvre 68% de tes besoins en protéines. Ajoute des graines de chia pour booster les fibres.',
    score: 88,
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString(),
    name: 'Oeufs brouillés & épinards',
    calories: 320,
    macros: { protein: 28, carbs: 12, fat: 20, fiber: 4 },
    ingredients: ['Oeufs', 'Épinards frais', 'Parmesan', 'Huile d\'olive'],
    aiSuggestion: 'Riche en protéines, parfait pour le matin. Considère d\'ajouter des glucides complexes pour plus d\'énergie.',
    score: 82,
  },
  {
    id: '3',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    name: 'Saumon grillé & légumes',
    calories: 540,
    macros: { protein: 42, carbs: 28, fat: 24, fiber: 6 },
    ingredients: ['Saumon', 'Brocoli', 'Carottes', 'Riz basmati', 'Citron'],
    aiSuggestion: 'Superbe source d\'oméga-3 ! Ce repas est parfaitement équilibré pour ta prise de masse musculaire.',
    score: 95,
  },
];

export const MOCK_WORKOUTS: Workout[] = [
  {
    id: '1',
    title: 'Upper Body Circuit',
    category: 'Force',
    level: 'Niveau 2',
    durationMinutes: 35,
    caloriesBurned: 280,
    completed: false,
    exercises: [
      { name: 'Pompes', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'Pectoraux' },
      { name: 'Dips', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'Triceps' },
      { name: 'Tractions', sets: 3, reps: '8-10', restSeconds: 90, muscleGroup: 'Dos' },
      { name: 'Curl biceps', sets: 3, reps: '12', restSeconds: 60, muscleGroup: 'Biceps' },
    ],
  },
  {
    id: '2',
    title: 'Full Body HIIT',
    category: 'Cardio',
    level: 'Niveau 1',
    durationMinutes: 25,
    caloriesBurned: 320,
    completed: true,
    date: new Date(Date.now() - 86400000).toISOString(),
    exercises: [
      { name: 'Burpees', sets: 4, reps: '30s', restSeconds: 30, muscleGroup: 'Corps entier' },
      { name: 'Mountain climbers', sets: 4, reps: '30s', restSeconds: 30, muscleGroup: 'Core' },
      { name: 'Squat sauts', sets: 4, reps: '30s', restSeconds: 30, muscleGroup: 'Jambes' },
      { name: 'Planche', sets: 3, reps: '45s', restSeconds: 30, muscleGroup: 'Core' },
    ],
  },
  {
    id: '3',
    title: 'Lower Body Strength',
    category: 'Force',
    level: 'Niveau 2',
    durationMinutes: 45,
    caloriesBurned: 350,
    completed: false,
    exercises: [
      { name: 'Squats', sets: 4, reps: '15', restSeconds: 90, muscleGroup: 'Quadriceps' },
      { name: 'Fentes', sets: 3, reps: '12/jambe', restSeconds: 60, muscleGroup: 'Fessiers' },
      { name: 'Deadlift roumain', sets: 3, reps: '12', restSeconds: 90, muscleGroup: 'Ischio-jambiers' },
      { name: 'Mollets', sets: 4, reps: '20', restSeconds: 45, muscleGroup: 'Mollets' },
    ],
  },
  {
    id: '4',
    title: 'Yoga & Mobilité',
    category: 'Récupération',
    level: 'Tous niveaux',
    durationMinutes: 30,
    caloriesBurned: 120,
    completed: false,
    exercises: [
      { name: 'Salutation au soleil', sets: 5, reps: 'flow', restSeconds: 0, muscleGroup: 'Corps entier' },
      { name: 'Pigeon pose', sets: 2, reps: '60s/côté', restSeconds: 30, muscleGroup: 'Hanches' },
      { name: 'Étirements dorsaux', sets: 3, reps: '45s', restSeconds: 15, muscleGroup: 'Dos' },
    ],
  },
];

export const WEEKLY_PLAN = [
  { day: 'Lun', workout: MOCK_WORKOUTS[0], done: true },
  { day: 'Mar', workout: MOCK_WORKOUTS[1], done: true },
  { day: 'Mer', workout: null, done: false },
  { day: 'Jeu', workout: MOCK_WORKOUTS[2], done: false },
  { day: 'Ven', workout: MOCK_WORKOUTS[0], done: false },
  { day: 'Sam', workout: MOCK_WORKOUTS[3], done: false },
  { day: 'Dim', workout: null, done: false },
];

export const MOCK_PROGRESS: ProgressEntry[] = Array.from({ length: 14 }, (_, i) => ({
  date: new Date(Date.now() - (13 - i) * 86400000).toISOString(),
  weight: 78 - i * 0.2 + (Math.random() - 0.5) * 0.3,
  calories: 1800 + Math.floor(Math.random() * 600),
  workoutCompleted: Math.random() > 0.3,
}));

export const MOCK_NUTRITION_PLAN: NutritionPlan = {
  id: '1',
  name: 'Plan prise de masse',
  description: 'Adapté à ton objectif et tes préférences alimentaires',
  dailyCalories: 2400,
  meals: [
    {
      type: 'Petit-déjeuner',
      name: 'Porridge protéiné & fruits rouges',
      calories: 480,
      macros: { protein: 28, carbs: 62, fat: 12, fiber: 8 },
    },
    {
      type: 'Déjeuner',
      name: 'Poulet grillé, riz & légumes verts',
      calories: 680,
      macros: { protein: 52, carbs: 72, fat: 14, fiber: 10 },
    },
    {
      type: 'Collation',
      name: 'Yaourt grec & amandes',
      calories: 280,
      macros: { protein: 20, carbs: 18, fat: 14, fiber: 2 },
    },
    {
      type: 'Dîner',
      name: 'Saumon, patate douce & brocoli',
      calories: 620,
      macros: { protein: 45, carbs: 58, fat: 18, fiber: 9 },
    },
    {
      type: 'Pré-entraînement',
      name: 'Banane & beurre d\'amande',
      calories: 220,
      macros: { protein: 6, carbs: 32, fat: 8, fiber: 3 },
    },
  ],
};

export const MOCK_TODAY: DailyNutrition = {
  date: new Date().toISOString(),
  totalCalories: 1840,
  targetCalories: 2400,
  macros: { protein: 118, carbs: 220, fat: 48, fiber: 28 },
  targetMacros: { protein: 160, carbs: 280, fat: 80, fiber: 35 },
  meals: MOCK_MEALS.slice(0, 2),
};

export const AI_SUGGESTIONS = [
  'Tu es à 340 kcal de ton objectif. Une collation riche en protéines serait idéale avant ta séance de ce soir.',
  'Ton apport en fibres est légèrement faible aujourd\'hui. Pense à ajouter des légumes verts à ton prochain repas.',
  'Bravo ! Tu as complété 4 séances cette semaine. Ton corps mérite une journée de récupération active.',
  'Ton score nutritionnel moyen cette semaine est de 84/100. Continue sur cette lancée !',
];

export const GOAL_OPTIONS = [
  { id: 'weight_loss', label: 'Perte de poids', description: 'Réduire la masse grasse progressivement', icon: '⚡' },
  { id: 'muscle_gain', label: 'Prise de masse', description: 'Développer la musculature', icon: '💪' },
  { id: 'endurance', label: 'Endurance', description: 'Améliorer les performances cardio', icon: '🏃' },
  { id: 'balance', label: 'Équilibre nutritionnel', description: 'Adopter une alimentation saine', icon: '🥗' },
  { id: 'general_health', label: 'Santé générale', description: 'Bien-être global au quotidien', icon: '❤️' },
];

export const ACTIVITY_OPTIONS = [
  { id: 'sedentary', label: 'Sédentaire', description: 'Peu ou pas d\'activité physique', icon: '🪑' },
  { id: 'light', label: 'Légèrement actif', description: '1 à 3 séances par semaine', icon: '🚶' },
  { id: 'moderate', label: 'Modérément actif', description: '3 à 5 séances par semaine', icon: '🚴' },
  { id: 'active', label: 'Très actif', description: '6 à 7 séances par semaine', icon: '🏋️' },
  { id: 'very_active', label: 'Athlète', description: 'Entraînements intensifs quotidiens', icon: '🏆' },
];

export const DIET_OPTIONS = [
  { id: 'omnivore', label: 'Omnivore' },
  { id: 'vegetarian', label: 'Végétarien' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'pescatarian', label: 'Pescétarien' },
  { id: 'keto', label: 'Keto' },
  { id: 'gluten_free', label: 'Sans gluten' },
];

export const ALLERGY_OPTIONS = [
  'Gluten', 'Lactose', 'Arachides', 'Fruits à coque', 'Oeufs', 'Poisson', 'Crustacés', 'Soja',
];

export const SPORT_OPTIONS = [
  'Course à pied', 'Musculation', 'Yoga', 'Natation', 'Cyclisme', 'HIIT', 'Boxe', 'Pilates', 'Escalade', 'Football',
];

export const EQUIPMENT_OPTIONS = [
  'Aucun équipement', 'Haltères', 'Barre de traction', 'Élastiques', 'Tapis', 'Vélo', 'Salle de sport',
];
