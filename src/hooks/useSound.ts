// Use Sound Hook - Audio Management
import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { useSettings } from '../contexts/SettingsContext';

/**
 * Hook to manage background music
 * Uses expo-av for audio playback
 */
export function useSound() {
  const { settings } = useSettings();
  const soundRef = useRef<Audio.Sound | null>(null);
  const isLoadedRef = useRef(false);
  
  // Load sound on mount
  useEffect(() => {
    async function loadSound() {
      try {
        // Note: In production, you'd use an actual audio file
        // require('../assets/audio/background.mp3')
        // Using a placeholder that will fail gracefully in dev
        const { sound } = await Audio.Sound.createAsync(
          { uri: '' } as any // Empty URI - will fail but won't crash
        );
        
        // Set looping after loading
        await sound.setIsLoopingAsync(true);
        
        soundRef.current = sound;
        isLoadedRef.current = true;
      } catch (error) {
        // Sound file may not exist in dev, handle gracefully
        console.warn('Could not load audio:', error);
      }
    }
    
    loadSound();
    
    return () => {
      // Cleanup on unmount
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);
  
  // Handle sound setting changes
  useEffect(() => {
    async function updateSound() {
      if (!soundRef.current || !isLoadedRef.current) return;
      
      try {
        if (settings.soundEnabled) {
          await soundRef.current.playAsync();
        } else {
          await soundRef.current.pauseAsync();
        }
      } catch (error) {
        console.warn('Failed to update sound:', error);
      }
    }
    
    updateSound();
  }, [settings.soundEnabled]);
  
  return {
    play: async () => {
      if (soundRef.current && settings.soundEnabled) {
        await soundRef.current.playAsync();
      }
    },
    pause: async () => {
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
      }
    },
    stop: async () => {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
      }
    },
  };
}