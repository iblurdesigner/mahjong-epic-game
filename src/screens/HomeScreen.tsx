// Home Screen - Main menu
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/colors';
import { DIMENSIONS } from '../constants/dimensions';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MAHJONG</Text>
        <Text style={styles.subtitle}>EPIC</Text>
      </View>

      <View style={styles.content}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => router.push('/levels')}
        >
          <Text style={styles.buttonText}>JUGAR</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.button, styles.buttonSecondary, pressed && styles.buttonPressed]}
          onPress={() => router.push('/settings')}
        >
          <Text style={styles.buttonTextSecondary}>AJUSTES</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: DIMENSIONS.screenPadding,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 8,
  },
  subtitle: {
    fontSize: 48,
    fontWeight: '300',
    color: COLORS.textSecondary,
    letterSpacing: 12,
    marginTop: -8,
  },
  content: {
    gap: 24,
    marginBottom: 64,
  },
  button: {
    height: DIMENSIONS.buttonHeight,
    minWidth: DIMENSIONS.buttonMinWidth,
    backgroundColor: COLORS.primary,
    borderRadius: DIMENSIONS.buttonRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: COLORS.primaryLight,
  },
  buttonSecondary: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  buttonTextSecondary: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});