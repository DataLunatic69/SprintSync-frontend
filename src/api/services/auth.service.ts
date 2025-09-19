import { apiClient } from '../client';
import { type User, type AuthResponse } from '../../types';

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    formData.append('grant_type', 'password');
    
    const response = await apiClient.post<AuthResponse>('/auth/token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  async register(data: RegisterData): Promise<User> {
    const response = await apiClient.post<User>('/auth/register', data);
    return response.data;
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }
};