// HomeScreen - Test Suite
import { render, fireEvent } from '@testing-library/react-native';

// Mock expo-router at the top
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

import HomeScreen from '../../screens/HomeScreen';

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the title', () => {
      const { getByText } = render(<HomeScreen />);
      
      expect(getByText('MAHJONG')).toBeTruthy();
    });

    it('should render the subtitle', () => {
      const { getByText } = render(<HomeScreen />);
      
      expect(getByText('EPIC')).toBeTruthy();
    });

    it('should render play button', () => {
      const { getByText } = render(<HomeScreen />);
      
      expect(getByText('JUGAR')).toBeTruthy();
    });

    it('should render settings button', () => {
      const { getByText } = render(<HomeScreen />);
      
      expect(getByText('AJUSTES')).toBeTruthy();
    });
  });

  describe('navigation', () => {
    it('should navigate to /levels when JUGAR is pressed', () => {
      const { getByText } = render(<HomeScreen />);
      
      fireEvent.press(getByText('JUGAR'));
      
      expect(mockPush).toHaveBeenCalledWith('/levels');
    });

    it('should navigate to /settings when AJUSTES is pressed', () => {
      const { getByText } = render(<HomeScreen />);
      
      fireEvent.press(getByText('AJUSTES'));
      
      expect(mockPush).toHaveBeenCalledWith('/settings');
    });
  });
});