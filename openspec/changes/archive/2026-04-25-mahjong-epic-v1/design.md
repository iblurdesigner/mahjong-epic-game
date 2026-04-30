# Design: Mahjong Epic v1

## Technical Approach

React Native 0.76.5 + Expo SDK 52, TypeScript, strict TDD. Feature-based folder structure under `src/`. Game state via React Context + `useReducer`. Board rendered with RN `View` absolute positioning + `zIndex` from layer. Seeded PRNG (mulberry32) for reproducible procedural layouts with BFS solvability verification. Audio via `expo-av`.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|----------|--------|--------------|-----------|
| Navigation | `expo-router` file-based routing | React Navigation | Native to Expo SDK 52, file-based routing aligns with feature structure, easier deep linking |
| State management | Single `GameContext` + `useReducer` | Zustand, Redux | v1 scope is contained; Context+Reducer is sufficient and zero-dep |
| Tile rendering | `View` with `position: absolute` + `zIndex` | Reanimated, Skia | No 3D engine needed; layer → zIndex gives "3D stacked" illusion natively |
| PRNG | mulberry32 (seeded) | Math.random(), LCG | Fast, seedable, good distribution for 2D grid placement |
| Solvability | BFS pair-search after generation | Backtracking solver | Linear BFS is O(n²) enough for 144 tiles; aborts early on first valid pair |
| Audio | `expo-av` single `Audio.Sound` | `expo-av` per-sound instances | One bg track; `expo-av` is stable on iOS, simple API covers v1 needs |
| Persistence | `@react-native-async-storage/async-storage` | expo-secure-store | Sound preference only; no sensitive data; AsyncStorage is sufficient |
| TDD | RED-GREEN-REFACTOR on all game logic | Write-after-implement | Config enforces TDD; game logic (pure functions) is unit-testable without RN |

## Data Flow

```
HomeScreen ──→ expo-router ──→ GameScreen
                        ├──→ LevelsScreen ──→ GameScreen (with level config)
                        └──→ SettingsScreen

GameScreen ──→ useGameReducer (GameContext)
    ├── Board (renders tiles via zIndex layering)
    │   └── Tile (touchable, calls onSelect)
    ├── Timer (uses elapsedSeconds from context)
    └── PauseOverlay (modal when status === 'paused')

SettingsScreen ←→ SettingsContext (AsyncStorage sync)
```

## File Structure

```
mahjong-epic/
├── App.tsx                          # Root: providers + expo-router layout
├── app/
│   ├── _layout.tsx                  # Stack navigator: Home → Levels → Game, Settings
│   ├── index.tsx                    # Redirect → /home
│   ├── home.tsx                     # HomeScreen
│   ├── levels.tsx                   # LevelsScreen
│   ├── game.tsx                     # GameScreen (reads level from route params)
│   └── settings.tsx                 # SettingsScreen
├── src/
│   ├── contexts/
│   │   ├── GameContext.tsx          # GameProvider: state + dispatch
│   │   └── SettingsContext.tsx      # Sound toggle + AsyncStorage sync
│   ├── hooks/
│   │   ├── useGameState.ts          # useContext + useReducer bridge
│   │   └── useSound.ts              # Audio load/play/stop helpers
│   ├── components/
│   │   ├── Board.tsx                # Absolute-positioned tile grid, computes zIndex
│   │   ├── Tile.tsx                 # Individual tile: suits, shadow, selection state
│   │   ├── Timer.tsx                # MM:SS countdown display
│   │   └── PauseOverlay.tsx         # Modal overlay with resume button
│   ├── utils/
│   │   ├── layoutGenerator.ts       # Seeded PRNG → tile placement → BFS solvability
│   │   ├── tileUnlock.ts            # Pure functions: hasTileAbove, isSideFree, isUnlocked
│   │   ├── seedRandom.ts            # mulberry32 PRNG factory
│   │   └── score.ts                 # Score calculation helpers
│   ├── types/
│   │   └── index.ts                 # Tile, Board, GameState, LevelConfig, TilePosition
│   ├── constants/
│   │   ├── suits.ts                 # DOTS, BAMBOO, CHARACTER with symbols
│   │   └── difficulty.ts            # Easy/medium/hard: tileCount, layers, timeSeconds
│   └── __tests__/
│       ├── tileUnlock.test.ts       # Pure unit tests
│       ├── layoutGenerator.test.ts  # Seeded output, solvability, pair count
│       ├── useGameReducer.test.ts   # Reducer actions: SELECT_TILE, REMOVE_TILES, PAUSE, etc.
│       └── score.test.ts            # Score calculation
└── assets/
    └── audio/
        └── background.mp3           # Loopable background track
```

## Interfaces / Contracts

```typescript
// Tile
interface Tile {
  id: string;
  symbol: string;       // e.g. "DOTS-1", "BAMBOO-5"
  position: TilePosition;
  isRemoved: boolean;
}

// TilePosition
interface TilePosition {
  row: number;
  col: number;
  layer: number;
}

// GameState
interface GameState {
  tiles: Tile[];
  selectedTileId: string | null;
  score: number;
  elapsedSeconds: number;
  status: 'idle' | 'playing' | 'paused' | 'gameover' | 'won';
}

// LevelConfig
interface LevelConfig {
  level: number;
  difficulty: 'easy' | 'medium' | 'hard';
  seed: string;
}

// Actions (useReducer)
type GameAction =
  | { type: 'START_LEVEL'; payload: LevelConfig }
  | { type: 'SELECT_TILE'; payload: { tileId: string } }
  | { type: 'REMOVE_TILES'; payload: { id1: string; id2: string } }
  | { type: 'TICK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'GAME_OVER' }
  | { type: 'WIN' };

// Tile unlock (pure)
function isUnlocked(tile: Tile, allTiles: Tile[]): boolean {
  return !hasTileAbove(tile, allTiles) && isSideFree(tile, allTiles);
}
```

## Testing Strategy

| Layer | What | Approach |
|-------|------|----------|
| Unit | `tileUnlock.ts`, `score.ts`, `seedRandom.ts` | Jest, pure synchronous functions |
| Unit | `layoutGenerator.ts` (seeded output, pair count, solvability) | Jest with known seed inputs |
| Integration | `useGameReducer` actions | `@testing-library/react-native` fireEvent, render with Provider |
| Integration | Screen navigation (Home→Levels→Game) | Mock expo-router `Stack`, test push |
| Integration | SettingsContext persistence | Mock AsyncStorage, verify load/save cycle |

TDD order: write failing `*.test.ts` → implement pure utils → wire into components.

## Migration / Rollout

No migration required. Greenfield project. Feature flags not needed at v1 scope.

## Open Questions

- [ ] **Layout grid bounds**: confirm max col/row for iPad portrait vs landscape — may need `Dimensions` API to compute tile size dynamically
- [ ] **Solvers in solvability check**: BFS or DFS? BFS finds first pair faster; DFS explores deeper — pick BFS
- [ ] **Audio file**: confirm format (MP3 vs M4A) and licensing; if none provided, use royalty-free placeholder