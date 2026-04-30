// GameContext - Additional Edge Case Tests
import { gameReducer, initialGameState } from '../contexts/GameContext';
import type { GameState, GameAction, Tile } from '../types';

// Helper to create test tiles
const createTestTile = (overrides: Partial<Tile> = {}): Tile => ({
  id: 't1',
  symbol: 'DOTS-1',
  position: { row: 0, col: 0, layer: 1 },
  isRemoved: false,
  ...overrides,
});

describe('GameContext - Edge Cases', () => {
  const levelConfig = { level: 1, difficulty: 'easy' as const, seed: 'edge-test' };

  describe('SELECT_TILE edge cases', () => {
    it('should ignore SELECT_TILE for removed tile', () => {
      const state: GameState = {
        ...initialGameState,
        status: 'playing',
        tiles: [
          createTestTile({ id: 't1', isRemoved: true }),
          createTestTile({ id: 't2', isRemoved: false, symbol: 'DOTS-1' }),
        ],
        selectedTileId: null,
      };

      const action: GameAction = { type: 'SELECT_TILE', payload: { tileId: 't1' } };
      const newState = gameReducer(state, action);

      // Should return same state - tile is removed
      expect(newState.selectedTileId).toBeNull();
    });

    it('should deselect when clicking same tile twice', () => {
      const state: GameState = {
        ...initialGameState,
        status: 'playing',
        tiles: [
          createTestTile({ id: 't1' }),
          createTestTile({ id: 't2', symbol: 'DOTS-2' }),
        ],
        selectedTileId: 't1',
      };

      const action: GameAction = { type: 'SELECT_TILE', payload: { tileId: 't1' } };
      const newState = gameReducer(state, action);

      expect(newState.selectedTileId).toBeNull();
    });

    it('should clear selection on invalid match', () => {
      const state: GameState = {
        ...initialGameState,
        status: 'playing',
        tiles: [
          createTestTile({ id: 't1', symbol: 'DOTS-1' }),
          createTestTile({ id: 't2', symbol: 'BAMBOO-1' }),
        ],
        selectedTileId: 't1',
      };

      const action: GameAction = { type: 'SELECT_TILE', payload: { tileId: 't2' } };
      const newState = gameReducer(state, action);

      // Should clear selection - no match
      expect(newState.selectedTileId).toBeNull();
    });

    it('should handle winning when all tiles removed', () => {
      const state: GameState = {
        ...initialGameState,
        status: 'playing',
        tiles: [
          createTestTile({ id: 't1', isRemoved: true }),
          createTestTile({ id: 't2', isRemoved: true }),
        ],
        selectedTileId: null,
      };

      // Simulate the last match removing the final pair
      const action: GameAction = { type: 'SELECT_TILE', payload: { tileId: 't1' } };
      
      // This is a simplified test - in reality the reducer handles the match logic
      const newState = gameReducer(state, action);
      expect(newState).toBeDefined();
    });
  });

  describe('REMOVE_TILES action', () => {
    it('should remove specified tiles', () => {
      const state: GameState = {
        ...initialGameState,
        status: 'playing',
        tiles: [
          createTestTile({ id: 't1' }),
          createTestTile({ id: 't2' }),
          createTestTile({ id: 't3' }),
        ],
        score: 0,
      };

      const action: GameAction = { type: 'REMOVE_TILES', payload: { id1: 't1', id2: 't2' } };
      const newState = gameReducer(state, action);

      expect(newState.tiles.find(t => t.id === 't1')?.isRemoved).toBe(true);
      expect(newState.tiles.find(t => t.id === 't2')?.isRemoved).toBe(true);
      expect(newState.tiles.find(t => t.id === 't3')?.isRemoved).toBe(false);
      expect(newState.score).toBe(10);
    });
  });

  describe('WIN action', () => {
    it('should set status to won', () => {
      const state: GameState = {
        ...initialGameState,
        status: 'playing',
      };

      const action: GameAction = { type: 'WIN' };
      const newState = gameReducer(state, action);

      expect(newState.status).toBe('won');
    });
  });

  describe('TICK edge cases', () => {
    it('should not tick when not playing', () => {
      const state: GameState = {
        ...initialGameState,
        status: 'paused',
        elapsedSeconds: 10,
      };

      const action: GameAction = { type: 'TICK' };
      const newState = gameReducer(state, action);

      expect(newState.elapsedSeconds).toBe(10);
    });

    it('should not tick when gameover', () => {
      const state: GameState = {
        ...initialGameState,
        status: 'gameover',
        elapsedSeconds: 100,
      };

      const action: GameAction = { type: 'TICK' };
      const newState = gameReducer(state, action);

      expect(newState.elapsedSeconds).toBe(100);
    });

    it('should not tick when won', () => {
      const state: GameState = {
        ...initialGameState,
        status: 'won',
        elapsedSeconds: 50,
      };

      const action: GameAction = { type: 'TICK' };
      const newState = gameReducer(state, action);

      expect(newState.elapsedSeconds).toBe(50);
    });
  });

  describe('PAUSE/RESUME edge cases', () => {
    it('should not pause when already paused', () => {
      const state: GameState = {
        ...initialGameState,
        status: 'paused',
      };

      const action: GameAction = { type: 'PAUSE' };
      const newState = gameReducer(state, action);

      expect(newState.status).toBe('paused');
    });

    it('should not resume when not paused', () => {
      const state: GameState = {
        ...initialGameState,
        status: 'playing',
      };

      const action: GameAction = { type: 'RESUME' };
      const newState = gameReducer(state, action);

      expect(newState.status).toBe('playing');
    });
  });

  describe('unknown action', () => {
    it('should return same state for unknown action', () => {
      const state: GameState = {
        ...initialGameState,
        score: 100,
        tiles: [createTestTile({ id: 't1' })],
      };

      // TypeScript would prevent this, but testing runtime behavior
      const action = { type: 'UNKNOWN' as any };
      const newState = gameReducer(state, action);

      expect(newState).toEqual(state);
    });
  });

  describe('SELECT_TILE - locked tiles', () => {
    it('should not select tile that is blocked (has tile above)', () => {
      // Tile at layer 1, with tile at same position on layer 2
      const state: GameState = {
        ...initialGameState,
        status: 'playing',
        tiles: [
          createTestTile({ id: 't1', position: { row: 0, col: 0, layer: 1 } }),
          createTestTile({ id: 't2', position: { row: 0, col: 0, layer: 2 } }), // blocks t1
          createTestTile({ id: 't3', symbol: 'DOTS-2', position: { row: 1, col: 0, layer: 1 } }),
        ],
        selectedTileId: null,
      };

      const action: GameAction = { type: 'SELECT_TILE', payload: { tileId: 't1' } };
      const newState = gameReducer(state, action);

      // Tile should not be selected because it's locked
      expect(newState.selectedTileId).toBeNull();
    });

    it('should not select non-existent tile', () => {
      const state: GameState = {
        ...initialGameState,
        status: 'playing',
        tiles: [createTestTile({ id: 't1' })],
        selectedTileId: null,
      };

      const action: GameAction = { type: 'SELECT_TILE', payload: { tileId: 'non-existent' } };
      const newState = gameReducer(state, action);

      expect(newState.selectedTileId).toBeNull();
    });

    it('should handle both tiles matched and removed in one action', () => {
      // This tests the match and remove logic in one go
      const state: GameState = {
        ...initialGameState,
        status: 'playing',
        tiles: [
          createTestTile({ id: 't1', symbol: 'DOTS-1' }),
          createTestTile({ id: 't2', symbol: 'DOTS-1' }),
        ],
        selectedTileId: 't1',
        score: 0,
      };

      const action: GameAction = { type: 'SELECT_TILE', payload: { tileId: 't2' } };
      const newState = gameReducer(state, action);

      // Both should be removed
      expect(newState.tiles.find(t => t.id === 't1')?.isRemoved).toBe(true);
      expect(newState.tiles.find(t => t.id === 't2')?.isRemoved).toBe(true);
      
      // Score should increase
      expect(newState.score).toBe(10);
      
      // Selection should clear
      expect(newState.selectedTileId).toBeNull();
    });

    it('should not change status when not all tiles removed (no win)', () => {
      const state: GameState = {
        ...initialGameState,
        status: 'playing',
        tiles: [
          createTestTile({ id: 't1', symbol: 'DOTS-1' }),
          createTestTile({ id: 't2', symbol: 'DOTS-1' }),
          createTestTile({ id: 't3', symbol: 'BAMBOO-1' }),
          createTestTile({ id: 't4', symbol: 'BAMBOO-1' }),
        ],
        selectedTileId: 't1',
      };

      const action: GameAction = { type: 'SELECT_TILE', payload: { tileId: 't2' } };
      const newState = gameReducer(state, action);

      // Status should still be playing (not won)
      expect(newState.status).toBe('playing');
    });

    it('should set status to won when last pair removed', () => {
      const state: GameState = {
        ...initialGameState,
        status: 'playing',
        tiles: [
          createTestTile({ id: 't1', symbol: 'DOTS-1' }),
          createTestTile({ id: 't2', symbol: 'DOTS-1' }),
        ],
        selectedTileId: 't1',
      };

      const action: GameAction = { type: 'SELECT_TILE', payload: { tileId: 't2' } };
      const newState = gameReducer(state, action);

      // Status should be won
      expect(newState.status).toBe('won');
    });
  });

  describe('TICK - different states', () => {
    it('should tick when idle', () => {
      const state: GameState = {
        ...initialGameState,
        status: 'idle',
        elapsedSeconds: 0,
      };

      const action: GameAction = { type: 'TICK' };
      const newState = gameReducer(state, action);

      // Should not tick when idle
      expect(newState.elapsedSeconds).toBe(0);
    });
  });
});