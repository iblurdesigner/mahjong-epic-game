// Celestial Jade Design System - Colors
export const COLORS = {
  // Primary - Jade Green (from Celestial Jade)
  primary: '#14422d',
  primaryLight: '#1d5c41',
  primaryDark: '#0d2b1e',

  // Background - Ivory
  background: '#fdf9f4',
  backgroundSecondary: '#f5f0e8',

  // Accent - Rosewood/Brass
  accent: '#c9a227',
  accentLight: '#ddb84d',

  // Text
  textPrimary: '#14422d',
  textSecondary: '#5a4a3a',
  textLight: '#8a7a6a',

  // Tile colors
  tileBackground: '#fdf9f4',
  tileBorder: '#d4c4a4',
  tileShadow: '#8a7a6a',

  // States
  tileSelected: '#c9a227',
  tileLocked: '#a09080',
  tileBlocked: '#908070',

  // Feedback
  success: '#2d8a4e',
  error: '#a83232',
  warning: '#c9a227',

  // Transparent
  overlay: 'rgba(20, 66, 45, 0.85)',
} as const;

export type ColorKey = keyof typeof COLORS;