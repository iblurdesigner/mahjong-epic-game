// Mahjong Epic Types

// Tile position in 3D space
export interface TilePosition {
  row: number;
  col: number;
  layer: number;
}

// Individual Mahjong tile
export interface Tile {
  id: string;
  symbol: string; // e.g., "DOTS-1", "BAMBOO-5", "CHARACTER-WAN"
  position: TilePosition;
  isRemoved: boolean;
}

// Tile suits
export type TileSuit = 'DOTS' | 'BAMBOO' | 'CHARACTER';

// Game status
export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover' | 'won';

// Level difficulty
export type Difficulty = 'easy' | 'medium' | 'hard';

// Level configuration
export interface LevelConfig {
  level: number;
  difficulty: Difficulty;
  seed: string;
}

// Game state
export interface GameState {
  tiles: Tile[];
  selectedTileId: string | null;
  score: number;
  elapsedSeconds: number;
  status: GameStatus;
  levelConfig: LevelConfig | null;
  draggingTileId: string | null; // Tile being dragged
}

// Game actions
export type GameAction =
  | { type: 'START_LEVEL'; payload: LevelConfig }
  | { type: 'SELECT_TILE'; payload: { tileId: string } }
  | { type: 'REMOVE_TILES'; payload: { id1: string; id2: string } }
  | { type: 'TICK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'GAME_OVER' }
  | { type: 'WIN' }
  | { type: 'RESET' }
  | { type: 'START_DRAG'; payload: { tileId: string } }
  | { type: 'END_DRAG' }
  | { type: 'MOVE_TILE'; payload: { tileId: string; row: number; col: number } };

// Difficulty configuration
export interface DifficultyConfig {
  tileCountMin: number;
  tileCountMax: number;
  layersMin: number;
  layersMax: number;
  symbolVarietyMin: number;
  symbolVarietyMax: number;
  timeSeconds: number;
}

// Settings
export interface Settings {
  soundEnabled: boolean;
}