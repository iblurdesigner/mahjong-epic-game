// Settings Context - Test Suite
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { SettingsProvider, useSettings, defaultSettings } from '../contexts/SettingsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('SettingsContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue(undefined);
  });

  describe('initial state', () => {
    it('should have sound enabled by default', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <SettingsProvider>{children}</SettingsProvider>
      );
      
      const { result } = renderHook(() => useSettings(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.settings.soundEnabled).toBe(true);
      });
    });

    it('should load saved settings from AsyncStorage', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(
        JSON.stringify({ soundEnabled: false })
      );
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <SettingsProvider>{children}</SettingsProvider>
      );
      
      const { result } = renderHook(() => useSettings(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.settings.soundEnabled).toBe(false);
      });
    });

    it('should merge saved settings with defaults', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(
        JSON.stringify({ soundEnabled: false })
      );
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <SettingsProvider>{children}</SettingsProvider>
      );
      
      const { result } = renderHook(() => useSettings(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.settings.soundEnabled).toBe(false);
      });
    });
  });

  describe('setSoundEnabled', () => {
    it('should update soundEnabled state', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <SettingsProvider>{children}</SettingsProvider>
      );
      
      const { result } = renderHook(() => useSettings(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.settings.soundEnabled).toBe(true);
      });
      
      await act(async () => {
        await result.current.setSoundEnabled(false);
      });
      
      expect(result.current.settings.soundEnabled).toBe(false);
    });

    it('should save to AsyncStorage when soundEnabled changes', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <SettingsProvider>{children}</SettingsProvider>
      );
      
      const { result } = renderHook(() => useSettings(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.settings.soundEnabled).toBe(true);
      });
      
      await act(async () => {
        await result.current.setSoundEnabled(false);
      });
      
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@mahjong-epic-settings',
        JSON.stringify({ soundEnabled: false })
      );
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      mockAsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <SettingsProvider>{children}</SettingsProvider>
      );
      
      const { result } = renderHook(() => useSettings(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.settings.soundEnabled).toBe(true);
      });
      
      // Should not throw - should handle gracefully
      await act(async () => {
        await result.current.setSoundEnabled(false);
      });
      
      expect(result.current.settings.soundEnabled).toBe(false);
    });
  });

  describe('useSettings hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        renderHook(() => useSettings());
      }).toThrow('useSettings must be used within a SettingsProvider');
      
      consoleSpy.mockRestore();
    });
  });
});