import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_LOCAL_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {

        if (response.data && response.data.data !== undefined) {
            response.data = response.data.data;
        }
        return response;
    },
    (error) => {
        const status = error.response ? error.response.status : null;
        if (status === 401) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export default api;
