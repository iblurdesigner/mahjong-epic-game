// Game Screen - Main game board
import React, { useEffect, useCallback, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS } from '../constants/colors';
import { DIMENSIONS } from '../constants/dimensions';
import { getDifficultyForLevel, getTimeLimit } from '../constants/difficulty';
import { useGameState } from '../hooks/useGameState';
import { Board } from '../components/Board';
import { Timer } from '../components/Timer';

export default function GameScreen() {
  const { level: levelParam } = useLocalSearchParams<{ level?: string }>();
  const router = useRouter();
  
  const level = levelParam ? parseInt(levelParam, 10) : 1;
  const difficulty = getDifficultyForLevel(level);
  const timeLimit = getTimeLimit(difficulty);
  
  const {
    tiles,
    selectedTileId,
    score,
    elapsedSeconds,
    status,
    startLevel,
    selectTile,
    pause,
    resume,
    tick,
    gameOver,
    reset,
  } = useGameState();
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Start level on mount
  useEffect(() => {
    startLevel({
      level,
      difficulty,
      seed: `level-${level}-${difficulty}`,
    });
    
    return () => {
      reset();
    };
  }, [level, difficulty]);
  
  // Timer logic
  useEffect(() => {
    if (status === 'playing') {
      timerRef.current = setInterval(() => {
        tick();
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status]);
  
  // Game over check
  useEffect(() => {
    if (status === 'playing' && elapsedSeconds >= timeLimit) {
      gameOver();
    }
  }, [elapsedSeconds, timeLimit, status]);
  
  const handleTilePress = useCallback((tileId: string) => {
    if (status === 'playing') {
      selectTile(tileId);
    }
  }, [status, selectTile]);
  
  const handlePause = useCallback(() => {
    pause();
  }, [pause]);
  
  const handleResume = useCallback(() => {
    resume();
  }, [resume]);
  
  const handleBack = useCallback(() => {
    reset();
    router.back();
  }, [reset, router]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        
        <View style={styles.headerCenter}>
          <Text style={styles.levelText}>Nivel {level}</Text>
          <Timer
            elapsedSeconds={elapsedSeconds}
            totalSeconds={timeLimit}
            isPaused={status === 'paused'}
          />
        </View>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Puntos</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
      </View>

      {/* Board */}
      <View style={styles.boardContainer}>
        <Board
          tiles={tiles}
          selectedTileId={selectedTileId}
          onTilePress={handleTilePress}
        />
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {status === 'playing' ? (
          <Pressable style={styles.pauseButton} onPress={handlePause}>
            <Text style={styles.pauseText}>PAUSA</Text>
          </Pressable>
        ) : status === 'paused' ? (
          <Pressable style={styles.pauseButton} onPress={handleResume}>
            <Text style={styles.pauseText}>Continuar</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Game Over / Win overlay */}
      {status === 'gameover' && (
        <View style={styles.overlay}>
          <Text style={styles.overlayTitle}>Fin del Juego</Text>
          <Text style={styles.overlayScore}>Puntos: {score}</Text>
          <Pressable style={styles.overlayButton} onPress={handleBack}>
            <Text style={styles.overlayButtonText}>Volver</Text>
          </Pressable>
        </View>
      )}

      {status === 'won' && (
        <View style={styles.overlay}>
          <Text style={styles.overlayTitle}>¡Ganaste!</Text>
          <Text style={styles.overlayScore}>Puntos: {score}</Text>
          <Pressable style={styles.overlayButton} onPress={handleBack}>
            <Text style={styles.overlayButtonText}>Volver</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: DIMENSIONS.screenPadding,
    backgroundColor: COLORS.backgroundSecondary,
  },
  backButton: {
    width: DIMENSIONS.touchTargetMin,
    height: DIMENSIONS.touchTargetMin,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 24,
    color: COLORS.primary,
  },
  headerCenter: {
    alignItems: 'center',
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: DIMENSIONS.screenPadding,
  },
  controls: {
    padding: DIMENSIONS.screenPadding,
    alignItems: 'center',
  },
  pauseButton: {
    height: DIMENSIONS.buttonHeight,
    minWidth: 150,
    backgroundColor: COLORS.primary,
    borderRadius: DIMENSIONS.buttonRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  overlayTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  overlayScore: {
    fontSize: 24,
    color: COLORS.accent,
  },
  overlayButton: {
    height: DIMENSIONS.buttonHeight,
    minWidth: 200,
    backgroundColor: COLORS.accent,
    borderRadius: DIMENSIONS.buttonRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.background,
  },
});