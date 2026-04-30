// Layout Generator - Seeded PRNG with BFS Solvability
import { Tile, LevelConfig, TilePosition } from '../types';
import { getAllSymbols } from '../constants/suits';
import { DIFFICULTY_CONFIGS } from '../constants/difficulty';
import { seededRandom, shuffleSeeded, createSeededRandom } from './seedRandom';
import { isUnlocked } from './tileUnlock';

/**
 * Generate a Mahjong board layout
 * @param config - Level configuration
 * @returns Array of tiles
 */
export function generateLayout(config: LevelConfig): Tile[] {
  const difficultyConfig = DIFFICULTY_CONFIGS[config.difficulty];
  
  // Determine tile count
  const tileCount = seededRandom(
    `${config.seed}-count`,
    difficultyConfig.tileCountMin,
    difficultyConfig.tileCountMax + 1
  );
  
  // Ensure even number (pairs)
  const adjustedCount = tileCount % 2 === 0 ? tileCount : tileCount + 1;
  
  // Determine number of unique symbols (half the tile count)
  const uniqueSymbolCount = adjustedCount / 2;
  
  // Get available symbols
  const allSymbols = getAllSymbols();
  
  // Build symbol pairs - repeat symbols if needed to reach required count
  const symbolPairs: string[] = [];
  let symbolIndex = 0;
  
  while (symbolPairs.length < adjustedCount) {
    const symbol = allSymbols[symbolIndex % allSymbols.length];
    // Always add in pairs
    symbolPairs.push(symbol, symbol);
    symbolIndex++;
  }
  
  // Shuffle the pairs using seeded random
  const shuffledSymbols = shuffleSeeded(symbolPairs, `${config.seed}-symbols`);
  
  // Generate tile positions
  const positions = generatePositions(
    shuffledSymbols.length,
    difficultyConfig.layersMin,
    difficultyConfig.layersMax,
    `${config.seed}-positions`
  );
  
  // Create tiles
  const tiles: Tile[] = [];
  for (let i = 0; i < shuffledSymbols.length; i++) {
    tiles.push({
      id: `tile-${i}`,
      symbol: shuffledSymbols[i],
      position: positions[i],
      isRemoved: false,
    });
  }
  
  // Verify solvability and regenerate if needed
  let attempts = 0;
  let result = tiles;
  
  while (attempts < 3 && !checkSolvability(result)) {
    attempts++;
    // Regenerate with new seed suffix
    const newSeed = `${config.seed}-retry-${attempts}`;
    result = generateLayout({ ...config, seed: newSeed });
  }
  
  return result;
}

/**
 * Generate tile positions for the board
 */
function generatePositions(
  tileCount: number,
  minLayers: number,
  maxLayers: number,
  seed: string
): TilePosition[] {
  const positions: TilePosition[] = [];
  const random = createSeededRandom(seed);
  
  // Standard Mahjong board: rows 0-7, cols 0-12
  const maxRow = 8;
  const maxCol = 13;
  const numLayers = Math.floor(random() * (maxLayers - minLayers + 1)) + minLayers;
  
  // Track occupied positions
  const occupied = new Set<string>();
  
  for (let i = 0; i < tileCount; i++) {
    let row: number, col: number, layer: number;
    let attempts = 0;
    const maxAttempts = 100;
    
    // Find free position
    do {
      // Distribute tiles across layers
      if (i < tileCount * 0.7) {
        // 70% on layer 1
        layer = 1;
      } else if (i < tileCount * 0.9 && numLayers > 1) {
        // 20% on layer 2
        layer = 2;
      } else if (numLayers > 2) {
        // 10% on layer 3
        layer = 3;
      } else {
        layer = numLayers;
      }
      
      // Random position within bounds
      row = Math.floor(random() * maxRow);
      col = Math.floor(random() * maxCol);
      
      attempts++;
    } while (occupied.has(`${row},${col},${layer}`) && attempts < maxAttempts);
    
    // Skip if we couldn't find a position
    if (attempts >= maxAttempts) {
      // Use alternate strategy: place in grid pattern
      const gridIndex = i;
      row = Math.floor(gridIndex / maxCol) % maxRow;
      col = gridIndex % maxCol;
      layer = (gridIndex % numLayers) + 1;
    }
    
    occupied.add(`${row},${col},${layer}`);
    positions.push({ row, col, layer });
  }
  
  return positions;
}

/**
 * Check if a board is solvable using BFS
 * Finds if at least one pair of unlocked tiles exists
 */
export function checkSolvability(tiles: Tile[]): boolean {
  // Get active (not removed) tiles
  const activeTiles = tiles.filter(t => !t.isRemoved);
  
  if (activeTiles.length === 0) return true;
  if (activeTiles.length < 2) return false;
  
  // BFS: find any pair of unlocked matching tiles
  for (let i = 0; i < activeTiles.length; i++) {
    const tile1 = activeTiles[i];
    
    // Skip if locked
    if (!isUnlocked(tile1, tiles)) continue;
    
    for (let j = i + 1; j < activeTiles.length; j++) {
      const tile2 = activeTiles[j];
      
      // Skip if locked
      if (!isUnlocked(tile2, tiles)) continue;
      
      // Check if symbols match
      if (tile1.symbol === tile2.symbol) {
        return true;
      }
    }
  }
  
  // No valid pair found
  return false;
}

/**
 * Get all currently unlocked tiles
 */
export function getUnlockedTiles(tiles: Tile[]): Tile[] {
  return tiles.filter(t => !t.isRemoved && isUnlocked(t, tiles));
}

/**
 * Get all currently removable tile pairs
 */
export function getRemovablePairs(tiles: Tile[]): Array<[Tile, Tile]> {
  const unlocked = getUnlockedTiles(tiles);
  const pairs: Array<[Tile, Tile]> = [];
  
  for (let i = 0; i < unlocked.length; i++) {
    for (let j = i + 1; j < unlocked.length; j++) {
      if (unlocked[i].symbol === unlocked[j].symbol) {
        pairs.push([unlocked[i], unlocked[j]]);
      }
    }
  }
  
  return pairs;
}