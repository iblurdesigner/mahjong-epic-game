// Game Board Component - Renders all tiles with 3D layering
import React, { memo, useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { COLORS } from '../constants/colors';
import { DIMENSIONS } from '../constants/dimensions';
import { Tile as TileType } from '../types';
import { isUnlocked as checkUnlocked } from '../utils/tileUnlock';
import TileComponent from './Tile';

interface BoardProps {
  tiles: TileType[];
  selectedTileId: string | null;
  onTilePress: (tileId: string) => void;
  onTileMove?: (tileId: string, row: number, col: number) => void;
  gameStatus?: 'idle' | 'playing' | 'paused' | 'gameover' | 'won';
  draggingTileId?: string | null;
}

function BoardComponent({ 
  tiles, 
  selectedTileId, 
  onTilePress, 
  onTileMove,
  gameStatus = 'playing',
  draggingTileId = null,
}: BoardProps) {  
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  
  // Calculate board dimensions FROM ACTUAL TILES
  const maxCol = tiles.length > 0
    ? Math.max(...tiles.map(t => t.position.col))
    : 13;
  const maxRow = tiles.length > 0
    ? Math.max(...tiles.map(t => t.position.row))
    : 7;
  
  // Base dimensions (without scale)
  const baseTileWidth = DIMENSIONS.tileWidth;
  const baseTileHeight = DIMENSIONS.tileHeight;
  const margin = DIMENSIONS.tileMargin;
  const layerOffsetX = DIMENSIONS.layerOffsetX;
  const layerOffsetY = DIMENSIONS.layerOffsetY;
  
  // Calculate board size at scale 1
  const baseBoardWidth = (maxCol + 1) * (baseTileWidth + margin) + (3 * layerOffsetX) + DIMENSIONS.boardPadding * 2;
  const baseBoardHeight = (maxRow + 1) * (baseTileHeight + margin) + (3 * layerOffsetY) + DIMENSIONS.boardPadding * 2;
  
  // Calculate scale to fit screen (with padding for scroll)
  const availableWidth = screenWidth - DIMENSIONS.screenPadding * 2;
  const availableHeight = screenHeight - 200; // Reserve space for header
  const scaleX = availableWidth / baseBoardWidth;
  const scaleY = availableHeight / baseBoardHeight;
  const scale = Math.min(scaleX, scaleY, 1); // Never upscale beyond 1
  
  // Apply scale to dimensions
  const tileWidth = baseTileWidth * scale;
  const tileHeight = baseTileHeight * scale;
  const scaledMargin = margin * scale;
  const scaledLayerOffsetX = layerOffsetX * scale;
  const scaledLayerOffsetY = layerOffsetY * scale;
  
  // Calculate final board dimensions
  const boardWidth = baseBoardWidth * scale;
  const boardHeight = baseBoardHeight * scale;
  
  // Calculate tile positions
  const positionedTiles = useMemo(() => {
    return tiles
      .filter(t => !t.isRemoved)
      .map(tile => {
        const { row, col, layer } = tile.position;      
        return {
          tile,
          left: (col * (tileWidth + scaledMargin)) + (layer * scaledLayerOffsetX) + DIMENSIONS.boardPadding * scale,
          top: (row * (tileHeight + scaledMargin)) + (layer * scaledLayerOffsetY) + DIMENSIONS.boardPadding * scale,
          zIndex: layer * 100 + row,
          isUnlocked: checkUnlocked(tile, tiles),
          isSelected: tile.id === selectedTileId,
        };
      })
      .sort((a, b) => a.zIndex - b.zIndex);
  }, [tiles, selectedTileId, scale, tileWidth, tileHeight, scaledMargin, scaledLayerOffsetX, scaledLayerOffsetY]);

  return (
    <View 
      style={[
        styles.board, 
        { 
          width: boardWidth, 
          height: boardHeight,
        }
      ]}
    >
      {positionedTiles.map(({ tile, left, top, zIndex, isUnlocked, isSelected }) => (
        <View
          key={tile.id}
          style={[
            styles.tileWrapper,
            { left, top, zIndex },
          ]}
        >
          <TileComponent
            tile={tile}
            isUnlocked={isUnlocked}
            isSelected={isSelected}
            onPress={onTilePress}
            onMove={onTileMove}
            gameStatus={gameStatus}
            boardWidth={boardWidth}
            boardHeight={boardHeight}
            scale={scale}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    position: 'relative',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
  },
  tileWrapper: {
    position: 'absolute',
  },
});

export const Board = memo(BoardComponent);
