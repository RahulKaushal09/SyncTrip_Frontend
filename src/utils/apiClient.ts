import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { StorageUtils } from './storage.utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL+"/api" || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: Add interceptors for auth or error handling
apiClient.interceptors.request.use(
    (config) => {
        // Example: Add token if available
        const token = StorageUtils.getToken();
        if (token) {
            if (config.headers) {
                (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
// allow 409 status codes as valid responses

    (response: AxiosResponse) => response,
    (error) => {
        if (error.response && error.response.status === 409) {
            return Promise.resolve(error.response);
        }
        // Handle errors globally
        return Promise.reject(error);
    }
);

export default apiClient;