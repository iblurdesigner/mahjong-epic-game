// Hooks - Test Suite
import { renderHook, act } from '@testing-library/react-native';
import { GameProvider, useGameContext } from '../../contexts/GameContext';
import { useGameState } from '../../hooks/useGameState';
import type { LevelConfig } from '../../types';
import React from 'react';

describe('useGameState hook', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <GameProvider>{children}</GameProvider>
  );

  beforeEach(() => {
    // Reset state before each test by dispatching RESET
  });

  describe('state access', () => {
    it('should provide initial state', () => {
      const { result } = renderHook(() => useGameState(), { wrapper });
      
      expect(result.current.tiles).toEqual([]);
      expect(result.current.selectedTileId).toBeNull();
      expect(result.current.score).toBe(0);
      expect(result.current.elapsedSeconds).toBe(0);
      expect(result.current.status).toBe('idle');
      expect(result.current.levelConfig).toBeNull();
    });

    it('should provide action functions', () => {
      const { result } = renderHook(() => useGameState(), { wrapper });
      
      expect(typeof result.current.startLevel).toBe('function');
      expect(typeof result.current.selectTile).toBe('function');
      expect(typeof result.current.pause).toBe('function');
      expect(typeof result.current.resume).toBe('function');
      expect(typeof result.current.tick).toBe('function');
      expect(typeof result.current.gameOver).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });
  });

  describe('actions', () => {
    it('should start level with startLevel action', async () => {
      const { result } = renderHook(() => useGameState(), { wrapper });
      
      const config: LevelConfig = { level: 1, difficulty: 'easy', seed: 'hook-test' };
      
      await act(async () => {
        result.current.startLevel(config);
      });
      
      expect(result.current.status).toBe('playing');
      expect(result.current.tiles.length).toBeGreaterThan(0);
    });

    it('should pause with pause action', async () => {
      const { result } = renderHook(() => useGameState(), { wrapper });
      
      // Start first
      await act(async () => {
        result.current.startLevel({ level: 1, difficulty: 'easy', seed: 'test' });
      });
      
      expect(result.current.status).toBe('playing');
      
      // Pause
      await act(async () => {
        result.current.pause();
      });
      
      expect(result.current.status).toBe('paused');
    });

    it('should resume with resume action', async () => {
      const { result } = renderHook(() => useGameState(), { wrapper });
      
      // Start and pause
      await act(async () => {
        result.current.startLevel({ level: 1, difficulty: 'easy', seed: 'test' });
        result.current.pause();
      });
      
      expect(result.current.status).toBe('paused');
      
      // Resume
      await act(async () => {
        result.current.resume();
      });
      
      expect(result.current.status).toBe('playing');
    });

    it('should tick time with tick action', async () => {
      const { result } = renderHook(() => useGameState(), { wrapper });
      
      // Start first
      await act(async () => {
        result.current.startLevel({ level: 1, difficulty: 'easy', seed: 'test' });
      });
      
      expect(result.current.elapsedSeconds).toBe(0);
      
      // Tick
      await act(async () => {
        result.current.tick();
      });
      
      expect(result.current.elapsedSeconds).toBe(1);
    });

    it('should trigger game over with gameOver action', async () => {
      const { result } = renderHook(() => useGameState(), { wrapper });
      
      await act(async () => {
        result.current.startLevel({ level: 1, difficulty: 'easy', seed: 'test' });
        result.current.gameOver();
      });
      
      expect(result.current.status).toBe('gameover');
    });

    it('should reset with reset action', async () => {
      const { result } = renderHook(() => useGameState(), { wrapper });
      
      await act(async () => {
        result.current.startLevel({ level: 1, difficulty: 'easy', seed: 'test' });
      });
      
      expect(result.current.status).toBe('playing');
      
      await act(async () => {
        result.current.reset();
      });
      
      expect(result.current.status).toBe('idle');
      expect(result.current.tiles).toEqual([]);
      expect(result.current.score).toBe(0);
    });
  });

  describe('selectTile', () => {
    it('should select tile with selectTile action', async () => {
      const { result } = renderHook(() => useGameState(), { wrapper });
      
      // Start level first
      await act(async () => {
        result.current.startLevel({ level: 1, difficulty: 'easy', seed: 'select-test' });
      });
      
      const tileId = result.current.tiles[0]?.id;
      if (tileId) {
        await act(async () => {
          result.current.selectTile(tileId);
        });
        
        expect(result.current.selectedTileId).toBe(tileId);
      }
    });
  });
});