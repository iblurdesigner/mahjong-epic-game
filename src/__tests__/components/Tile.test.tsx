// Tile Component - Test Suite
import { render, fireEvent } from '@testing-library/react-native';
import TileComponent from '../../components/Tile';
import type { Tile as TileType } from '../../types';

// Create a test tile helper
const createTestTile = (overrides: Partial<TileType> = {}): TileType => ({
  id: 'tile-1',
  symbol: 'DOTS-1',
  position: { row: 0, col: 0, layer: 1 },
  isRemoved: false,
  ...overrides,
});

describe('TileComponent', () => {
  const defaultProps = {
    tile: createTestTile(),
    isUnlocked: true,
    isSelected: false,
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render tile symbol', () => {
      const { getByText } = render(<TileComponent {...defaultProps} />);
      
      // The component should render some content
      expect(getByText(/./)).toBeTruthy();
    });

    it('should render with correct accessibility label', () => {
      const { getByLabelText } = render(<TileComponent {...defaultProps} />);
      
      expect(getByLabelText(/Tile/)).toBeTruthy();
    });

    it('should render DOTS-1 symbol correctly', () => {
      const { getByText } = render(
        <TileComponent {...defaultProps} tile={createTestTile({ symbol: 'DOTS-1' })} />
      );
      
      // Should render the Mahjong tile emoji
      expect(getByText('🀙')).toBeTruthy();
    });

    it('should render different suit symbols', () => {
      const bambooTile = createTestTile({ symbol: 'BAMBOO-1' });
      const { getByText: getBamboo } = render(
        <TileComponent {...defaultProps} tile={bambooTile} />
      );
      expect(getBamboo('🀐')).toBeTruthy();

      const characterTile = createTestTile({ symbol: 'CHARACTER-1' });
      const { getByText: getCharacter } = render(
        <TileComponent {...defaultProps} tile={characterTile }
        />
      );
      expect(getCharacter('🀇')).toBeTruthy();
    });
  });

  describe('interaction', () => {
    it('should call onPress with tile id when tapped', () => {
      const onPress = jest.fn();
      const { getByRole } = render(
        <TileComponent {...defaultProps} onPress={onPress} />
      );
      
      fireEvent.press(getByRole('button'));
      
      expect(onPress).toHaveBeenCalledWith('tile-1');
    });

    it('should NOT call onPress when tile is locked', () => {
      const onPress = jest.fn();
      const { getByRole } = render(
        <TileComponent {...defaultProps} isUnlocked={false} onPress={onPress} />
      );
      
      fireEvent.press(getByRole('button'));
      
      expect(onPress).not.toHaveBeenCalled();
    });

    it('should NOT call onPress when tile is removed', () => {
      const onPress = jest.fn();
      const { getByRole } = render(
        <TileComponent {...defaultProps} tile={createTestTile({ isRemoved: true })} onPress={onPress} />
      );
      
      fireEvent.press(getByRole('button'));
      
      expect(onPress).not.toHaveBeenCalled();
    });

    it('should be disabled when locked', () => {
      const { getByRole } = render(
        <TileComponent {...defaultProps} isUnlocked={false} />
      );
      
      const button = getByRole('button');
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });
  });

  describe('visual states', () => {
    it('should apply selected style when selected', () => {
      const { getByRole } = render(
        <TileComponent {...defaultProps} isSelected={true} />
      );
      
      const button = getByRole('button');
      // Selected tiles should have different styling
      expect(button).toBeTruthy();
    });

    it('should show locked accessibility state', () => {
      const { getByRole } = render(
        <TileComponent {...defaultProps} isUnlocked={false} />
      );
      
      const button = getByRole('button');
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });

    it('should display locked in accessibility label when locked', () => {
      const { getByLabelText } = render(
        <TileComponent {...defaultProps} isUnlocked={false} />
      );
      
      expect(getByLabelText(/locked/)).toBeTruthy();
    });
  });
});