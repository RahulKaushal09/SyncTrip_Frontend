import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { StorageUtils } from './storage.utils';
import toast from 'react-hot-toast';
import { AuthServices } from './auth.utils';
import { STORAGE_KEYS } from '@/constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:5000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    withCredentials: true,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = StorageUtils.getToken();
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
            config.withCredentials = true;
        }

        if (refreshToken) {
            config.headers = config.headers || {};
            config.headers['x-refresh-token'] = refreshToken;
        }
        // if (token) {
        //     config.headers = config.headers || {};
        //     config.headers['Authorization'] = `Bearer ${token}`;
        //     config.withCredentials = true;
        // }

        // 🔥 KEY FIX
        if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
            delete config.headers?.['Content-Type'];
        } else {
            config.headers = config.headers || {};
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    (error) => Promise.reject(error)
);
// // Optional: Add interceptors for auth or error handling
// apiClient.interceptors.request.use(
//     (config) => {
//         // Example: Add token if available
//         const token = StorageUtils.getToken();
//         if (token) {
//             if (config.headers) {
//                 (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
//             }
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

let isLoggingOut = false;

apiClient.interceptors.response.use(
    // allow 409 status codes as valid responses

    (response: AxiosResponse) => {
        // console.log('Response Interceptor: Received response...', response.headers);
        // const newToken = response.headers['x-new-access-token'];
        const newAccessToken =
            response.headers['x-new-access-token'] ||
            response.headers['X-New-Access-Token'];

        const newRefreshToken =
            response.headers['x-refresh-token'] ||
            response.headers['X-Refresh-Token'];

        if (newAccessToken) {
            localStorage.setItem(STORAGE_KEYS.TOKEN, newAccessToken);
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        }

        if (newRefreshToken) {
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
        }
        // console.log('Response Interceptor: Checking for new token in headers...', { newToken });
        // if (newToken) {
        //     localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newToken);
        //     apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        // }
        return response;
    },
    async (error) => {
        const status = error.response?.status;
        const code = error.response?.data?.code;

        if (status === 409) return Promise.resolve(error.response);
        if (status === 422) return Promise.resolve(error.response);
        if (status === 501) toast.error(error.response?.data?.message || 'An error occurred');

        // ── Banned or force logged out ──
        const case1 = status === 403 && code === 'ACCOUNT_BANNED';
        const case2 = status === 401 && code === 'SESSION_NOT_FOUND';
        const case3 = status === 401 && code === 'INVALID_TOKEN';

        if ((case1 || case2 || case3) && !isLoggingOut) {
            isLoggingOut = true;
            toast.error('Your account has been logged out.');
            StorageUtils.clearUserData();
            await AuthServices.forceLogoutUser();
            window.location.href = '/';
        }

        // Handle errors globally
        return Promise.reject(error);
    }
);

export default apiClient;