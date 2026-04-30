// Game Board Component - Simple flex-wrap layout
import React from 'react';
import { View, StyleSheet } from 'react-native';
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
  // Simple flex layout - tiles flow automatically
  const activeTiles = tiles.filter(t => !t.isRemoved);

  return (
    <View style={styles.board}>
      {activeTiles.map(tile => {
        const isUnlocked = checkUnlocked(tile, tiles);
        const isSelected = tile.id === selectedTileId;
        
        return (
          <TileComponent
            key={tile.id}
            tile={tile}
            isUnlocked={isUnlocked}
            isSelected={isSelected}
            onPress={onTilePress}
            onMove={onTileMove}
            gameStatus={gameStatus}
            scale={1}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
    padding: DIMENSIONS.boardPadding,
    maxWidth: '100%',
  },
});

export default BoardComponent;
export { BoardComponent as Board };