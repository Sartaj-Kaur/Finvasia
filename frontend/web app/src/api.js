export const API_BASE = 'http://localhost:8000/api';

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
