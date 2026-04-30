// Difficulty configurations for levels
import { Difficulty, DifficultyConfig } from '../types';

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    tileCountMin: 36,
    tileCountMax: 48,
    layersMin: 1,
    layersMax: 2,
    symbolVarietyMin: 9,
    symbolVarietyMax: 12,
    timeSeconds: 300, // 5 minutes
  },
  medium: {
    tileCountMin: 48,
    tileCountMax: 72,
    layersMin: 2,
    layersMax: 2,
    symbolVarietyMin: 12,
    symbolVarietyMax: 18,
    timeSeconds: 360, // 6 minutes
  },
  hard: {
    tileCountMin: 72,
    tileCountMax: 144,
    layersMin: 2,
    layersMax: 3,
    symbolVarietyMin: 18,
    symbolVarietyMax: 34,
    timeSeconds: 420, // 7 minutes
  },
};

// Get difficulty for level number
export function getDifficultyForLevel(level: number): Difficulty {
  if (level <= 3) return 'easy';
  if (level <= 7) return 'medium';
  return 'hard';
}

// Get time limit for difficulty
export function getTimeLimit(difficulty: Difficulty): number {
  return DIFFICULTY_CONFIGS[difficulty].timeSeconds;
}