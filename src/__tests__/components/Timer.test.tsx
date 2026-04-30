// Timer Component - Test Suite
import { render } from '@testing-library/react-native';
import { Timer } from '../../components/Timer';

describe('Timer', () => {
  const defaultProps = {
    elapsedSeconds: 0,
    totalSeconds: 300, // 5 minutes
    isPaused: false,
  };

  describe('display format', () => {
    it('should display remaining time when elapsed is 0', () => {
      const { getByText } = render(<Timer {...defaultProps} elapsedSeconds={0} totalSeconds={300} />);
      
      // Shows remaining time: 300 - 0 = 300 seconds = 05:00
      expect(getByText('05:00')).toBeTruthy();
    });

    it('should display MM:SS format correctly for remaining time', () => {
      const { getByText } = render(<Timer {...defaultProps} elapsedSeconds={65} totalSeconds={300} />);
      
      // Remaining: 300 - 65 = 235 seconds = 3:55
      expect(getByText('03:55')).toBeTruthy();
    });

    it('should display single digit seconds with leading zero', () => {
      const { getByText } = render(<Timer {...defaultProps} elapsedSeconds={241} totalSeconds={300} />);
      
      // Remaining: 300 - 241 = 59 seconds = 00:59
      expect(getByText('00:59')).toBeTruthy();
    });

    it('should display 00:00 when time is up', () => {
      const { getByText } = render(<Timer {...defaultProps} elapsedSeconds={300} totalSeconds={300} />);
      
      expect(getByText('00:00')).toBeTruthy();
    });

    it('should display 00:00 when elapsed exceeds total', () => {
      const { getByText } = render(<Timer {...defaultProps} elapsedSeconds={400} totalSeconds={300} />);
      
      // Should not go negative
      expect(getByText('00:00')).toBeTruthy();
    });

    it('should handle 0 total seconds', () => {
      const { getByText } = render(<Timer {...defaultProps} elapsedSeconds={0} totalSeconds={0} />);
      
      expect(getByText('00:00')).toBeTruthy();
    });
  });

  describe('paused state', () => {
    it('should handle paused state', () => {
      const { toJSON } = render(<Timer {...defaultProps} isPaused={true} />);
      
      expect(toJSON()).toBeTruthy();
    });

    it('should handle playing state', () => {
      const { toJSON } = render(<Timer {...defaultProps} isPaused={false} />);
      
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('visual states', () => {
    it('should render without crashing', () => {
      const { toJSON } = render(<Timer {...defaultProps} />);
      
      expect(toJSON()).toBeTruthy();
    });

    it('should render with different elapsed values', () => {
      const { toJSON, rerender } = render(<Timer {...defaultProps} elapsedSeconds={0} />);
      expect(toJSON()).toBeTruthy();

      rerender(<Timer {...defaultProps} elapsedSeconds={100} />);
      expect(toJSON()).toBeTruthy();

      rerender(<Timer {...defaultProps} elapsedSeconds={200} />);
      expect(toJSON()).toBeTruthy();
    });
  });
});