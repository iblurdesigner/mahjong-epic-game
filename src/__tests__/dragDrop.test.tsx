// Drag-Drop Functionality - Test Suite (Strict TDD - RED phase)
import { gameReducer, initialGameState } from '../contexts/GameContext';
import type { GameState, Tile } from '../types';
import { isUnlocked } from '../utils/tileUnlock';

// Helper to create test tiles
const createTestTile = (overrides: Partial<Tile> = {}): Tile => ({
  id: 'tile-1',
  symbol: 'DOTS-1',
  position: { row: 0, col: 0, layer: 1 },
  isRemoved: false,
  ...overrides,
});

describe('GameContext - Drag-Drop Reducer Actions', () => {
  describe('START_DRAG', () => {
    it('should set draggingTileId when game is playing and tile is unlocked', () => {
      // Create a tile that is clearly unlocked:
      // - At col 6 (middle of board, so both sides can be free)
      // - Layer 0 (no tiles above)
      // - No adjacent tiles in same layer
      const playingState: GameState = {
        ...initialGameState,
        status: 'playing',
        tiles: [
          createTestTile({ 
            id: 'tile-1', 
            position: { row: 0, col: 6, layer: 0 } 
          }),
        ],
      };
      
      const action = { type: 'START_DRAG' as const, payload: { tileId: 'tile-1' } };
      const newState = gameReducer(playingState, action);
      
      expect(newState.draggingTileId).toBe('tile-1');
    });

    it('should NOT set draggingTileId when game is paused', () => {
      const pausedState: GameState = {
        ...initialGameState,
        status: 'paused',
        tiles: [createTestTile({ id: 'tile-1' })],
      };
      
      const action = { type: 'START_DRAG' as const, payload: { tileId: 'tile-1' } };
      const newState = gameReducer(pausedState, action);
      
      expect(newState.draggingTileId).toBeNull();
    });

    it('should NOT set draggingTileId when game is gameover', () => {
      const gameoverState: GameState = {
        ...initialGameState,
        status: 'gameover',
        tiles: [createTestTile({ id: 'tile-1' })],
      };
      
      const action = { type: 'START_DRAG' as const, payload: { tileId: 'tile-1' } };
      const newState = gameReducer(gameoverState, action);
      
      expect(newState.draggingTileId).toBeNull();
    });

    it('should NOT set draggingTileId when game is won', () => {
      const wonState: GameState = {
        ...initialGameState,
        status: 'won',
        tiles: [createTestTile({ id: 'tile-1' })],
      };
      
      const action = { type: 'START_DRAG' as const, payload: { tileId: 'tile-1' } };
      const newState = gameReducer(wonState, action);
      
      expect(newState.draggingTileId).toBeNull();
    });
  });

  describe('END_DRAG', () => {
    it('should clear draggingTileId on END_DRAG', () => {
      const draggingState: GameState = {
        ...initialGameState,
        status: 'playing',
        draggingTileId: 'tile-1',
      };
      
      const action = { type: 'END_DRAG' as const };
      const newState = gameReducer(draggingState, action);
      
      expect(newState.draggingTileId).toBeNull();
    });
  });

  describe('MOVE_TILE', () => {
    it('should update tile position on MOVE_TILE', () => {
      const state: GameState = {
        ...initialGameState,
        status: 'playing',
        tiles: [createTestTile({ id: 'tile-1', position: { row: 0, col: 0, layer: 1 } })],
      };
      
      const action = { 
        type: 'MOVE_TILE' as const, 
        payload: { tileId: 'tile-1', row: 2, col: 3 } 
      };
      const newState = gameReducer(state, action);
      
      const movedTile = newState.tiles.find(t => t.id === 'tile-1');
      expect(movedTile?.position.row).toBe(2);
      expect(movedTile?.position.col).toBe(3);
      expect(movedTile?.position.layer).toBe(1); // layer unchanged
    });

    it('should clear draggingTileId on MOVE_TILE', () => {
      const state: GameState = {
        ...initialGameState,
        status: 'playing',
        draggingTileId: 'tile-1',
        tiles: [createTestTile({ id: 'tile-1' })],
      };
      
      const action = { 
        type: 'MOVE_TILE' as const, 
        payload: { tileId: 'tile-1', row: 2, col: 3 } 
      };
      const newState = gameReducer(state, action);
      
      expect(newState.draggingTileId).toBeNull();
    });
  });
});
