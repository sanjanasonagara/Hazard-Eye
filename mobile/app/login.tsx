import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../src/services/api';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/auth/login', {
                email: email.includes('@') ? email : `${email}@hazardeye.com`,
                password: password
            });

            if (response.data && response.data.token) {
                const { token, user } = response.data;
                
                // Save session
                await SecureStore.setItemAsync('token', token);
                await SecureStore.setItemAsync('user', user.firstName + ' ' + user.lastName);
                await SecureStore.setItemAsync('userRole', user.role.toLowerCase());

                // Navigate based on role
                if (user.role.toLowerCase() === 'admin' || user.role.toLowerCase() === 'supervisor') {
                    router.replace('/(supervisor)/');
                } else {
                    router.replace('/(tabs)/');
                }
            } else {
                Alert.alert("Error", "Invalid login response from server");
            }

        } catch (e: any) {
            console.error('Login failed:', e);
            const msg = e.response?.data?.message || "Login failed. Please check your credentials and network.";
            Alert.alert("Error", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Top Section */}
            <View style={styles.topSection}>
                <View style={styles.logoCircle}>
                    <Ionicons name="shield-checkmark" size={48} color="#1E3A8A" />
                </View>
                <Text style={styles.appName}>Hazard-Eye</Text>
                <Text style={styles.tagline}>Supervisor Access Portal</Text>
            </View>

            {/* Bottom Form Section */}
            <View style={styles.bottomSection}>
                <View style={styles.formContainer}>
                    <Text style={styles.welcomeText}>Welcome Back</Text>
                    <Text style={styles.instructionText}>Enter your credentials to continue</Text>

                    <View style={styles.inputWrapper}>
                        <View style={styles.inputIconBox}>
                            <Ionicons name="person" size={20} color="#64748B" />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Email or Username"
                            placeholderTextColor="#94A3B8"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <View style={styles.inputIconBox}>
                            <Ionicons name="lock-closed" size={20} color="#64748B" />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#94A3B8"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.loginBtnText}>SIGN IN</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Ionicons name="information-circle-outline" size={16} color="#94A3B8" />
                        <Text style={styles.footerText}>Use 'admin' or 'sup' for Supervisor access</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E3A8A', // Deep Blue
    },
    topSection: {
        height: '35%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logoCircle: {
        width: 80,
        height: 80,
        backgroundColor: '#FFFFFF',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    appName: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    tagline: {
        fontSize: 14,
        color: '#BFDBFE', // Light blue
        marginTop: 4,
        fontWeight: '500',
    },
    bottomSection: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        overflow: 'hidden',
    },
    formContainer: {
        flex: 1,
        padding: 32,
        paddingTop: 48,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 8,
    },
    instructionText: {
        fontSize: 16,
        color: '#64748B',
        marginBottom: 32,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 16,
        height: 60,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        // Shadow
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    inputIconBox: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#F1F5F9',
    },
    input: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#334155',
        fontWeight: '500',
    },
    loginBtn: {
        backgroundColor: '#2563EB',
        borderRadius: 16,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    loginBtnDisabled: {
        backgroundColor: '#93C5FD',
    },
    loginBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    footer: {
        marginTop: 32,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    footerText: {
        color: '#94A3B8',
        fontSize: 13,
    },
});
