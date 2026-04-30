---
change: drag-drop-tiles
phase: tasks
---

# Tasks: Drag-Drop Tiles for Mahjong Epic

## Implementation Checklist (Strict TDD Mode)

### Phase 1: State Management (Prerequisites)

- [ ] **Task 1**: Refinar GameContext reducer — Agregar validaciones a `START_DRAG`: verificar `state.status === 'playing'` y que la ficha esté `unlocked`
- [ ] **Task 2**: Refinar GameContext reducer — `END_DRAG` debe limpiar `draggingTileId: null` correctamente

### Phase 2: Tile Component Setup

- [ ] **Task 3**: Actualizar Tile.tsx — Importar `PanGestureHandler` de `react-native-gesture-handler` y `Animated` API de React Native
- [ ] **Task 4**: Actualizar Tile.tsx — Envolver `Pressable` existente con `PanGestureHandler`
- [ ] **Task 5**: Agregar estado de drag en Tile — Crear `isDragging: boolean`, `dragPosition: Animated.ValueXY`, `longPressTimeout: useRef<NodeJS.Timeout>`

### Phase 3: Gesture Detection

- [ ] **Task 6**: Implementar detección long-press — `onPressIn` inicia setTimeout de 500ms; `onPressOut` lo cancela
- [ ] **Task 7**: Conectar gesto con estado — Al disparar el timeout → `setIsDragging(true)` + `dispatch({ type: 'START_DRAG' })`

### Phase 4: Visual Feedback

- [ ] **Task 8**: Agregar feedback visual durante drag — Aplicar `zIndex: 9999`, `opacity: 0.8`, `transform: [{ scale: 1.05 }]` cuando `isDragging` sea true
- [ ] **Task 9**: Implementar seguimiento de dedo — `Animated.event` con `translationX`/`translationY` → `dragPosition`, usar `useNativeDriver: true`

### Phase 5: Boundary Management

- [ ] **Task 10**: Pasar dimensiones del board a Tile — Board.tsx debe pasar `boardWidth` y `boardHeight` (escalados) a cada Tile
- [ ] **Task 11**: Implementar boundary clamping — En Tile.tsx, limitar `translateX` a `[0, boardWidth - tileWidth]` y `translateY` a `[0, boardHeight - tileHeight]`

### Phase 6: Drag Completion

- [ ] **Task 12**: Implementar snap-back en END_DRAG — Al soltar: `Animated.spring(dragPosition, { toValue: { x: 0, y: 0 } })`, luego `dispatch({ type: 'END_DRAG' })`, `setIsDragging(false)`

### Phase 7: Game State Constraints

- [ ] **Task 13**: Deshabilitar drag según estado del juego — En Tile, verificar que `status` no sea `paused`, `gameover`, o `won` antes de iniciar drag

### Phase 8: Testing (Strict TDD)

- [ ] **Task 14**: Escribir tests (Strict TDD) — Escribir tests PRIMERO para: long-press detection, drag initiation, visual feedback, snap-back, disabled states
- [ ] **Task 15**: Ejecutar tests — `npm test` debe pasar al 100% todas las pruebas de drag-drop

## Task Ordering Notes

1. **State first**: Tasks 1-2 (GameContext) must complete before Tile changes
2. **Component setup**: Tasks 3-5 create the foundation for gesture logic
3. **Gesture logic**: Tasks 6-9 implement the core drag behavior
4. **Boundaries**: Tasks 10-11 need Board-Tile coordination
5. **Completion**: Task 12 closes the drag lifecycle
6. **Constraints**: Task 13 adds game state checks
7. **Tests**: Task 14 (write tests FIRST), Task 15 (verify all pass)

## Dependency Graph

```
1-2 (State) → 3-5 (Setup) → 6-9 (Gesture) → 10-11 (Boundaries) → 12 (Snap-back) → 13 (Constraints) → 14-15 (Tests)
```
