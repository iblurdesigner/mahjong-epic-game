// Mahjong Tile Component with REAL Drag-Drop Support (NO Reanimated)
import React, { memo, useState, useRef, useCallback } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
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
  boardWidth?: number;
  boardHeight?: number;
  scale?: number;
}

function TileComponent({ 
  tile, 
  isUnlocked, 
  isSelected, 
  onPress, 
  onMove,
  gameStatus = 'playing',
  boardWidth = 1000,
  boardHeight = 800,
  scale = 1,
}: TileProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [visualOffset, setVisualOffset] = useState({ x: 0, y: 0 });
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Determine if drag is allowed
  const canDrag = isUnlocked && gameStatus === 'playing';

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

  const handlePress = () => {
    if (!isDragging) {
      onPress(tile.id);
    }
  };

  const handlePressIn = useCallback(() => {
    if (!canDrag) return;
    
    // Start long-press detection
    longPressTimeout.current = setTimeout(() => {
      setIsDragging(true);
    }, 500);
  }, [canDrag]);

  const handlePressOut = useCallback(() => {
    // Cancel long-press timeout
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  }, []);

  const handleGestureEvent = useCallback((event: any) => {
    // Track finger movement for visual feedback
    const { translationX, translationY } = event.nativeEvent;
    setVisualOffset({
      x: translationX || 0,
      y: translationY || 0,
    });
  }, []);

  const handleHandlerStateChange = useCallback((event: any) => {
    const { state, translationX, translationY } = event.nativeEvent;
    
    if (state === State.ACTIVE) {
      // Drag is active - visual feedback already handled by gesture event
    }
    
    if (state === State.END || state === State.CANCELLED) {
      if (isDragging && onMove) {
        // Calculate new grid position based on pixel movement
        const tileWidth = DIMENSIONS.tileWidth * scale;
        const tileHeight = DIMENSIONS.tileHeight * scale;
        const margin = DIMENSIONS.tileMargin * scale;
        
        // Convert pixel movement to grid movement
        const gridDeltaCol = Math.round((translationX || 0) / (tileWidth + margin));
        const gridDeltaRow = Math.round((translationY || 0) / (tileHeight + margin));
        
        const newRow = Math.max(0, tile.position.row + gridDeltaRow);
        const newCol = Math.max(0, tile.position.col + gridDeltaCol);
        
        // Dispatch the move action if position changed
        if (newRow !== tile.position.row || newCol !== tile.position.col) {
          onMove(tile.id, newRow, newCol);
        }
      }
      
      // Reset visual offset
      setVisualOffset({ x: 0, y: 0 });
      setIsDragging(false);
      
      // Cancel long-press timeout
      if (longPressTimeout.current) {
        clearTimeout(longPressTimeout.current);
        longPressTimeout.current = null;
      }
    }
  }, [isDragging, tile.position, scale, onMove]);

  // Calculate pixel position from grid position
  const tileWidth = DIMENSIONS.tileWidth * scale;
  const tileHeight = DIMENSIONS.tileHeight * scale;
  const margin = DIMENSIONS.tileMargin * scale;
  const layerOffsetX = DIMENSIONS.layerOffsetX * scale;
  const layerOffsetY = DIMENSIONS.layerOffsetY * scale;
  
  const baseLeft = (tile.position.col * (tileWidth + margin) + tile.position.layer * layerOffsetX) * scale;
  const baseTop = (tile.position.row * (tileHeight + margin) + tile.position.layer * layerOffsetY) * scale;

  // Dynamic styles
  const containerStyle = [
    styles.container,
    {
      left: baseLeft + visualOffset.x,
      top: baseTop + visualOffset.y,
      zIndex: isDragging ? 9999 : tile.position.layer * 100 + tile.position.row,
    },
    isSelected && styles.selected,
    !isUnlocked && styles.locked,
    tile.isRemoved && styles.removed,
  ];

  const tileBodyStyle = [
    styles.tileBody,
    isSelected && styles.tileBodySelected,
    isDragging && styles.dragging,
    isDragging && { transform: [{ scale: 1.05 }] },
  ];

  return (
    <PanGestureHandler
      onGestureEvent={handleGestureEvent}
      onHandlerStateChange={handleHandlerStateChange}
      enabled={canDrag}
    >
      <View style={containerStyle}>
        <Pressable
          style={[styles.pressableContainer]}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={!isUnlocked || tile.isRemoved || isDragging}
          accessibilityRole="button"
          accessibilityLabel={`Tile ${tile.symbol}${!isUnlocked ? ' locked' : ''}`}
          accessibilityState={{ disabled: !isUnlocked || tile.isRemoved || isDragging }}
        >
          <View style={tileBodyStyle}>
            <Text style={[styles.symbol, { fontSize: 120 * scale }]}>{getSymbolDisplay()}</Text>
          </View>
          <View style={styles.shadow} />
        </Pressable>
      </View>
    </PanGestureHandler>
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
  container: {
    position: 'absolute',
  },
  pressableContainer: {
    flex: 1,
  },
  tileBody: {
    flex: 1,
    backgroundColor: COLORS.tileBackground,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.tileBorder,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.tileShadow,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  tileBodySelected: {
    borderColor: COLORS.tileSelected,
    borderWidth: 4,
  },
  symbol: {
    color: COLORS.textPrimary,
  },
  shadow: {
    position: 'absolute',
    bottom: -8,
    left: 8,
    right: 0,
    height: 8,
    backgroundColor: COLORS.tileShadow,
    opacity: 0.2,
    borderRadius: 4,
  },
  selected: {
    zIndex: 100,
  },
  locked: {
    opacity: 0.5,
  },
  removed: {
    opacity: 0,
  },
  dragging: {
    opacity: 0.8,
  },
});

export default memo(TileComponent);
