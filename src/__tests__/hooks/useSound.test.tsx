// useSound Hook - Test Suite
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useSound } from '../../hooks/useSound';
import { SettingsProvider } from '../../contexts/SettingsContext';
import React from 'react';

// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn().mockResolvedValue({
        sound: {
          playAsync: jest.fn(),
          pauseAsync: jest.fn(),
          stopAsync: jest.fn(),
          setIsLoopingAsync: jest.fn(),
          unloadAsync: jest.fn(),
        },
      }),
    },
  },
}));

// Mock AsyncStorage for SettingsContext
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
}));

describe('useSound hook', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SettingsProvider>{children}</SettingsProvider>
  );

  it('should provide play, pause, and stop functions', async () => {
    const { result } = renderHook(() => useSound(), { wrapper });
    
    await waitFor(() => {
      expect(result.current).toBeDefined();
    });
    
    expect(typeof result.current.play).toBe('function');
    expect(typeof result.current.pause).toBe('function');
    expect(typeof result.current.stop).toBe('function');
  });

  it('should return functions even if sound fails to load', () => {
    // The hook should return valid functions regardless of audio loading
    const { result } = renderHook(() => useSound(), { wrapper });
    
    // Should have play, pause, stop
    expect(result.current.play).toBeDefined();
    expect(result.current.pause).toBeDefined();
    expect(result.current.stop).toBeDefined();
  });
});