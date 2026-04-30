// LevelCard Component - Test Suite
import { render, fireEvent } from '@testing-library/react-native';
import { LevelCard } from '../../components/LevelCard';

describe('LevelCard', () => {
  const defaultProps = {
    level: 1,
    difficulty: 'easy',
    isUnlocked: true,
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render level number', () => {
      const { getByText } = render(<LevelCard {...defaultProps} />);
      
      expect(getByText('1')).toBeTruthy();
    });

    it('should render level with different numbers', () => {
      const { getByText: get1 } = render(<LevelCard {...defaultProps} level={5} />);
      expect(get1('5')).toBeTruthy();

      const { getByText: get2 } = render(<LevelCard {...defaultProps} level={10} />);
      expect(get2('10')).toBeTruthy();
    });

    it('should render difficulty label', () => {
      const { getByText } = render(<LevelCard {...defaultProps} difficulty="easy" />);
      
      expect(getByText(/easy/i)).toBeTruthy();
    });

    it('should render different difficulty labels', () => {
      const { getByText: getMedium } = render(<LevelCard {...defaultProps} difficulty="medium" />);
      expect(getMedium(/medium/i)).toBeTruthy();

      const { getByText: getHard } = render(<LevelCard {...defaultProps} difficulty="hard" />);
      expect(getHard(/hard/i)).toBeTruthy();
    });
  });

  describe('interaction', () => {
    it('should call onPress with level when pressed', () => {
      const onPress = jest.fn();
      const { getByText } = render(<LevelCard {...defaultProps} onPress={onPress} level={3} />);
      
      fireEvent.press(getByText('3'));
      
      expect(onPress).toHaveBeenCalledWith(3);
    });

    it('should NOT call onPress when locked', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <LevelCard {...defaultProps} onPress={onPress} isUnlocked={false} />
      );
      
      fireEvent.press(getByText('1'));
      
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('locked state', () => {
    it('should show locked indicator', () => {
      const { toJSON } = render(<LevelCard {...defaultProps} isUnlocked={false} />);
      
      expect(toJSON()).toBeTruthy();
    });

    it('should be accessible as disabled when locked', () => {
      const { getByLabelText } = render(<LevelCard {...defaultProps} isUnlocked={false} />);
      
      const card = getByLabelText(/locked/);
      expect(card.props.accessibilityState?.disabled).toBe(true);
    });
  });
});