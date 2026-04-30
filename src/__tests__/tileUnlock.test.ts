// Tile Unlock Rules - Test Suite (TDD RED)
import { Tile, TilePosition } from '../types';
import { hasTileAbove, isLeftFree, isRightFree, isUnlocked } from '../utils/tileUnlock';

// Helper to create test tiles
function createTile(id: string, row: number, col: number, layer: number, symbol = 'DOTS-1'): Tile {
  return {
    id,
    symbol,
    position: { row, col, layer },
    isRemoved: false,
  };
}

// Test wrapper functions to export for testing
function testHasTileAbove(tile: Tile, allTiles: Tile[]): boolean {
  return hasTileAbove(tile, allTiles);
}

function testIsLeftFree(tile: Tile, allTiles: Tile[]): boolean {
  return isLeftFree(tile, allTiles);
}

function testIsRightFree(tile: Tile, allTiles: Tile[]): boolean {
  return isRightFree(tile, allTiles);
}

function testIsUnlocked(tile: Tile, allTiles: Tile[]): boolean {
  return isUnlocked(tile, allTiles);
}

describe('tileUnlock', () => {
  describe('hasTileAbove', () => {
    it('should return true when tile has another tile directly above it', () => {
      // GIVEN: tile T1 at layer 1, row 5, col 5
      const t1 = createTile('t1', 5, 5, 1);
      // AND: tile T2 at layer 2, row 5, col 5 (directly above T1)
      const t2 = createTile('t2', 5, 5, 2);
      const allTiles = [t1, t2];

      // WHEN: checking if tile has tile above
      // THEN: returns true
      expect(testHasTileAbove(t1, allTiles)).toBe(true);
    });

    it('should return false when no tile is directly above', () => {
      // GIVEN: tile T1 at layer 1, row 5, col 5
      const t1 = createTile('t1', 5, 5, 1);
      // AND: no tile at layer 2, row 5, col 5
      const allTiles = [t1];

      // THEN: returns false
      expect(testHasTileAbove(t1, allTiles)).toBe(false);
    });

    it('should return false for tile at topmost layer', () => {
      // GIVEN: tile at layer 3 (topmost)
      const t1 = createTile('t1', 5, 5, 3);
      const allTiles = [t1];

      expect(testHasTileAbove(t1, allTiles)).toBe(false);
    });
  });

  describe('isLeftFree', () => {
    it('should return false when left side is blocked by another tile', () => {
      // GIVEN: tile T1 at row 5, col 5
      const t1 = createTile('t1', 5, 5, 1);
      // AND: tile at row 5, col 4 (left blocked)
      const t2 = createTile('t2', 5, 4, 1);
      const allTiles = [t1, t2];

      expect(testIsLeftFree(t1, allTiles)).toBe(false);
    });

    it('should return true when left side is empty', () => {
      // GIVEN: tile T1 at row 5, col 5
      const t1 = createTile('t1', 5, 5, 1);
      // AND: position row 5, col 4 is empty
      const allTiles = [t1];

      expect(testIsLeftFree(t1, allTiles)).toBe(true);
    });

    it('should return false for leftmost edge column (col 0)', () => {
      // GIVEN: tile at col 0 (leftmost edge)
      const t1 = createTile('t1', 5, 0, 1);
      const allTiles = [t1];

      // THEN: left side is considered blocked
      expect(testIsLeftFree(t1, allTiles)).toBe(false);
    });
  });

  describe('isRightFree', () => {
    it('should return false when right side is blocked by another tile', () => {
      // GIVEN: tile T1 at row 5, col 5
      const t1 = createTile('t1', 5, 5, 1);
      // AND: tile at row 5, col 6 (right blocked)
      const t2 = createTile('t2', 5, 6, 1);
      const allTiles = [t1, t2];

      expect(testIsRightFree(t1, allTiles)).toBe(false);
    });

    it('should return true when right side is empty', () => {
      // GIVEN: tile T1 at row 5, col 5
      const t1 = createTile('t1', 5, 5, 1);
      // AND: position row 5, col 6 is empty
      const allTiles = [t1];

      expect(testIsRightFree(t1, allTiles)).toBe(true);
    });

    it('should return false for rightmost edge column', () => {
      // GIVEN: tile at col 12 (rightmost edge)
      const t1 = createTile('t1', 5, 12, 1);
      const allTiles = [t1];

      expect(testIsRightFree(t1, allTiles)).toBe(false);
    });
  });

  describe('isUnlocked', () => {
    it('should return false when tile has tile above', () => {
      // GIVEN: tile T1 at layer 1, row 5, col 5
      const t1 = createTile('t1', 5, 5, 1);
      // AND: tile T2 at layer 2, row 5, col 5 (directly above)
      const t2 = createTile('t2', 5, 5, 2);
      // AND: left and right are free
      const allTiles = [t1, t2];

      expect(testIsUnlocked(t1, allTiles)).toBe(false);
    });

    it('should return false when both sides are blocked', () => {
      // GIVEN: tile T1 at row 5, col 5, layer 1
      const t1 = createTile('t1', 5, 5, 1);
      // AND: tile at row 5, col 4 (left blocked)
      const t2 = createTile('t2', 5, 4, 1);
      // AND: tile at row 5, col 6 (right blocked)
      const t3 = createTile('t3', 5, 6, 1);
      // AND: no tile above
      const allTiles = [t1, t2, t3];

      expect(testIsUnlocked(t1, allTiles)).toBe(false);
    });

    it('should return true when left side is free and no tile above', () => {
      // GIVEN: tile T1 at row 5, col 5, layer 1
      const t1 = createTile('t1', 5, 5, 1);
      // AND: tile at row 5, col 6 blocks right side
      const t2 = createTile('t2', 5, 6, 1);
      // AND: position row 5, col 4 is empty
      // AND: no tile above
      const allTiles = [t1, t2];

      expect(testIsUnlocked(t1, allTiles)).toBe(true);
    });

    it('should return true when right side is free and no tile above', () => {
      // GIVEN: tile T1 at row 5, col 5, layer 1
      const t1 = createTile('t1', 5, 5, 1);
      // AND: tile at row 5, col 4 blocks left side
      const t2 = createTile('t2', 5, 4, 1);
      // AND: position row 5, col 6 is empty
      // AND: no tile above
      const allTiles = [t1, t2];

      expect(testIsUnlocked(t1, allTiles)).toBe(true);
    });
  });
});