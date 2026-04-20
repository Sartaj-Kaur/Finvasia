import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Dynamically resolves the backend host from the Expo dev server.
 * This means the app will always connect to your machine regardless
 * of which WiFi network you switch to — no .env updates needed.
 * 
 * Priority order:
 * 1. Expo dev server host (auto-detected, works on any WiFi)
 * 2. EXPO_PUBLIC_API_URL env var (manual override)
 * 3. Android emulator fallback (10.0.2.2)
 * 4. iOS simulator fallback (localhost)
 */
const getBaseUrl = () => {
    // 1. Manual override from .env (High Priority if it's an external tunnel)
    const envUrl = process.env.EXPO_PUBLIC_API_URL || '';
    if (envUrl && (envUrl.includes('https') || envUrl.includes('loca.lt'))) {
        return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
    }

    // 2. Try to grab the Expo dev-server host (works in Expo Go + dev builds)
    const expoHost =
        Constants.expoConfig?.hostUri ||
        Constants.manifest?.debuggerHost ||
        Constants.manifest2?.extra?.expoGo?.debuggerHost;

    if (expoHost) {
        const host = expoHost.split(':')[0];
        return `http://${host}:8000/api`;
    }

    if (envUrl) {
        return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
    }

    return Platform.OS === 'android'
        ? 'http://10.0.2.2:8000/api'
        : 'http://localhost:8000/api';
};

export const API_BASE = getBaseUrl();
console.log('[API] Base URL resolved to:', API_BASE);

export const fetchApi = async (endpoint, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'Bypass-Tunnel-Reminder': 'true',
                'ngrok-skip-browser-warning': 'true',
                ...(options.headers || {})
            },
            ...options,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        const contentType = res.headers.get('content-type');
        let data;
        if (contentType && contentType.indexOf('application/json') !== -1) {
            data = await res.json();
        } else {
            data = await res.text();
            // Try to see if it's actually JSON but missing header
            try { data = JSON.parse(data); } catch { }
        }

        if (!res.ok) {
            throw new Error(data.detail || data.message || `API error: ${res.status}`);
        }
        return data;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            console.error(`[API] Timeout on ${endpoint} after 10s`);
            throw new Error('Network Timeout: The server is taking too long to respond. Check if your tunnel is active.');
        }
        console.error(`[API] Error on ${endpoint}:`, error);
        throw error;
    }
};

export const uploadReceipt = async (userId, imageUri) => {
    const formData = new FormData();
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image/jpeg`;
    if (type === 'image/jpg') type = 'image/jpeg';

    formData.append('file', {
        uri: imageUri,
        name: filename,
        type: type,
    });

    try {
        const res = await fetch(`${API_BASE}/transactions/scan-receipt/${userId}`, {
            method: 'POST',
            body: formData,
            headers: {
                'Bypass-Tunnel-Reminder': 'true',
                'ngrok-skip-browser-warning': 'true',
            },
        });
        
        const textResponse = await res.text();
        console.log(`[UploadReceipt Raw Response]:`, textResponse);

        let data;
        try {
            data = JSON.parse(textResponse);
        } catch (e) {
            throw new Error(`Non-JSON response from server: ${textResponse.substring(0, 50)}...`);
        }

        if (!res.ok) {
            throw new Error(data.detail || data.message || `API error: ${res.status}`);
        }
        return data;
    } catch (error) {
        console.error('Upload Error:', error);
        throw error;
    }
};
