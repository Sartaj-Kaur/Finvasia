import { Platform } from 'react-native';

const getBaseUrl = () => {
    let url = process.env.EXPO_PUBLIC_API_URL || '';
    if (!url) {
        url = Platform.OS === 'android' ? 'http://10.0.2.2:8000/api' : 'http://localhost:8000/api';
    }
    // Remove trailing slash to prevent double slashes
    return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const API_BASE = getBaseUrl();

export const fetchApi = async (endpoint, options = {}) => {
    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            },
            ...options,
        });

        const contentType = res.headers.get('content-type');
        let data;
        if (contentType && contentType.indexOf('application/json') !== -1) {
            data = await res.json();
        } else {
            data = await res.text();
        }

        if (!res.ok) {
            throw new Error(data.detail || data.message || `API error: ${res.status}`);
        }
        return data;
    } catch (error) {
        console.error(`API Error on ${endpoint}:`, error);
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
                // Do not set Content-Type mapping manually, let fetch do it with boundary string
            },
        });
        
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.detail || data.message || `API error: ${res.status}`);
        }
        return data;
    } catch (error) {
        console.error('Upload Error:', error);
        throw error;
    }
};
