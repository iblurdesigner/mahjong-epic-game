# Proposal: Mahjong Epic v1

## Intent

Build a complete, playable Mahjong matching game for iPadOS targeting seniors. The game delivers the meditative Mahjong solitaire experience with full tile-matching mechanics, procedural level generation, timer, pause/resume, and sound toggle — all wrapped in the Celestial Jade design system with 64px touch targets for accessibility.

## Scope

### In Scope
- Home screen with Play and Settings navigation
- Game board with 3D-stacked Mahjong tiles (Dots, Bamboos, Characters suits)
- Full tile-matching mechanics: exact same symbol match, unlock rules (no tile on top + at least one side free)
- Procedural level generation with difficulty progression
- Game timer (per-level countdown)
- Pause/resume functionality
- Settings screen (sound on/off)
- iPadOS build and run

### Out of Scope
- Touch/gesture recognition refinements beyond basic tap
- Leaderboards or cloud save
- Tutorial/Help screens
- Level unlocking persistence (all levels accessible in v1)
- Multiplayer or social features
- Haptic feedback

## Capabilities

### New Capabilities
- `tile-matching`: Core game mechanic — select two matching tiles to remove them
- `tile-unlock-rules`: A tile is selectable only if uncovered (no tile above) AND at least one side (left or right) is free
- `procedural-layout`: Dynamically generate Mahjong board layouts with configurable difficulty (tile count, layers, patterns)
- `game-timer`: Countdown timer per level; game over on expiry
- `pause-resume`: Freeze/unfreeze game state without losing progress
- `sound-toggle`: Global mute control persisted to device storage
- `home-navigation`: Entry point routing between Home, Game, Levels, Settings

### Modified Capabilities
- None for v1.

## Approach

**Stack**: React Native 0.76.5 + Expo SDK 52, TypeScript, Jest + @testing-library/react-native.

**Architecture**: Feature-based folder structure (`src/screens/`, `src/components/`, `src/hooks/`, `src/utils/`, `src/types/`). State managed with React Context + `useReducer` for game state. No external state library needed at v1 scale.

**Board rendering**: CSS/React Native absolute positioning to layer tiles visually in 3D. Each tile tracks `(row, col, layer)`. Z-index derived from layer.

**Procedural generation**: Seeded PRNG for reproducible layouts. Tiles placed in valid grid positions, then paired (each symbol appears exactly 2x). Difficulty controlled by: layer count (1–3), grid size, and symbol variety.

**Tile unlock check**:
```
isUnlocked(tile) = !hasTileAbove(tile) AND (isLeftFree(tile) OR isRightFree(tile))
```

**Audio**: `expo-av` for music playback. Simple boolean flag; no per-sound volume.

**TDD**: Strict TDD. Write failing unit tests first for game logic (tile matching, unlock rules, win/lose conditions), then implement.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `App.tsx` | Modified | Root navigator/router setup |
| `src/screens/HomeScreen.tsx` | New | Main menu with JUGAR, AJUSTES buttons |
| `src/screens/GameScreen.tsx` | New | Board, timer, pause, tile interaction |
| `src/screens/LevelsScreen.tsx` | New | Level selector grid with lock/unlock UI |
| `src/screens/SettingsScreen.tsx` | New | Sound toggle, basic preferences |
| `src/components/Tile.tsx` | New | Individual Mahjong tile with suits, shadow, accessibility |
| `src/components/Board.tsx` | New | Renders all tiles with 3D layering |
| `src/components/Timer.tsx` | New | Countdown display |
| `src/hooks/useGameState.ts` | New | Game state reducer: tiles, score, timer, pause |
| `src/hooks/useSound.ts` | New | Sound toggle + playback |
| `src/utils/layoutGenerator.ts` | New | Procedural board generation |
| `src/utils/tileUnlock.ts` | New | Unlock rules validation |
| `src/types/index.ts` | New | Tile, Board, GameState, Level types |
| `src/__tests__/` | New | Unit tests for game logic |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| 3D tile stacking rendering incorrect on iPad | Med | Use `zIndex` from layer + careful offset calculations; verify on simulator early |
| Procedural generation produces unsolvable boards | Med | Implement solvability check (BFS/DFS verify pairs exist) post-generation; regenerate if unsolvable |
| Timer edge cases (pause during countdown) | Low | Store elapsed time, not absolute deadline; recalculate on resume |
| Sound library compatibility issues | Low | Use `expo-av` (stable); test audio on iOS simulator |
| Test coverage below 80% threshold | Low | TDD all game logic; add integration tests for screen flows |

## Rollback Plan

If major issues arise during development:

1. **Unresolved rendering bugs**: Revert board rendering to simpler 2D grid; defer 3D layering to v1.x
2. **Solvability failures**: Add mandatory solvability verification step to `layoutGenerator`; if fails, regenerate with new seed
3. **Build failure on iOS**: Pin Expo SDK, freeze `package.json` dependencies; use `expo doctor` to validate setup
4. **Test coverage drops**: Add `npm test -- --coverage` gate in CI; fail build below 80%

## Dependencies

- `expo-av` — audio playback
- `expo-router` — screen navigation (or React Navigation if simpler for v1)
- `@testing-library/react-native` — integration tests
- Standard React Native + Expo SDK 52 environment

## Success Criteria

- [ ] Home screen renders with JUGAR and AJUSTES buttons that navigate correctly
- [ ] Game board displays 3D-stacked tiles with correct unlock highlighting
- [ ] Two tiles with exact same symbol match and remove from board
- [ ] A tile blocked from top or both sides cannot be selected (visual feedback)
- [ ] All levels generate solvable boards
- [ ] Timer counts down; game-over triggers when time reaches zero
- [ ] Pause freezes board and timer; resume restores exact state
- [ ] Sound toggle persists across app restarts
- [ ] All tests pass (`npm test`)
- [ ] TypeScript compiles without errors (`tsc --noEmit`)
- [ ] App runs on iPadOS simulator without crashes