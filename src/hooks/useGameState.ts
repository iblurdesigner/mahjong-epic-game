// Game State Hook - Bridge to GameContext
import { useGameContext } from '../contexts/GameContext';
import type { LevelConfig } from '../types';

/**
 * Hook to access game state and actions
 * Provides a cleaner API than direct context usage
 */
export function useGameState() {
  const { state, dispatch } = useGameContext();
  
  return {
    // State
    tiles: state.tiles,
    selectedTileId: state.selectedTileId,
    score: state.score,
    elapsedSeconds: state.elapsedSeconds,
    status: state.status,
    levelConfig: state.levelConfig,
    draggingTileId: state.draggingTileId,
    
    // Actions
    startLevel: (config: LevelConfig) => {
      dispatch({ type: 'START_LEVEL', payload: config });
    },
    
    selectTile: (tileId: string) => {
      dispatch({ type: 'SELECT_TILE', payload: { tileId } });
    },
    
    pause: () => {
      dispatch({ type: 'PAUSE' });
    },
    
    resume: () => {
      dispatch({ type: 'RESUME' });
    },
    
    tick: () => {
      dispatch({ type: 'TICK' });
    },
    
    gameOver: () => {
      dispatch({ type: 'GAME_OVER' });
    },
    
    win: () => {
      dispatch({ type: 'WIN' });
    },
    
    reset: () => {
      dispatch({ type: 'RESET' });
    },
    
    // Drag actions
    startDrag: (tileId: string) => {
      dispatch({ type: 'START_DRAG', payload: { tileId } });
    },
    
    endDrag: () => {
      dispatch({ type: 'END_DRAG' });
    },
    
    moveTile: (tileId: string, row: number, col: number) => {
      dispatch({ type: 'MOVE_TILE', payload: { tileId, row, col } });
    },
  };
}