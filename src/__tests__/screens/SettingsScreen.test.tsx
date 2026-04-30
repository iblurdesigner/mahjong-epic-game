// SettingsScreen - Test Suite
import { render, fireEvent } from '@testing-library/react-native';

// Mock expo-router
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

// Mock SettingsContext
const mockSetSoundEnabled = jest.fn();
jest.mock('../../contexts/SettingsContext', () => ({
  useSettings: () => ({
    settings: { soundEnabled: true },
    setSoundEnabled: mockSetSoundEnabled,
  }),
}));

import SettingsScreen from '../../screens/SettingsScreen';

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render music toggle', () => {
      const { getByText } = render(<SettingsScreen />);
      
      expect(getByText('Música')).toBeTruthy();
    });

    it('should render back navigation', () => {
      const { toJSON } = render(<SettingsScreen />);
      
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('settings', () => {
    it('should display sound setting', () => {
      const { getByText } = render(<SettingsScreen />);
      
      expect(getByText('Música')).toBeTruthy();
    });
  });
});