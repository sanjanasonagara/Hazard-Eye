import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotFoundScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ title: 'Oops!', headerShown: false }} />
            <View style={styles.content}>
                <Text style={styles.title}>This screen doesn't exist.</Text>
                <Link href="/(tabs)/" style={styles.link}>
                    <Text style={styles.linkText}>Go to home</Text>
                </Link>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2D3748',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        fontSize: 14,
        color: '#2e78b7',
    },
});
