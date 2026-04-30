// Tile Unlock Rules - Pure Functions
import { Tile } from '../types';

/**
 * Check if a tile has another tile directly above it
 * @param tile - The tile to check
 * @param allTiles - All tiles on the board
 * @returns true if there is a tile in the layer immediately above at the same row/col
 */
export function hasTileAbove(tile: Tile, allTiles: Tile[]): boolean {
  const { row, col, layer } = tile.position;
  
  // Check if any tile exists at same row/col in layer + 1
  return allTiles.some(t => 
    !t.isRemoved && 
    t.position.row === row && 
    t.position.col === col && 
    t.position.layer === layer + 1
  );
}

/**
 * Check if the left side of a tile is free
 * @param tile - The tile to check
 * @param allTiles - All tiles on the board
 * @returns true if left side is not blocked
 */
export function isLeftFree(tile: Tile, allTiles: Tile[]): boolean {
  const { row, col, layer } = tile.position;
  
  // Leftmost edge is always blocked (like a wall)
  if (col === 0) return false;
  
  // Check if any tile exists at same row, layer, but col - 1
  const hasLeftBlocker = allTiles.some(t => 
    !t.isRemoved && 
    t.position.row === row && 
    t.position.col === col - 1 && 
    t.position.layer === layer
  );
  
  return !hasLeftBlocker;
}

/**
 * Check if the right side of a tile is free
 * @param tile - The tile to check
 * @param allTiles - All tiles on the board
 * @returns true if right side is not blocked
 */
export function isRightFree(tile: Tile, allTiles: Tile[]): boolean {
  const { row, col, layer } = tile.position;
  
  // Rightmost edge (col 12 for standard mahjong) is always blocked
  if (col === 12) return false;
  
  // Check if any tile exists at same row, layer, but col + 1
  const hasRightBlocker = allTiles.some(t => 
    !t.isRemoved && 
    t.position.row === row && 
    t.position.col === col + 1 && 
    t.position.layer === layer
  );
  
  return !hasRightBlocker;
}

/**
 * Check if a tile is unlocked (selectable)
 * A tile is unlocked when:
 * - No tile is directly above it AND
 * - At least one side (left OR right) is free
 * @param tile - The tile to check
 * @param allTiles - All tiles on the board
 * @returns true if tile is selectable
 */
export function isUnlocked(tile: Tile, allTiles: Tile[]): boolean {
  const noTileAbove = !hasTileAbove(tile, allTiles);
  const leftFree = isLeftFree(tile, allTiles);
  const rightFree = isRightFree(tile, allTiles);
  
  return noTileAbove && (leftFree || rightFree);
}