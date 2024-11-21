import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';

interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    user: any;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading,] = useState(true);
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
            const response = await axios.get('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUser(response.data);
        } catch (error) {
            console.error('获取用户信息失败:', error);
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    // 修改 AuthContext 中的处理逻辑
    const refreshToken = async () => {
        try {
            const oldToken = localStorage.getItem('token');
            if (!oldToken) return;

            const response = await axios.post('/api/auth/refresh-token', {}, {
                headers: {Authorization: `Bearer ${oldToken}`}
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                return true;
            }
        } catch (error) {
            console.error('刷新token失败:', error);
            logout();
            return false;
        }
    };

// 添加 axios 响应拦截器
    axios.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config;

            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                const refreshed = await refreshToken();
                if (refreshed) {
                    return axios(originalRequest);
                }
            }

            return Promise.reject(error);
        }
    );

    return (
        <AuthContext.Provider value={{isAuthenticated, loading, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);