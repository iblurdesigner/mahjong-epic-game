// Celestial Jade Design System - Typography
import { TextStyle } from 'react-native';

export const TYPOGRAPHY = {
  // Font families
  fontFamily: {
    primary: 'System',
    serif: 'Serif',
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },

  // Font weights
  fontWeight: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
} as const;

export type TypographyKey = keyof typeof TYPOGRAPHY;

// Text style presets
export const TEXT_PRESETS = {
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: '#14422d',
  } as TextStyle,

  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: '#5a4a3a',
  } as TextStyle,

  body: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    color: '#14422d',
  } as TextStyle,

  bodySecondary: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    color: '#5a4a3a',
  } as TextStyle,

  button: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  } as TextStyle,

  caption: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    color: '#8a7a6a',
  } as TextStyle,
} as const;