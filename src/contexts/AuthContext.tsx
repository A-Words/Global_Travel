import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            login(token);
        }
    }, []);

    const login = async (token: string) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        // 设置 axios 默认 header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        try {
            const response = await axios.get('http://localhost:3000/api/auth/me');
            setUser(response.data);
        } catch (error) {
            console.error('获取用户信息失败:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);