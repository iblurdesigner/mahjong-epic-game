// Settings Context - Sound Toggle with AsyncStorage
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings } from '../types';

const STORAGE_KEY = '@mahjong-epic-settings';

// Initial settings
export const defaultSettings: Settings = {
  soundEnabled: true,
};

// Context type
interface SettingsContextType {
  settings: Settings;
  setSoundEnabled: (enabled: boolean) => Promise<void>;
}

// Create context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider component
interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings({ ...defaultSettings, ...parsed });
        }
      } catch (error) {
        console.warn('Failed to load settings:', error);
      } finally {
        setIsLoaded(true);
      }
    }
    
    loadSettings();
  }, []);
  
  // Save settings when changed
  const setSoundEnabled = async (enabled: boolean) => {
    const newSettings = { ...settings, soundEnabled: enabled };
    setSettings(newSettings);
    
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.warn('Failed to save settings:', error);
    }
  };
  
  return (
    <SettingsContext.Provider value={{ settings, setSoundEnabled }}>
      {children}
    </SettingsContext.Provider>
  );
}

// Hook to use settings
export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  
  return context;
}