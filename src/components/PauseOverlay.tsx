// Pause Overlay Modal Component
import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { DIMENSIONS } from '../constants/dimensions';

interface PauseOverlayProps {
  visible: boolean;
  onResume: () => void;
  onQuit: () => void;
}

function PauseOverlayComponent({ visible, onResume, onQuit }: PauseOverlayProps) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <Text style={styles.title}>PAUSA</Text>
        
        <View style={styles.buttons}>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={onResume}
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.button, styles.buttonSecondary, pressed && styles.buttonPressed]}
            onPress={onQuit}
          >
            <Text style={styles.buttonTextSecondary}>Salir</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: COLORS.background,
    borderRadius: DIMENSIONS.cardRadius,
    padding: 32,
    alignItems: 'center',
    gap: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  buttons: {
    gap: 16,
    width: '100%',
  },
  button: {
    height: DIMENSIONS.buttonHeight,
    minWidth: 200,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  buttonTextSecondary: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export const PauseOverlay = memo(PauseOverlayComponent);