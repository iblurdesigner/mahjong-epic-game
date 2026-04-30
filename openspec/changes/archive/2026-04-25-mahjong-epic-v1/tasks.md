# Tasks: Mahjong Epic v1

## Phase 1: Infrastructure

- [x] 1.1 Install `expo-router`, `expo-av`, `@react-native-async-storage/async-storage`
- [x] 1.2 Configure `app.json` for expo-router (scheme, plugins) and update `App.tsx` to use `app/` directory
- [x] 1.3 Create `app/_layout.tsx` with stack navigator: Home → Levels → Game, Settings
- [x] 1.4 Set up Jest config (`jest.config.js`, `jest.setup.js`) for `@testing-library/react-native`
- [x] 1.5 Create `src/types/index.ts` — Tile, TilePosition, GameState, LevelConfig, GameAction interfaces
- [x] 1.6 Create `src/constants/suits.ts` — DOTS/BAMBOO/CHARACTER symbols, TILE_SUITS array
- [x] 1.7 Create `src/constants/difficulty.ts` — easy/medium/hard config: tileCount, layers, timeSeconds

## Phase 2: Core Implementation (Pure Utils — TDD RED first)

- [x] 2.1 TDD: write `src/__tests__/seedRandom.test.ts` — mulberry32 output bounds, same seed reproducibility
- [x] 2.2 Implement `src/utils/seedRandom.ts` — mulberry32 seeded PRNG factory
- [x] 2.3 TDD: write `src/__tests__/tileUnlock.test.ts` — hasTileAbove, isSideFree, isUnlocked (Given/When/Then scenarios from spec)
- [x] 2.4 Implement `src/utils/tileUnlock.ts` — pure unlock-rule functions
- [x] 2.5 TDD: write `src/__tests__/score.test.ts` — +10 per match, edge cases
- [x] 2.6 Implement `src/utils/score.ts` — score calculation helpers
- [x] 2.7 TDD: write `src/__tests__/layoutGenerator.test.ts` — even pair count, seeded output, BFS solvability (accept/reject scenarios)
- [x] 2.8 Implement `src/utils/layoutGenerator.ts` — seeded PRNG placement + BFS solvability check with 3-retry fallback

## Phase 3: State Management

- [x] 3.1 TDD: write `src/__tests__/GameContext.test.tsx` — all GameAction variants (START_LEVEL, SELECT_TILE, REMOVE_TILES, TICK, PAUSE, RESUME, GAME_OVER, WIN)
- [x] 3.2 Implement `src/contexts/GameContext.tsx` — GameProvider with useReducer
- [x] 3.3 Implement `src/hooks/useGameState.ts` — useContext bridge to GameContext
- [ ] 3.4 TDD: write `src/__tests__/SettingsContext.test.ts` — AsyncStorage load/save cycle, sound on by default
- [ ] 3.5 Implement `src/contexts/SettingsContext.tsx` — sound toggle + AsyncStorage sync, default "on"
- [x] 3.6 Implement `src/hooks/useSound.ts` — Audio.load/play/stop helpers, respects SettingsContext sound flag

## Phase 4: Components

- [x] 4.1 Implement `src/components/Tile.tsx` — View with suits (emoji/text), shadow, isUnlocked prop, isSelected prop, accessibilityRole="button", 64px touch target
- [x] 4.2 Implement `src/components/Board.tsx` — absolute-positioned tile grid, computes zIndex from layer, calls onSelect per tile
- [x] 4.3 Implement `src/components/Timer.tsx` — MM:SS countdown from elapsedSeconds, disabled style when paused
- [x] 4.4 Implement `src/components/PauseOverlay.tsx` — modal with "PAUSA" title, "Continuar" 64px button
- [ ] 4.5 TDD: write `src/__tests__/components/Tile.test.tsx` — renders symbol, highlighted when selected, disabled when locked
- [ ] 4.6 TDD: write `src/__tests__/components/Board.test.tsx` — renders correct tile count, passes onSelect to Tile
- [ ] 4.7 TDD: write `src/__tests__/components/Timer.test.tsx` — displays MM:SS, stops at 00:00

## Phase 5: Screens + Wiring

- [x] 5.1 Implement `app/home.tsx` — HomeScreen: JUGAR (→/levels), AJUSTES (→/settings) buttons, Celestial Jade styling, 64px height minimum
- [x] 5.2 Implement `app/levels.tsx` — LevelsScreen: grid of level buttons (1–N), taps navigate to `/game?level=N`
- [x] 5.3 Implement `app/game.tsx` — GameScreen: reads level from route params, initializes GameContext, renders Board + Timer + pause button
- [x] 5.4 Implement `app/settings.tsx` — SettingsScreen: "Música" toggle switch (64px), back navigation, uses SettingsContext
- [x] 5.5 Update `App.tsx` — replace stub with `SafeAreaProvider` + `GameProvider` + `SettingsProvider` wrappers
- [ ] 5.6 TDD: write `src/__tests__/screens/navigation.test.tsx` — Home→Levels→Game flow, Settings back navigation
- [ ] 5.7 Add `assets/audio/background.mp3` placeholder (royalty-free 30s loop)

## Phase 6: Integration + Verification

- [ ] 6.1 Run `npm test` — all unit + integration tests pass
- [ ] 6.2 Run `tsc --noEmit` — TypeScript compiles without errors
- [ ] 6.3 TDD: write e2e-style integration test: start level → select two matching unlocked tiles → tiles removed → score increments
- [ ] 6.4 Run `npx expo export` — verify iOS build artifact generated without errors
- [ ] 6.5 Verify solvability: generate 5 boards per difficulty, confirm all pass BFS check
- [ ] 6.6 Run `expo doctor` — validate Expo SDK 52 setup and dependencies