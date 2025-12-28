import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import Constants from 'expo-constants';

const getBaseUrl = () => {
    // If we have a hostUri (Expo Go / Development), use that IP
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
        const ip = hostUri.split(':')[0];
        // Ensure this port matches your backend server
        return `http://${ip}:5200/api`;
    }

    // Fallback for scenarios where hostUri isn't available (e.g. standalone builds vs localhost)
    return Platform.select({
        android: 'http://10.0.2.2:5200/api',
        ios: 'http://localhost:5200/api',
        default: 'http://localhost:5200/api',
    });
};

const BASE_URL = getBaseUrl();

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Add Token
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync('user_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor: Handle Errors
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            await SecureStore.deleteItemAsync('user_token');
            // You might want to trigger a navigation to login here
            // or emit an event that the app listens to
        }
        return Promise.reject(error);
    }
);

export default api;
