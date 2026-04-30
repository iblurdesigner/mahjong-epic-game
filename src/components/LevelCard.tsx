// Level Card Component
import React, { memo } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { DIMENSIONS } from '../constants/dimensions';

interface LevelCardProps {
  level: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isUnlocked: boolean;
  onPress: (level: number) => void;
}

function LevelCardComponent({ level, difficulty, isUnlocked, onPress }: LevelCardProps) {
  const handlePress = () => {
    if (isUnlocked) {
      onPress(level);
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy':
        return COLORS.success;
      case 'medium':
        return COLORS.warning;
      case 'hard':
        return COLORS.error;
    }
  };

  return (
    <Pressable
      style={[styles.container, !isUnlocked && styles.locked]}
      onPress={handlePress}
      disabled={!isUnlocked}
      accessibilityRole="button"
      accessibilityLabel={`Level ${level}${!isUnlocked ? ' locked' : ''}`}
      accessibilityState={{ disabled: !isUnlocked }}
    >
      <Text style={[styles.levelNumber, !isUnlocked && styles.lockedText]}>
        {level}
      </Text>
      <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor() }]}>
        <Text style={styles.difficultyText}>{difficulty.toUpperCase()}</Text>
      </View>
      {!isUnlocked && (
        <View style={styles.lockOverlay}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: DIMENSIONS.buttonMinWidth,
    height: DIMENSIONS.buttonHeight,
    backgroundColor: COLORS.background,
    borderRadius: DIMENSIONS.buttonRadius,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  locked: {
    opacity: 0.5,
    borderColor: COLORS.textLight,
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  lockedText: {
    color: COLORS.textLight,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: DIMENSIONS.buttonRadius,
  },
  lockIcon: {
    fontSize: 24,
  },
});

export const LevelCard = memo(LevelCardComponent);