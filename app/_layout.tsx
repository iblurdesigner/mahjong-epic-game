// App Layout - Stack Navigator
import { Stack } from 'expo-router';
import { GameProvider } from '../src/contexts/GameContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function AppLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GameProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#fdf9f4',
            },
            headerTintColor: '#14422d',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="home"
            options={{
              title: 'Mahjong Epic',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="levels"
            options={{
              title: 'Niveles',
            }}
          />
          <Stack.Screen
            name="game"
            options={{
              title: 'Juego',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: 'Ajustes',
            }}
          />
        </Stack>
      </GameProvider>
    </GestureHandlerRootView>
  );
}