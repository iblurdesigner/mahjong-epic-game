// Mahjong Tile Component - Simple flex tile
import React, { memo, useState, useRef, useCallback } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { DIMENSIONS } from '../constants/dimensions';
import type { Tile } from '../types';

interface TileProps {
  tile: Tile;
  isUnlocked: boolean;
  isSelected: boolean;
  onPress: (tileId: string) => void;
  onMove?: (tileId: string, row: number, col: number) => void;
  gameStatus?: 'idle' | 'playing' | 'paused' | 'gameover' | 'won';
  scale?: number;
}

function TileComponent({ 
  tile, 
  isUnlocked, 
  isSelected, 
  onPress, 
  onMove,
  gameStatus = 'playing',
  scale = 1,
}: TileProps) {
  // Simple press handler
  const handlePress = () => {
    if (isUnlocked && gameStatus === 'playing') {
      onPress(tile.id);
    }
  };

  // Parse symbol for display
  const symbolParts = tile.symbol.split('-');
  const suit = symbolParts[0];
  const value = symbolParts[1] || '';
  
  const getSymbolDisplay = () => {
    switch (suit) {
      case 'DOTS':
        return getDotsDisplay(value);
      case 'BAMBOO':
        return getBambooDisplay(value);
      case 'CHARACTER':
        return getCharacterDisplay(value);
      default:
        return value;
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
    width: 60,
    height: 80,
    backgroundColor: COLORS.tileBackground,
    borderRadius: 6,
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
    fontSize: 28,
    color: COLORS.textPrimary,
  },
  locked: {
    opacity: 0.4,
  },
});

export default memo(TileComponent);