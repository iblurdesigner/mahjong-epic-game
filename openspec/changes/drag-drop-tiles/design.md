---
change: drag-drop-tiles
phase: design
---

# Design: Drag-Drop Tiles for Mahjong Epic

## Technical Architecture

### 1. Component Changes

#### Tile.tsx
- **Wrap** existing `Pressable` with `PanGestureHandler` from `react-native-gesture-handler`.
- **State Management**:
  - `isDragging: boolean` — local state
  - `dragPosition: Animated.ValueXY` — tracks finger movement
  - `longPressTimeout: NodeJS.Timeout | null` — for 500ms detection
- **Dual Interaction**:
  - `onPressIn` → start 500ms timeout
  - Timeout fires → `dispatch({ type: 'START_DRAG' })` → gesture active
  - Cancel timeout on `onPressOut` (quick tap) → `onPress` fires normally
- **Visual Feedback During Drag**:
  - `zIndex: 9999`
  - `opacity: 0.8`
  - `transform: [{ scale: 1.05 }]`
  - `transform: [{ translateX: dragPosition.x }, { translateY: dragPosition.y }]`

#### Board.tsx
- **Pass Props to Tile**:
  - `boardWidth`, `boardHeight` (scaled dimensions) — for boundary clamping
  - `draggingTileId` from GameContext — to apply drag styles
- **Tile Wrapper Style**:
  - Base: `left`, `top`, `zIndex` (existing logic)
  - During drag: add `transform: [{ translateX }, { translateY }]` from Animated value

### 2. State Management (GameContext)

**Already Implemented** (from types):
```typescript
| { type: 'START_DRAG'; payload: { tileId: string } }
| { type: 'END_DRAG' }
| { type: 'MOVE_TILE'; payload: { tileId: string; row: number; col: number } }
```

**Refinements Needed**:
- `START_DRAG` reducer check: `if (state.status !== 'playing') return state;`
- `START_DRAG` reducer check: verify tile is unlocked
- `END_DRAG` reducer: set `draggingTileId: null`
- `MOVE_TILE` (Iteration 1): Don't change logical position — just reset drag state

### 3. Animation Strategy

- **Library**: `Animated` API (React Native core)
- **Driver**: `useNativeDriver: true` (for 60fps)
- **Gesture**: `PanGestureHandler` (react-native-gesture-handler v2.28.0)
- **No new deps**: Avoid `react-native-reanimated` unless performance demands

### 4. Boundary Clamping

In `Tile.tsx`, during gesture:
```typescript
onGestureEvent={Animated.event(
  [{ nativeEvent: { translationX: dragPosition.x, translationY: dragPosition.y } }],
  { useNativeDriver: true }
)}
```

Clamp values to: `[0, boardWidth - tileWidth]` for X, `[0, boardHeight - tileHeight]` for Y.

### 5. Long-Press Detection

```typescript
const handlePressIn = () => {
  longPressTimeout.current = setTimeout(() => {
    if (isUnlocked && state.status === 'playing') {
      dispatch({ type: 'START_DRAG', payload: { tileId: tile.id } });
      setIsDragging(true);
    }
  }, 500);
};

const handlePressOut = () => {
  if (longPressTimeout.current) {
    clearTimeout(longPressTimeout.current);
  }
};
```

### 6. Snap-Back (Iteration 1)

On `END_DRAG`:
1. Reset `dragPosition` to `{ x: 0, y: 0 }` (Animated.spring or Animated.timing)
2. `dispatch({ type: 'END_DRAG' })`
3. `setIsDragging(false)`

## Risks

1. **Performance**: 144+ tiles with Animated values — mitigate with `useNativeDriver`
2. **zIndex conflicts**: Ensure only one tile has `zIndex: 9999` at a time
3. **Gesture conflicts**: Pressable + PanGestureHandler — mitigate with 500ms threshold
4. **Senior UX**: Accidental drags — mitigate with high threshold, clear visual feedback

## Next Phase

Proceed to **Tasks** to break down implementation steps.
