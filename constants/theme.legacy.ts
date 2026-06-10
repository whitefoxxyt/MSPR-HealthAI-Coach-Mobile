export const LegacyColors = {
  // Backgrounds
  background: '#FAFAF8',
  surface: '#FFFFFF',
  surface2: '#F5F1EA',
  cream: '#F5F0E8',
  cream2: '#EDE7D9',

  // Brand
  acid: '#C8FF47',
  acidLight: '#EDFFC5',
  acidDark: '#9ED626',

  // Text
  text: '#1C1917',
  textSecondary: '#78716C',
  textTertiary: '#A8A29E',

  // Neutral
  onyx: '#1C1917',
  onyx2: '#292524',
  gray100: '#F5F0E8',
  gray200: '#E7E0D5',
  gray400: '#A8A29E',
  gray600: '#78716C',
  gray800: '#44403C',
  white: '#FFFFFF',

  // Semantic
  success: '#22C55E',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',

  // Accents
  coral: '#FF6B4A',
  coralLight: '#FFE8E3',
  sky: '#06B6D4',
  skyLight: '#CFFAFE',
  mint: '#10B981',
  mintLight: '#D1FAE5',

  // Tab bar
  tabBar: '#1C1917',
  tabBarBorder: '#292524',
};

export const LegacySpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  xxl: 64,
};

export const LegacyRadius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const LegacyTypography = {
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

export const LegacyShadows = {
  xs: {
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sm: {
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  lg: {
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 48,
    elevation: 8,
  },
};

