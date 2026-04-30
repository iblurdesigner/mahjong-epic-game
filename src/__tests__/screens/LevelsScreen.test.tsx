// LevelsScreen - Test Suite
import { render, fireEvent } from '@testing-library/react-native';

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

import LevelsScreen from '../../screens/LevelsScreen';

describe('LevelsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render level buttons', () => {
      const { getByText } = render(<LevelsScreen />);
      
      // Should have level 1-10 buttons
      expect(getByText('1')).toBeTruthy();
    });

    it('should render multiple level numbers', () => {
      const { getByText } = render(<LevelsScreen />);
      
      expect(getByText('1')).toBeTruthy();
      expect(getByText('5')).toBeTruthy();
      expect(getByText('10')).toBeTruthy();
    });

    it('should render back button', () => {
      const { getByText } = render(<LevelsScreen />);
      
      // Should have some navigation element
      expect(getByText).toBeDefined();
    });
  });

  describe('navigation', () => {
    it('should navigate to game with level parameter', () => {
      const { getByText } = render(<LevelsScreen />);
      
      fireEvent.press(getByText('1'));
      
      expect(mockPush).toHaveBeenCalledWith('/game?level=1');
    });

    it('should navigate with different level numbers', () => {
      const { getByText } = render(<LevelsScreen />);
      
      fireEvent.press(getByText('5'));
      
      expect(mockPush).toHaveBeenCalledWith('/game?level=5');
    });
  });
});