import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Crypto from 'expo-crypto';

export default function LoginScreen() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [pin, setPin] = useState('');
    const [registering, setRegistering] = useState(false);

    useEffect(() => {
        checkLogin();
    }, []);

    const checkLogin = async () => {
        const token = await SecureStore.getItemAsync('device_token');
        if (token) {
            router.replace('/(tabs)/');
        }
    };

    const handleLogin = async () => {
        // Mock Authentication
        if (username.length > 0 && pin.length === 4) {
            if (registering) {
                // Simulate Device Registration
                const deviceId = Crypto.randomUUID();
                const fakeToken = `token_${deviceId}`;
                await SecureStore.setItemAsync('device_token', fakeToken);
                await SecureStore.setItemAsync('user_pin', pin);
                Alert.alert("Registration Successful", "Device registered safely.");
                router.replace('/(tabs)/');
            } else {
                // Simulate Login
                // In real app, verify PIN against stored hash or online auth
                const storedPin = await SecureStore.getItemAsync('user_pin');
                if (storedPin && storedPin !== pin) {
                    Alert.alert("Error", "Invalid PIN");
                    return;
                }
                router.replace('/(tabs)/');
            }
        } else {
            Alert.alert("Error", "Enter valid credentials");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>Hazard-Eye</Text>
                <Text style={styles.subtitle}>{registering ? 'Device Registration' : 'Worker Login'}</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Username / ID"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="4-Digit PIN"
                    value={pin}
                    onChangeText={setPin}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>{registering ? 'Register & Login' : 'Login'}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setRegistering(!registering)}>
                    <Text style={styles.link}>
                        {registering ? 'Already registered? Login' : 'New Device? Register'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2D3748',
        justifyContent: 'center',
        padding: 20,
    },
    form: {
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 16,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#E53E3E',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 18,
        color: '#718096',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        backgroundColor: '#EDF2F7',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        width: '100%',
        backgroundColor: '#3182CE',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    link: {
        marginTop: 20,
        color: '#3182CE',
        fontWeight: '600',
    }
});
