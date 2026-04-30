// Seeded Random Number Generator - Test Suite (TDD RED)
import { createSeededRandom, seededRandom } from '../utils/seedRandom';

describe('seedRandom', () => {
  describe('createSeededRandom', () => {
    it('should create a function that returns numbers between 0 and 1', () => {
      const random = createSeededRandom('test-seed');
      const value = random();
      
      expect(typeof value).toBe('number');
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    });

    it('should produce same sequence for same seed', () => {
      const random1 = createSeededRandom('level-1-easy');
      const random2 = createSeededRandom('level-1-easy');
      
      const values1 = [random1(), random1(), random1()];
      const values2 = [random2(), random2(), random2()];
      
      expect(values1).toEqual(values2);
    });

    it('should produce different sequences for different seeds', () => {
      const random1 = createSeededRandom('seed-1');
      const random2 = createSeededRandom('seed-2');
      
      const value1 = random1();
      const value2 = random2();
      
      // Very unlikely to be exactly equal
      expect(value1).not.toBe(value2);
    });

    it('should produce uniform distribution over many values', () => {
      const random = createSeededRandom('distribution-test');
      const values: number[] = [];
      
      // Generate 1000 values
      for (let i = 0; i < 1000; i++) {
        values.push(random());
      }
      
      // Calculate average (should be close to 0.5)
      const average = values.reduce((a, b) => a + b, 0) / values.length;
      
      // Allow 10% deviation
      expect(average).toBeGreaterThan(0.4);
      expect(average).toBeLessThan(0.6);
    });
  });

  describe('seededRandom (exported function)', () => {
    it('should return integer between min and max (exclusive)', () => {
      const result = seededRandom('test', 0, 10);
      
      expect(typeof result).toBe('number');
      expect(Number.isInteger(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(10);
    });

    it('should return same value for same seed and parameters', () => {
      const result1 = seededRandom('level-1', 0, 100);
      const result2 = seededRandom('level-1', 0, 100);
      
      expect(result1).toBe(result2);
    });
  });
});