import api from './axios';
import { User } from '@/types/auth.types';

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto extends LoginDto {
    name: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export const authApi = {
    login: async (credentials: LoginDto): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>('/auth/login', credentials);
        return data;
    },

    register: async (userData: RegisterDto): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>('/auth/register', userData);
        return data;
    },

    getMe: async (): Promise<User> => {
        const { data } = await api.get<User>('/users/me');
        return data;
    },

    logout: async (): Promise<{ message: string; success: boolean }> => {
        const { data } = await api.post('/auth/logout');
        return data;
    },

    updateProfile: async (data: Partial<User>): Promise<User> => {
        const response = await api.patch<User>('/users/me', data);
        return response.data;
    },
};
