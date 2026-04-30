// Game Context - Test Suite (TDD RED)
import { act, renderHook } from '@testing-library/react-native';
import { GameProvider, useGameContext, initialGameState, gameReducer } from '../contexts/GameContext';
import { GameAction, LevelConfig, GameState } from '../types';
import React from 'react';

const testLevelConfig: LevelConfig = {
  level: 1,
  difficulty: 'easy',
  seed: 'test-seed',
};

describe('GameContext', () => {
  describe('initialGameState', () => {
    it('should have correct initial values', () => {
      const state = initialGameState;
      
      expect(state.tiles).toEqual([]);
      expect(state.selectedTileId).toBeNull();
      expect(state.score).toBe(0);
      expect(state.elapsedSeconds).toBe(0);
      expect(state.status).toBe('idle');
      expect(state.levelConfig).toBeNull();
    });
  });

  describe('gameReducer', () => {
    it('should handle START_LEVEL action', () => {
      const action: GameAction = { type: 'START_LEVEL', payload: testLevelConfig };
      const newState = gameReducer(initialGameState, action);
      
      expect(newState.status).toBe('playing');
      expect(newState.levelConfig).toEqual(testLevelConfig);
      expect(newState.tiles.length).toBeGreaterThan(0);
    });

    it('should handle TICK action', () => {
      const playingState: GameState = {
        ...initialGameState,
        status: 'playing',
        levelConfig: testLevelConfig,
      };
      
      const action: GameAction = { type: 'TICK' };
      const newState = gameReducer(playingState, action);
      
      expect(newState.elapsedSeconds).toBe(1);
    });

    it('should handle PAUSE action', () => {
      const playingState: GameState = {
        ...initialGameState,
        status: 'playing',
        levelConfig: testLevelConfig,
      };
      
      const action: GameAction = { type: 'PAUSE' };
      const newState = gameReducer(playingState, action);
      
      expect(newState.status).toBe('paused');
    });

    it('should handle RESUME action', () => {
      const pausedState: GameState = {
        ...initialGameState,
        status: 'paused',
        levelConfig: testLevelConfig,
      };
      
      const action: GameAction = { type: 'RESUME' };
      const newState = gameReducer(pausedState, action);
      
      expect(newState.status).toBe('playing');
    });

    it('should handle RESET action', () => {
      const playingState: GameState = {
        ...initialGameState,
        status: 'playing',
        levelConfig: testLevelConfig,
        selectedTileId: 'tile-0',
        score: 100,
      };
      
      const action: GameAction = { type: 'RESET' };
      const newState = gameReducer(playingState, action);
      
      expect(newState.status).toBe('idle');
      expect(newState.selectedTileId).toBeNull();
      expect(newState.score).toBe(0);
    });
  });

  describe('useGameContext hook', () => {
    it('should provide initial state', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <GameProvider>{children}</GameProvider>
      );
      
      const { result } = renderHook(() => useGameContext(), { wrapper });
      
      expect(result.current.state).toEqual(initialGameState);
      expect(typeof result.current.dispatch).toBe('function');
    });

    it('should update state when dispatch is called', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <GameProvider>{children}</GameProvider>
      );
      
      const { result } = renderHook(() => useGameContext(), { wrapper });
      
      await act(async () => {
        result.current.dispatch({ 
          type: 'START_LEVEL', 
          payload: testLevelConfig 
        });
      });
      
      expect(result.current.state.status).toBe('playing');
      expect(result.current.state.tiles.length).toBeGreaterThan(0);
    });
  });
});