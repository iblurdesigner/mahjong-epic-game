// Celestial Jade Design System - Dimensions
export const DIMENSIONS = {
  // Touch targets (accessibility minimum)
  touchTargetMin: 64,

  // Tile dimensions - DOBLE tamaño para adultos mayores
  tileWidth: 160,
  tileHeight: 212,
  tileDepth: 16, // 3D layer offset

  // Tile spacing
  tileMargin: 6,
  tilePadding: 8,

  // Layer offset (visual depth)
  layerOffsetX: 10,
  layerOffsetY: -10,

  // Board
  boardPadding: 32,
  boardMaxWidth: 1600,

  // Screen
  screenPadding: 24,

  // Button
  buttonHeight: 80,
  buttonMinWidth: 280,
  buttonRadius: 20,

  // Card
  cardRadius: 24,
  cardPadding: 32,

  // Timer
  timerFontSize: 64,
  timerFontSizeSmall: 48,

  // Header
  headerHeight: 80,
} as const;

export type DimensionKey = keyof typeof DIMENSIONS;