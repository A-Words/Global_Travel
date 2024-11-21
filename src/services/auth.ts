import api from '../utils/axios';

export const login = async (username: string, password: string) => {
    const response = await api.post('/auth/login', {
        username,
        password
    });
    return response.data;
};

export const register = async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', {
        username,
        email,
        password
    });
    return response.data;
};

export const getUserInfo = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};