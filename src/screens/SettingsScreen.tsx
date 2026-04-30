// Settings Screen - Sound toggle
import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { DIMENSIONS } from '../constants/dimensions';
import { useSettings } from '../contexts/SettingsContext';

export default function SettingsScreen() {
  const { settings, setSoundEnabled } = useSettings();

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Música</Text>
            <Text style={styles.description}>Reproducir música de fondo</Text>
          </View>
          <Switch
            value={settings.soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: COLORS.textLight, true: COLORS.primaryLight }}
            thumbColor={settings.soundEnabled ? COLORS.primary : COLORS.background}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>Mahjong Epic v1.0.0</Text>
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
  section: {
    gap: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: DIMENSIONS.touchTargetMin,
    backgroundColor: COLORS.backgroundSecondary,
    padding: DIMENSIONS.cardPadding,
    borderRadius: DIMENSIONS.buttonRadius,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  version: {
    fontSize: 12,
    color: COLORS.textLight,
  },
});