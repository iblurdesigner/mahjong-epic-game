// Game Timer Component
import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { DIMENSIONS } from '../constants/dimensions';

interface TimerProps {
  elapsedSeconds: number;
  totalSeconds: number;
  isPaused: boolean;
}

function TimerComponent({ elapsedSeconds, totalSeconds, isPaused }: TimerProps) {
  const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  
  const isLowTime = remainingSeconds < 60; // Less than 1 minute

  return (
    <View style={[styles.container, isPaused && styles.paused]}>
      <Text style={[styles.time, isLowTime && styles.lowTime]}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  paused: {
    opacity: 0.7,
  },
  time: {
    fontSize: DIMENSIONS.timerFontSize,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  lowTime: {
    color: COLORS.error,
  },
});

export const Timer = memo(TimerComponent);