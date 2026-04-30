// Game Board Component - All visible, no scroll
import React from 'react';
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
  gameStatus?: 'idle' | 'playing' | 'paused' | 'gameover' | 'won';
}

function BoardComponent({ 
  tiles, 
  selectedTileId, 
  onTilePress, 
  gameStatus = 'playing',
}: BoardProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  
  // Calcular grid que entra en pantalla
  // Header ~150px, Board padding ~32px
  const availableHeight = screenHeight - 250;
  const availableWidth = screenWidth - 64;
  
  // 90x120 + margin 4 = 94x124 por celda
  const cols = Math.floor(availableWidth / 94);
  const rows = Math.floor(availableHeight / 124);
  const maxVisible = cols * rows;
  
  const activeTiles = tiles.filter(t => !t.isRemoved).slice(0, maxVisible);

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
            gameStatus={gameStatus}
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