import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import OfflineProvider from './src/contexts/OfflineProvider';
import MLStatusProvider from './src/contexts/MLStatusProvider';

export default function App() {
  return (
    <SafeAreaProvider>
      <OfflineProvider>
        <MLStatusProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <AppNavigator />
          </NavigationContainer>
        </MLStatusProvider>
      </OfflineProvider>
    </SafeAreaProvider>
  );
}