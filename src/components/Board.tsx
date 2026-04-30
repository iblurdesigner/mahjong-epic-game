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
  
  // Calculate scale to fit board in screen
  const boardWidth = 14 * (DIMENSIONS.tileWidth + DIMENSIONS.tileMargin);
  const boardHeight = 9 * (DIMENSIONS.tileHeight + DIMENSIONS.tileMargin);
  
  const scaleX = (screenWidth - DIMENSIONS.boardPadding * 2 - 60) / boardWidth;
  const scaleY = (screenHeight - 200) / boardHeight;
  const scale = Math.min(scaleX, scaleY, 1); // No bigger than 1
  
  // Calculate tile positions with 3D offset
  const positionedTiles = useMemo(() => {
    return tiles
      .filter(t => !t.isRemoved)
      .map(tile => {
        const { row, col, layer } = tile.position;
        
        return {
          tile,
          left: (col * (DIMENSIONS.tileWidth + DIMENSIONS.tileMargin) + layer * DIMENSIONS.layerOffsetX) * scale,
          top: (row * (DIMENSIONS.tileHeight + DIMENSIONS.tileMargin) + layer * DIMENSIONS.layerOffsetY) * scale,
          zIndex: layer * 100 + row,
          isUnlocked: checkUnlocked(tile, tiles),
          isSelected: tile.id === selectedTileId,
        };
      })
      .sort((a, b) => a.zIndex - b.zIndex);
  }, [tiles, selectedTileId, scale]);

  const scaledBoardWidth = boardWidth * scale + DIMENSIONS.boardPadding * 2;
  const scaledBoardHeight = boardHeight * scale + DIMENSIONS.boardPadding * 2;

  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.board, 
          { 
            width: scaledBoardWidth, 
            height: scaledBoardHeight,
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
              boardWidth={scaledBoardWidth}
              boardHeight={scaledBoardHeight}
              scale={scale}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  board: {
    position: 'relative',
    padding: DIMENSIONS.boardPadding,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
  },
  tileWrapper: {
    position: 'absolute',
  },
});

export const Board = memo(BoardComponent);
