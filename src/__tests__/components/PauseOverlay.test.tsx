// PauseOverlay Component - Test Suite
import { render, fireEvent } from '@testing-library/react-native';
import { PauseOverlay } from '../../components/PauseOverlay';

describe('PauseOverlay', () => {
  const defaultProps = {
    visible: true,
    onResume: jest.fn(),
    onQuit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render when visible', () => {
      const { getByText } = render(<PauseOverlay {...defaultProps} />);
      
      expect(getByText('PAUSA')).toBeTruthy();
    });

    it('should not render when not visible', () => {
      const { queryByText } = render(<PauseOverlay {...defaultProps} visible={false} />);
      
      expect(queryByText('PAUSA')).toBeNull();
    });

    it('should render resume button', () => {
      const { getByText } = render(<PauseOverlay {...defaultProps} />);
      
      expect(getByText('Continuar')).toBeTruthy();
    });

    it('should render quit button', () => {
      const { getByText } = render(<PauseOverlay {...defaultProps} />);
      
      expect(getByText('Salir')).toBeTruthy();
    });
  });

  describe('interaction', () => {
    it('should call onResume when continue button pressed', () => {
      const onResume = jest.fn();
      const { getByText } = render(<PauseOverlay {...defaultProps} onResume={onResume} />);
      
      fireEvent.press(getByText('Continuar'));
      
      expect(onResume).toHaveBeenCalled();
    });

    it('should call onQuit when quit button pressed', () => {
      const onQuit = jest.fn();
      const { getByText } = render(<PauseOverlay {...defaultProps} onQuit={onQuit} />);
      
      fireEvent.press(getByText('Salir'));
      
      expect(onQuit).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should render with proper text content', () => {
      const { getByText } = render(<PauseOverlay {...defaultProps} />);
      
      // Just verify the main text is rendered
      expect(getByText('PAUSA')).toBeTruthy();
    });
  });
});