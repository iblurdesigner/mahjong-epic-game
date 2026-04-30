# Spec: Drag-Drop Tiles for Mahjong Epic

## ADDED Requirements

### 1. Drag Gesture Activation (drag-activation)

**Requirement: Long-Press Initiation**
The system MUST initiate drag mode when an unlocked tile is long-pressed for 500ms (±50ms). Quick taps (<300ms) MUST continue to trigger tile selection for matching.

**Scenarios:**

**Scenario 1: Successful drag initiation**
- Given: Tile is unlocked and game is playing
- When: User long-presses tile for 500ms
- Then: Tile enters drag mode (follows finger, zIndex=9999, opacity=0.8)

**Scenario 2: Tap still selects**
- Given: Tile is unlocked and game is playing
- When: User taps tile quickly (<300ms)
- Then: Tile is selected for matching (existing behavior)

**Scenario 3: Locked tile cannot drag**
- Given: Tile is locked (has tile on top or no free side)
- When: User long-presses tile
- Then: Nothing happens, tile cannot be dragged

### 2. Drag Behavior (drag-behavior)

**Requirement: Real-Time Following**
During drag, the tile MUST follow the finger position in real-time using `Animated` API. The tile's visual position MUST update at 60fps.

**Requirement: Visual Feedback**
During drag, the tile MUST have:
- `zIndex: 9999` (always on top)
- `opacity: 0.8` (visual indication of drag mode)
- Scale transformation: `scale(1.05)` (slightly larger)

**Requirement: Drag Boundaries**
The tile MUST NOT be draggable beyond the board boundaries. If the finger moves outside the board, the tile MUST stop at the boundary.

### 3. Drag Release (drag-release)

**Requirement: Snap Back (Iteration 1)**
Upon finger lift (release), the tile MUST snap back to its original grid position. The drag is cosmetic only — no change to logical position (`row`, `col`, `layer`).

**Scenarios:**

**Scenario 4: Release drag**
- Given: Tile is being dragged
- When: User lifts finger
- Then: Tile snaps back to original position, zIndex restored, opacity restored

**Scenario 5: Release outside board**
- Given: Tile is being dragged and finger moves outside board
- When: User lifts finger
- Then: Tile snaps back to original position

### 4. State Constraints (drag-constraints)

**Requirement: Game State Check**
Drag MUST be disabled when:
- Game status is `paused`
- Game status is `gameover`
- Game status is `won`

**Requirement: Unlock Rule Consistency**
Only tiles that pass `isUnlocked(tile, tiles)` check MUST be draggable. This ensures consistency with tap-to-select behavior.

**Scenarios:**

**Scenario 6: Game paused**
- Given: Game is paused
- When: User tries to drag any tile
- Then: Nothing happens, drag is disabled

**Scenario 7: Unlocked tile drag**
- Given: Tile passes `isUnlocked()` check
- When: User long-presses tile
- Then: Drag initiates successfully

### 5. Non-Functional Requirements

**NFR-01**: Drag animation runs at 60fps (use `useNativeDriver: true`)
**NFR-02**: Drag gesture threshold is 500ms (prevents accidental drags during tap)
**NFR-03**: Works on iPadOS with finger touch (no stylus required)
**NFR-04**: Accessible for seniors (large 160x212 touch targets from DIMENSIONS)

## CHANGED Requirements

### 1. Tile Component (tile-component)

**Change: ADD Gesture Handler**
The `Tile` component MUST be wrapped with `PanGestureHandler` from `react-native-gesture-handler` (already installed v2.28.0). The existing `Pressable` MUST be preserved for tap behavior.

**Change: ADD Animated State**
The component MUST manage:
- `dragPosition`: Animated.ValueXY for finger tracking
- `isDragging`: boolean state
- Long-press detection using `setTimeout` (500ms)

## REMOVED Requirements

None. Drag & drop is purely additive — no existing functionality is removed.

## Success Criteria

1. ✅ User can long-press (500ms) an unlocked tile to initiate drag
2. ✅ Tile follows finger in real-time at 60fps
3. ✅ Visual feedback: zIndex=9999, opacity=0.8, scale=1.05
4. ✅ Upon release, tile snaps back to original grid position
5. ✅ Tapping tiles still triggers match/select logic
6. ✅ Only unlocked tiles can be dragged
7. ✅ Drag disabled when game paused/gameover/won
8. ✅ No performance degradation with 144+ tiles
