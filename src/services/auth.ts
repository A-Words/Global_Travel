import axios from 'axios';
import {config} from '../config/config';

export const login = async (username: string, password: string) => {
    const response = await axios.post(`${config.API_BASE_URL}/login`, {
        username,
        password
    });
    return response.data;
};

export const register = async (username: string, email: string, password: string) => {
    const response = await axios.post(`${config.API_BASE_URL}/register`, {
        username,
        email,
        password
    });
    return response.data;
};