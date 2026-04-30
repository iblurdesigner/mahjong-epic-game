// Game Context - State Management with useReducer
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, GameAction, LevelConfig, Tile } from '../types';
import { generateLayout } from '../utils/layoutGenerator';
import { calculateScore } from '../utils/score';
import { isUnlocked } from '../utils/tileUnlock';

// Initial state
export const initialGameState: GameState = {
  tiles: [],
  selectedTileId: null,
  score: 0,
  elapsedSeconds: 0,
  status: 'idle',
  levelConfig: null,
  draggingTileId: null,
};

// Helper: Recalculate unlocked status for all tiles
function recalculateUnlocked(tiles: Tile[]): Tile[] {
  return tiles.map(tile => ({
    ...tile,
    // isUnlocked is a derived value, not stored in tile
    // This is just for reference - we calculate it on the fly in components
  }));
}

// Reducer function
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_LEVEL': {
      const tiles = generateLayout(action.payload);
      return {
        ...state,
        tiles,
        selectedTileId: null,
        score: 0,
        elapsedSeconds: 0,
        status: 'playing',
        levelConfig: action.payload,
      };
    }

    case 'SELECT_TILE': {
      const { tileId } = action.payload;
      const clickedTile = state.tiles.find(t => t.id === tileId);
      
      // If no tile found or already removed, ignore
      if (!clickedTile || clickedTile.isRemoved) {
        return state;
      }
      
      // Check if tile is unlocked
      if (!isUnlocked(clickedTile, state.tiles)) {
        // Can't select locked tiles
        return state;
      }
      
      // If no tile selected, select this one
      if (!state.selectedTileId) {
        return {
          ...state,
          selectedTileId: tileId,
        };
      }
      
      // If clicking same tile, deselect
      if (state.selectedTileId === tileId) {
        return {
          ...state,
          selectedTileId: null,
        };
      }
      
      // Check if selected tile matches clicked tile
      const selectedTile = state.tiles.find(t => t.id === state.selectedTileId);
      
      if (selectedTile && selectedTile.symbol === clickedTile.symbol) {
        // Valid match! Remove both tiles
        const updatedTiles = state.tiles.map(t => {
          if (t.id === state.selectedTileId || t.id === tileId) {
            return { ...t, isRemoved: true };
          }
          return t;
        });
        
        const newScore = calculateScore(state.score, 1);
        const remainingTiles = updatedTiles.filter(t => !t.isRemoved);
        
        // Check for win condition
        const isWon = remainingTiles.length === 0;
        
        return {
          ...state,
          tiles: updatedTiles,
          selectedTileId: null,
          score: newScore,
          status: isWon ? 'won' : state.status,
        };
      }
      
      // Invalid match - clear selection
      return {
        ...state,
        selectedTileId: null,
      };
    }

    case 'REMOVE_TILES': {
      const { id1, id2 } = action.payload;
      const updatedTiles = state.tiles.map(t => {
        if (t.id === id1 || t.id === id2) {
          return { ...t, isRemoved: true };
        }
        return t;
      });
      
      const newScore = calculateScore(state.score, 1);
      
      return {
        ...state,
        tiles: updatedTiles,
        score: newScore,
      };
    }

    case 'TICK': {
      if (state.status !== 'playing') return state;
      
      return {
        ...state,
        elapsedSeconds: state.elapsedSeconds + 1,
      };
    }

    case 'PAUSE': {
      if (state.status !== 'playing') return state;
      
      return {
        ...state,
        status: 'paused',
      };
    }

    case 'RESUME': {
      if (state.status !== 'paused') return state;
      
      return {
        ...state,
        status: 'playing',
      };
    }

    case 'GAME_OVER': {
      return {
        ...state,
        status: 'gameover',
      };
    }

    case 'WIN': {
      return {
        ...state,
        status: 'won',
      };
    }

    case 'RESET': {
      return initialGameState;
    }

    case 'START_DRAG': {
      // Only allow dragging when game is playing
      if (state.status !== 'playing') {
        return state;
      }
      
      // Check if the tile is unlocked
      const tile = state.tiles.find(t => t.id === action.payload.tileId);
      if (!tile || !isUnlocked(tile, state.tiles)) {
        return state;
      }
      
      return {
        ...state,
        draggingTileId: action.payload.tileId,
      };
    }

    case 'END_DRAG': {
      return {
        ...state,
        draggingTileId: null,
      };
    }

    case 'MOVE_TILE': {
      const { tileId, row, col } = action.payload;
      
      // Update the tile's position
      const updatedTiles = state.tiles.map(t => {
        if (t.id === tileId) {
          return {
            ...t,
            position: { ...t.position, row, col },
          };
        }
        return t;
      });
      
      // NOTE: isUnlocked is calculated on-the-fly in components
      // No need to recalculate here, as it will be computed in Board.tsx
      
      return {
        ...state,
        tiles: updatedTiles,
        draggingTileId: null,
      };
    }

    default:
      return state;
  }
}

// Context type
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

// Hook to use game context
export function useGameContext(): GameContextType {
  const context = useContext(GameContext);
  
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  
  return context;
}
