// src/auth/api.js
import axios from 'axios';
import authService from './authService';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000/api',
});

api.interceptors.request.use(
    (config) => {
        const token = authService.getCurrentUserToken();
        if (token) {
            config.headers['x-access-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;