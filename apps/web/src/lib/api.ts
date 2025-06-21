import axios from 'axios';
import { toastError } from './toast';
import { router } from './router';

export const apiClient = axios.create({
    baseURL: 'http://localhost:3001',
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

let isHandlingUnauthorized = false;

export const resetUnauthorizedHandler = () => {
    isHandlingUnauthorized = false;
};

const handleUnauthorized = (error: any) => {
    if (error.response?.status === 401 || error.response?.data?.code === 'TOKEN_INVALID_OR_EXPIRED') {
        if (isHandlingUnauthorized) {
            return;
        }
        isHandlingUnauthorized = true;
        localStorage.removeItem('auth_token');
        toastError('Your session has expired. Please log in again.')
        throw router.navigate({
            to: '/',
            search: {
                redirect: location.href,
            },
        })
    }
}

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        handleUnauthorized(error)
        return Promise.reject(error);
    }
);