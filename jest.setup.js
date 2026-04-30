// Jest setup file for Mahjong Epic
// Note: @testing-library/react-native v13+ includes matchers automatically

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  return {
    PanGestureHandler: ({ children }: { children: React.ReactNode }) => children,
    GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => children,
    State: { ACTIVE: 'ACTIVE', BEGAN: 'BEGAN', END: 'END', FAILED: 'FAILED', CANCELLED: 'CANCELLED' },
    GestureHandlerStateEnum: { ACTIVE: 'ACTIVE', BEGAN: 'BEGAN', END: 'END' },
  };
});

// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(),
    },
  },
}));

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);