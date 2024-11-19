import axios from 'axios';

export const login = async (username: string, password: string) => {
    const response = await axios.post(`/api/login`, {
        username,
        password
    });
    return response.data;
};

export const register = async (username: string, email: string, password: string) => {
    const response = await axios.post(`/api/register`, {
        username,
        email,
        password
    });
    return response.data;
};