// Score Utility - Test Suite (TDD RED)
import { calculateScore, calculateMatchBonus, calculateTimeBonus } from '../utils/score';
import { Difficulty } from '../types';

describe('score', () => {
  describe('calculateScore', () => {
    it('should add 10 points per match', () => {
      const result = calculateScore(0, 1);
      
      expect(result).toBe(10);
    });

    it('should accumulate score across multiple matches', () => {
      const result = calculateScore(30, 4);
      
      // 30 previous + (4 matches * 10) = 70
      expect(result).toBe(70);
    });

    it('should start from 0 for first match', () => {
      const result = calculateScore(0, 1);
      
      expect(result).toBe(10);
    });
  });

  describe('calculateMatchBonus', () => {
    it('should return 0 for no matches', () => {
      const result = calculateMatchBonus(0);
      
      expect(result).toBe(0);
    });

    it('should return 0 for single match', () => {
      const result = calculateMatchBonus(1);
      
      expect(result).toBe(0);
    });

    it('should calculate bonus for consecutive matches', () => {
      const result = calculateMatchBonus(3);
      
      // (3-1) * 5 = 10 bonus
      expect(result).toBe(10);
    });
  });

  describe('calculateTimeBonus', () => {
    it('should return 0 when no time remaining', () => {
      const result = calculateTimeBonus(0, 'easy');
      
      expect(result).toBe(0);
    });

    it('should return 0 when negative time', () => {
      const result = calculateTimeBonus(-10, 'easy');
      
      expect(result).toBe(0);
    });

    it('should return 50 bonus for >50% time remaining', () => {
      // easy: 300 seconds, >50% = >150 seconds
      const result = calculateTimeBonus(200, 'easy');
      
      expect(result).toBe(50);
    });

    it('should return 25 bonus for 25-50% time remaining', () => {
      // easy: 300 seconds, 25-50% = 75-150 seconds
      const result = calculateTimeBonus(100, 'easy');
      
      expect(result).toBe(25);
    });

    it('should return 10 bonus for 10-25% time remaining', () => {
      // easy: 300 seconds, 10-25% = 30-75 seconds
      const result = calculateTimeBonus(50, 'easy');
      
      expect(result).toBe(10);
    });

    it('should return 0 for <10% time remaining', () => {
      // easy: 300 seconds, <10% = <30 seconds
      const result = calculateTimeBonus(20, 'easy');
      
      expect(result).toBe(0);
    });

    it('should return higher bonus for more time remaining', () => {
      const bonusLow = calculateTimeBonus(30, 'easy');
      const bonusHigh = calculateTimeBonus(300, 'easy');
      
      expect(bonusHigh).toBeGreaterThan(bonusLow);
    });

    it('should work with hard difficulty', () => {
      // hard: 420 seconds, >50% = >210 seconds
      const result = calculateTimeBonus(300, 'hard');
      
      expect(result).toBe(50);
    });
  });
});