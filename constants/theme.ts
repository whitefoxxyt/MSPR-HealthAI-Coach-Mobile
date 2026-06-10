export const Colors = {
  // Backgrounds
  background: '#0F1117',
  surface: '#1A1D27',
  surface2: '#1F2333',
  cream: '#242840',
  cream2: '#2A2F47',

  // Brand
  acid: '#FF6B35',
  acidLight: '#3D2415',
  acidDark: '#E55A25',

  // Text
  text: '#E8E9F0',
  textSecondary: '#9DA3B4',
  textTertiary: '#5E6478',

  // Neutral
  onyx: '#0F1117',
  onyx2: '#1A1D27',
  gray100: '#242840',
  gray200: '#2E334D',
  gray400: '#5E6478',
  gray600: '#9DA3B4',
  gray800: '#C8CEDD',
  white: '#FFFFFF',

  // Semantic
  success: '#22C55E',
  successLight: '#0F2E1A',
  warning: '#F59E0B',
  warningLight: '#2D2008',
  error: '#EF4444',
  errorLight: '#2D0F0F',

  // Accents
  coral: '#FF6B35',
  coralLight: '#3D2415',
  sky: '#38BDF8',
  skyLight: '#0C2233',
  mint: '#2DD4BF',
  mintLight: '#0C2825',

  // Tab bar
  tabBar: '#0F1117',
  tabBarBorder: '#1A1D27',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  xxl: 64,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const Typography = {
  displayXL: { fontSize: 56, fontWeight: '700' as const, letterSpacing: -2, lineHeight: 60 },
  displayL: { fontSize: 40, fontWeight: '600' as const, letterSpacing: -1, lineHeight: 44 },
  h1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5, lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: '600' as const, letterSpacing: -0.3, lineHeight: 28 },
  h3: { fontSize: 17, fontWeight: '600' as const, lineHeight: 24 },
  bodyL: { fontSize: 16, fontWeight: '400' as const, lineHeight: 26 },
  bodyM: { fontSize: 14, fontWeight: '400' as const, lineHeight: 22 },
  bodyS: { fontSize: 13, fontWeight: '400' as const, lineHeight: 20 },
  label: { fontSize: 12, fontWeight: '500' as const, letterSpacing: 0.3 },
  caption: { fontSize: 11, fontWeight: '400' as const, lineHeight: 16 },
  metric: { fontSize: 44, fontWeight: '700' as const, letterSpacing: -2 },
};

export const Shadows = {
  xs: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.30,
    shadowRadius: 4,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.40,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.50,
    shadowRadius: 24,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.60,
    shadowRadius: 48,
    elevation: 8,
  },
};
