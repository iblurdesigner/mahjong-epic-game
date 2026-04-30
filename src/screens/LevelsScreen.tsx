// Levels Screen - Level selector
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/colors';
import { DIMENSIONS } from '../constants/dimensions';
import { getDifficultyForLevel } from '../constants/difficulty';
import { LevelCard } from '../components/LevelCard';

const TOTAL_LEVELS = 20;

export default function LevelsScreen() {
  const router = useRouter();

  const handleLevelPress = (level: number) => {
    router.push(`/game?level=${level}`);
  };

  const levels = Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Selecciona un Nivel</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.grid}>
        {levels.map(level => (
          <LevelCard
            key={level}
            level={level}
            difficulty={getDifficultyForLevel(level)}
            isUnlocked={true}
            onPress={handleLevelPress}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: DIMENSIONS.screenPadding,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  scrollView: {
    flex: 1,
  },
  grid: {
    padding: DIMENSIONS.screenPadding,
    gap: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});