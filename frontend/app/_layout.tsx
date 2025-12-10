import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import NetInfo from '@react-native-community/netinfo';
import { View, Text } from "react-native";

export default function RootLayout() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        {!isOnline && (
          <View style={{ backgroundColor: "#fde047", paddingVertical: 8, paddingHorizontal: 16 }}>
            <Text style={{ textAlign: "center", color: "#fff", fontWeight: "bold" }}>
              📴 Offline Mode Active
            </Text>
          </View>
        )}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="capture-incident" />
          <Stack.Screen name="add-details" />
          <Stack.Screen name="incident-preview" />
          <Stack.Screen name="task-detail" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}