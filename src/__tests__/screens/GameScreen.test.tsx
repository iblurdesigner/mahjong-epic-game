// GameScreen - Test Suite
import { render } from '@testing-library/react-native';

// Mock dependencies
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ level: '1' }),
  useRouter: () => ({
    back: jest.fn(),
  }),
}));

jest.mock('../../hooks/useGameState', () => ({
  useGameState: () => ({
    tiles: [
      { id: 't1', symbol: 'DOTS-1', position: { row: 0, col: 0, layer: 1 }, isRemoved: false },
      { id: 't2', symbol: 'DOTS-1', position: { row: 0, col: 1, layer: 1 }, isRemoved: false },
    ],
    selectedTileId: null,
    score: 0,
    elapsedSeconds: 0,
    status: 'playing',
    startLevel: jest.fn(),
    selectTile: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    tick: jest.fn(),
    gameOver: jest.fn(),
    reset: jest.fn(),
  }),
}));

jest.mock('../../components/Board', () => ({
  Board: () => null,
}));

jest.mock('../../components/Timer', () => ({
  Timer: () => null,
}));

import GameScreen from '../../screens/GameScreen';

describe('GameScreen', () => {
  describe('rendering', () => {
    it('should render without crashing', () => {
      const { toJSON } = render(<GameScreen />);
      
      expect(toJSON()).toBeTruthy();
    });

    it('should display level number', () => {
      const { getByText } = render(<GameScreen />);
      
      expect(getByText(/Nivel/)).toBeTruthy();
    });

    it('should display score', () => {
      const { getByText } = render(<GameScreen />);
      
      expect(getByText(/Puntos/)).toBeTruthy();
    });

    it('should display pause button when playing', () => {
      const { getByText } = render(<GameScreen />);
      
      expect(getByText('PAUSA')).toBeTruthy();
    });
  });

  describe('game states', () => {
    it('should render in playing state', () => {
      const { toJSON } = render(<GameScreen />);
      
      expect(toJSON()).toBeTruthy();
    });
  });
});