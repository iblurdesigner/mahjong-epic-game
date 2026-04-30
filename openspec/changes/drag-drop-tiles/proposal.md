# Proposal: Drag-Drop Tiles for Mahjong Epic

## Intent
Add the ability to move Mahjong tiles using touch gestures (drag & drop) to allow users (seniors on iPadOS) to reorganize the board visually. This enhances the tactile experience beyond simple tap-to-select.

## Scope

### Changes
1. **src/components/Tile.tsx**: Wrap component with `PanGestureHandler` (already available in deps) to detect drag gestures.
2. **src/components/Board.tsx**: Manage zIndex during drag (bring to front) and calculate drop positions.
3. **src/contexts/GameContext.tsx / useGameState**: Implement the reducer logic for `START_DRAG`, `MOVE_TILE`, and `END_DRAG`.
4. **State Update**: The `Tile` type currently uses `position: { row, col, layer }`. We will add an optional `visualOffset?: { x, y }` to handle drag movement without altering the logical grid position immediately, OR we modify the `position` directly upon drop.

### Non-Changes
- Tile matching logic (exact symbol match) remains untouched.
- Tile unlock logic (`isUnlocked`) remains the same (you can only drag unlocked tiles).
- Scoring, Timer, and Level generation remain unchanged.

## Approach: Hybrid Tap + Drag

We will keep **both** interaction modes to maintain the game's core mechanics:

1. **Short Tap (Press)**: Selects the tile for matching (existing behavior).
2. **Long Press + Drag**: Moves the tile to a new position on the board.

### Technical Decisions
- **Library**: Use `PanGestureHandler` from `react-native-gesture-handler` (v2.28.0 already installed).
- **Animation**: Use `Animated` API (from React Native core) to track finger movement. Avoid adding `react-native-reanimated` to keep dependencies slim unless performance demands it.
- **Positioning**:
  - **During Drag**: Update absolute pixel coordinates for smooth following.
  - **On Drop**: Determine if the tile is over another tile. 
    - **Option A (Simple)**: Snap back to original grid position (cosmetic drag only).
    - **Option B (Swap)**: Swap positions with the tile underneath.
    - **Option C (Free Move)**: Update the tile's `row/col` to the new location (requires recalculating unlock status for all tiles).

**Recommendation**: Start with **Option A (Snap back)** for the first iteration. It provides the "feel" of dragging without breaking the game logic (unlock rules based on layers). If the user wants actual repositioning, we move to Option C later.

## Risks & Mitigations
- **Risk**: Confusing seniors with two gestures (tap vs drag).
  - **Mitigation**: Make drag threshold high (requires intentional movement, not just a shaky tap).
- **Risk**: Performance with 144+ tiles updating state.
  - **Mitigation**: Use `useNativeDriver` for animations; only update `GameState` on drop, not on every gesture frame.
- **Risk**: zIndex conflicts during drag.
  - **Mitigation**: Set `zIndex: 9999` on the tile being dragged.

## Success Criteria
1. User can press and hold a tile, then drag it across the screen.
2. Upon releasing, the tile snaps back to its grid position (Iteration 1) or swaps position (Iteration 2).
3. Tapping two tiles still triggers the match/remove logic.
4. Only "unlocked" tiles can be dragged.
5. No crashes or performance drops (60fps).

## Next Steps
If approved, move to **Phase 3: SPEC** to define detailed requirements and scenarios.
