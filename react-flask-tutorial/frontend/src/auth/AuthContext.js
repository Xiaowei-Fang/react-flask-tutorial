// src/auth/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from './authService';
import { jwtDecode } from 'jwt-decode'; // 注意导入方式

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = authService.getCurrentUserToken();
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // 检查 token 是否过期
                if (decoded.exp * 1000 > Date.now()) {
                    setUser({ token, ...decoded });
                } else {
                    authService.logout(); // token 过期，登出
                }
            } catch (error) {
                console.error("Invalid token:", error);
                authService.logout();
            }
        }
    }, []);

    const login = async (username, password) => {
        const data = await authService.login(username, password);
        const decoded = jwtDecode(data.token);
        setUser({ token: data.token, ...decoded });
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = { user, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};