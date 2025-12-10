import { Tabs } from 'expo-router';
import { Home, FileText, ClipboardCheck, User } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#1E3A8A',
            borderTopWidth: 0,
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: '#F59E0B',
          tabBarInactiveTintColor: '#93C5FD',
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Home size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            title: 'Reports',
            tabBarIcon: ({ color, size }) => (
              <FileText size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: 'Tasks',
            tabBarIcon: ({ color, size }) => (
              <ClipboardCheck size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <User size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}