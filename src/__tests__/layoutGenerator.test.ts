// Layout Generator - Test Suite (TDD RED)
import { generateLayout, checkSolvability } from '../utils/layoutGenerator';
import { isUnlocked } from '../utils/tileUnlock';
import { Difficulty } from '../types';
import { getAllSymbols } from '../constants/suits';
import { createSeededRandom } from '../utils/seedRandom';

describe('layoutGenerator', () => {
  describe('generateLayout', () => {
    it('should generate even tile count (paired symbols)', () => {
      const tiles = generateLayout({ level: 1, difficulty: 'easy', seed: 'test-easy' });
      
      expect(tiles.length % 2).toBe(0);
    });

    it('should generate correct tile count for easy difficulty', () => {
      const tiles = generateLayout({ level: 1, difficulty: 'easy', seed: 'test-easy' });
      
      // Easy: 36-48 tiles
      expect(tiles.length).toBeGreaterThanOrEqual(36);
      expect(tiles.length).toBeLessThanOrEqual(48);
    });

    it('should generate correct tile count for medium difficulty', () => {
      const tiles = generateLayout({ level: 4, difficulty: 'medium', seed: 'test-medium' });
      
      // Medium: 48-72 tiles
      expect(tiles.length).toBeGreaterThanOrEqual(48);
      expect(tiles.length).toBeLessThanOrEqual(72);
    });

    it('should generate correct tile count for hard difficulty', () => {
      const tiles = generateLayout({ level: 8, difficulty: 'hard', seed: 'test-hard' });
      
      // Hard: 72-144 tiles
      expect(tiles.length).toBeGreaterThanOrEqual(72);
      expect(tiles.length).toBeLessThanOrEqual(144);
    });

    it('should produce identical layout for same seed', () => {
      const layout1 = generateLayout({ level: 1, difficulty: 'easy', seed: 'level-1' });
      const layout2 = generateLayout({ level: 1, difficulty: 'easy', seed: 'level-1' });
      
      expect(layout1.length).toBe(layout2.length);
      
      // Compare tile positions and symbols
      for (let i = 0; i < layout1.length; i++) {
        expect(layout1[i].symbol).toBe(layout2[i].symbol);
        expect(layout1[i].position).toEqual(layout2[i].position);
      }
    });

    it('should have all tiles marked as not removed initially', () => {
      const tiles = generateLayout({ level: 1, difficulty: 'easy', seed: 'test' });
      
      for (const tile of tiles) {
        expect(tile.isRemoved).toBe(false);
      }
    });

    it('should place tiles with valid row/col/layer values', () => {
      const tiles = generateLayout({ level: 1, difficulty: 'easy', seed: 'test-valid' });
      
      for (const tile of tiles) {
        expect(tile.position.row).toBeGreaterThanOrEqual(0);
        expect(tile.position.col).toBeGreaterThanOrEqual(0);
        expect(tile.position.layer).toBeGreaterThanOrEqual(1);
      }
    });

    it('should generate unique symbol pairs', () => {
      const tiles = generateLayout({ level: 1, difficulty: 'easy', seed: 'test-pairs' });
      const symbolCounts: Record<string, number> = {};
      
      for (const tile of tiles) {
        symbolCounts[tile.symbol] = (symbolCounts[tile.symbol] || 0) + 1;
      }
      
      // Every symbol should appear exactly 2 times
      for (const count of Object.values(symbolCounts)) {
        expect(count).toBe(2);
      }
    });
  });

  describe('checkSolvability', () => {
    it('should return true when solvable board exists', () => {
      const tiles = generateLayout({ level: 1, difficulty: 'easy', seed: 'solvable-test' });
      
      const solvable = checkSolvability(tiles);
      
      expect(solvable).toBe(true);
    });

    it('should return true for empty board', () => {
      const solvable = checkSolvability([]);
      
      expect(solvable).toBe(true);
    });

    it('should return false for single tile', () => {
      const tiles = [
        { id: 't1', symbol: 'DOTS-1', position: { row: 0, col: 0, layer: 1 }, isRemoved: false },
      ];
      
      const solvable = checkSolvability(tiles);
      
      expect(solvable).toBe(false);
    });
  });

  describe('getUnlockedTiles', () => {
    it('should filter to only unlocked tiles', () => {
      const tiles = generateLayout({ level: 1, difficulty: 'easy', seed: 'unlocked-test' });
      
      // Import the function
      const { getUnlockedTiles } = require('../utils/layoutGenerator');
      const unlocked = getUnlockedTiles(tiles);
      
      // Should have at least some unlocked tiles
      expect(unlocked.length).toBeGreaterThan(0);
      
      // All returned should not be removed
      for (const tile of unlocked) {
        expect(tile.isRemoved).toBe(false);
      }
    });
  });

  describe('getRemovablePairs', () => {
    it('should return empty array for no matching pairs', () => {
      const { getRemovablePairs } = require('../utils/layoutGenerator');
      
      const tiles = [
        { id: 't1', symbol: 'DOTS-1', position: { row: 0, col: 0, layer: 1 }, isRemoved: false },
        { id: 't2', symbol: 'DOTS-2', position: { row: 0, col: 1, layer: 1 }, isRemoved: false },
      ];
      
      const pairs = getRemovablePairs(tiles);
      
      expect(pairs).toEqual([]);
    });

    it('should handle all removed tiles', () => {
      const { getRemovablePairs } = require('../utils/layoutGenerator');
      
      const tiles = [
        { id: 't1', symbol: 'DOTS-1', position: { row: 0, col: 0, layer: 1 }, isRemoved: true },
        { id: 't2', symbol: 'DOTS-1', position: { row: 0, col: 1, layer: 1 }, isRemoved: true },
      ];
      
      const pairs = getRemovablePairs(tiles);
      
      expect(pairs).toEqual([]);
    });
  });
});