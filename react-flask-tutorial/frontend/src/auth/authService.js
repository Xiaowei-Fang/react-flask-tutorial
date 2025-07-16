// src/auth/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000/api';

const register = (username, password) => {
    return axios.post(`${API_URL}/auth/register`, { username, password });
};

const login = async (username, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('token');
};

const getCurrentUserToken = () => {
    return localStorage.getItem('token');
};

const authService = { register, login, logout, getCurrentUserToken };
export default authService;