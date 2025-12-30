import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';

export default function LandingScreen() {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await SecureStore.getItemAsync('token');
                const role = await SecureStore.getItemAsync('userRole');

                if (!token) {
                    router.replace('/login');
                    return;
                }

                if (role === 'admin' || role === 'supervisor') {
                    router.replace('/(supervisor)/');
                } else {
                    router.replace('/(tabs)/');
                }
            } catch (e) {
                router.replace('/login');
            }
        };

        checkAuth();
    }, []);


    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
            <ActivityIndicator size="large" color="#2563EB" />
        </SafeAreaView>
    );
}
