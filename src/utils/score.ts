// Score Calculation Utilities
import { Difficulty } from '../types';
import { getTimeLimit } from '../constants/difficulty';

/**
 * Calculate score after a match
 * @param currentScore - Current score
 * @param matchCount - Number of tile matches made
 * @returns New score
 */
export function calculateScore(currentScore: number, matchCount: number): number {
  const pointsPerMatch = 10;
  return currentScore + (matchCount * pointsPerMatch);
}

/**
 * Calculate bonus for consecutive matches (chain bonus)
 * @param consecutiveMatches - Number of consecutive matches without errors
 * @returns Bonus points
 */
export function calculateMatchBonus(consecutiveMatches: number): number {
  if (consecutiveMatches <= 1) return 0;
  
  // 5 points per consecutive match beyond the first
  return (consecutiveMatches - 1) * 5;
}

/**
 * Calculate time bonus based on remaining time
 * @param secondsRemaining - Seconds remaining on timer
 * @param difficulty - Current difficulty
 * @returns Bonus points
 */
export function calculateTimeBonus(secondsRemaining: number, difficulty: Difficulty): number {
  if (secondsRemaining <= 0) return 0;
  
  const timeLimit = getTimeLimit(difficulty);
  const percentageRemaining = secondsRemaining / timeLimit;
  
  if (percentageRemaining > 0.5) {
    // 50+ time remaining: 50 bonus
    return 50;
  } else if (percentageRemaining > 0.25) {
    // 25-50 time remaining: 25 bonus
    return 25;
  } else if (percentageRemaining > 0.1) {
    // 10-25 time remaining: 10 bonus
    return 10;
  }
  
  return 0;
}

/**
 * Calculate final score including all bonuses
 * @param baseScore - Score from matches
 * @param consecutiveMatches - Longest streak
 * @param secondsRemaining - Time remaining
 * @param difficulty - Difficulty level
 * @returns Final score
 */
export function calculateFinalScore(
  baseScore: number,
  consecutiveMatches: number,
  secondsRemaining: number,
  difficulty: Difficulty
): number {
  const matchBonus = calculateMatchBonus(consecutiveMatches);
  const timeBonus = calculateTimeBonus(secondsRemaining, difficulty);
  
  return baseScore + matchBonus + timeBonus;
}