import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';
import { useColorScheme } from 'react-native';

import { initDatabase } from '../src/services/Database';
import { syncData } from '../src/services/SyncService';
import * as Network from 'expo-network';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: SpaceMono_400Regular,
  });

  useEffect(() => {
    initDatabase(); // Initialize DB on app start

    // Network Sync Logic
    const observer = async () => {
      const state = await Network.getNetworkStateAsync();
      if (state.isConnected && state.isInternetReachable) {
        syncData();
      }
    };
    
    // Check network every 30 seconds
    const interval = setInterval(observer, 30000);
    observer(); // Initial check

    if (loaded) {
      SplashScreen.hideAsync();
    }

    return () => clearInterval(interval);
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(supervisor)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
