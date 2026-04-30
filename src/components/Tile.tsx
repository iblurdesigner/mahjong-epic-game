// Mahjong Tile Component - Fits exactly in iPad screen
import React, { memo } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import type { Tile } from '../types';

interface TileProps {
  tile: Tile;
  isUnlocked: boolean;
  isSelected: boolean;
  onPress: (tileId: string) => void;
  gameStatus?: 'idle' | 'playing' | 'paused' | 'gameover' | 'won';
}

// SIZE PARA 6x6 GRID EN IPAD - todovisible sin scroll
const TILE_WIDTH = 90;
const TILE_HEIGHT = 120;
const SYMBOL_SIZE = 56;

function TileComponent({ 
  tile, 
  isUnlocked, 
  isSelected, 
  onPress, 
  gameStatus = 'playing',
}: TileProps) {
  const handlePress = () => {
    if (isUnlocked && gameStatus === 'playing') {
      onPress(tile.id);
    }
  };

  const symbolParts = tile.symbol.split('-');
  const suit = symbolParts[0];
  const value = symbolParts[1] || '';
  
  const getSymbolDisplay = () => {
    switch (suit) {
      case 'DOTS': return getDotsDisplay(value);
      case 'BAMBOO': return getBambooDisplay(value);
      case 'CHARACTER': return getCharacterDisplay(value);
      default: return value;
    }
  };

  return (
    <Pressable
      style={[
        styles.tileBody,
        isSelected && styles.tileBodySelected,
        !isUnlocked && styles.locked,
      ]}
      onPress={handlePress}
      disabled={!isUnlocked || tile.isRemoved || gameStatus !== 'playing'}
      accessibilityRole="button"
      accessibilityLabel={`Tile ${tile.symbol}${!isUnlocked ? ' locked' : ''}`}
    >
      <Text style={styles.symbol}>{getSymbolDisplay()}</Text>
    </Pressable>
  );
}

function getDotsDisplay(value: string): string {
  const dots: Record<string, string> = { '1': '🀙', '2': '🀚', '3': '🀛', '4': '🀜', '5': '🀝', '6': '🀞', '7': '🀟', '8': '🀠', '9': '🀡' };
  return dots[value] || value;
}

function getBambooDisplay(value: string): string {
  const bamboo: Record<string, string> = { '1': '🀐', '2': '🀑', '3': '🀒', '4': '🀓', '5': '🀔', '6': '🀕', '7': '🀖', '8': '🀗', '9': '🀘' };
  return bamboo[value] || value;
}

function getCharacterDisplay(value: string): string {
  const character: Record<string, string> = { '1': '🀇', '2': '🀈', '3': '🀉', '4': '🀊', '5': '🀋', '6': '🀌', '7': '🀍', '8': '🀎', '9': '🀏', 'N': '🀀' };
  return character[value] || value;
}

const styles = StyleSheet.create({
  tileBody: {
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
    backgroundColor: COLORS.tileBackground,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.tileBorder,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    shadowColor: COLORS.tileShadow,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  tileBodySelected: {
    borderColor: COLORS.tileSelected,
    borderWidth: 4,
    backgroundColor: COLORS.tileSelected,
  },
  symbol: {
    fontSize: SYMBOL_SIZE,
    color: COLORS.textPrimary,
  },
  locked: {
    opacity: 0.4,
  },
});

export default memo(TileComponent);