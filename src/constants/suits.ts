// Mahjong Tile Suits and Symbols
import { TileSuit } from '../types';

// Dots suit (numbers 1-9)
export const DOTS_SUIT: TileSuit = 'DOTS';
export const DOTS_SYMBOLS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

// Bamboo suit (numbers 1-9)
export const BAMBOO_SUIT: TileSuit = 'BAMBOO';
export const BAMBOO_SYMBOLS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

// Character suit (numbers 1-9 + special)
export const CHARACTER_SUIT: TileSuit = 'CHARACTER';
export const CHARACTER_SYMBOLS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'N']; // N = Wan/Nine

// All suits configuration
export const TILE_SUITS = [
  { suit: DOTS_SUIT, symbols: DOTS_SYMBOLS },
  { suit: BAMBOO_SUIT, symbols: BAMBOO_SYMBOLS },
  { suit: CHARACTER_SUIT, symbols: CHARACTER_SYMBOLS },
] as const;

// Generate all possible symbols
export function getAllSymbols(): string[] {
  const symbols: string[] = [];
  for (const { suit, symbols: syms } of TILE_SUITS) {
    for (const sym of syms) {
      symbols.push(`${suit}-${sym}`);
    }
  }
  return symbols;
}

// Get symbol index
export function getSymbolIndex(symbol: string): number {
  const allSymbols = getAllSymbols();
  return allSymbols.indexOf(symbol);
}