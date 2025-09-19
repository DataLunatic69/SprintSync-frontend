import { apiClient } from '../client';
import { type Task, type User, type AuthResponse } from '../../types';

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface TaskCreateData {
  title: string;
  description?: string;
}

export interface TaskUpdateData {
  title: string;
  description?: string;
}

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const response = await apiClient.get<Task[]>('/tasks');
    return response.data;
  },

  async getTask(id: string): Promise<Task> {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  async createTask(data: TaskCreateData): Promise<Task> {
    const response = await apiClient.post<Task>('/tasks', data);
    return response.data;
  },

  async updateTask(id: string, data: TaskUpdateData): Promise<Task> {
    const response = await apiClient.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },

  async updateTaskStatus(id: string, status: 'todo' | 'in_progress' | 'done'): Promise<Task> {
    const response = await apiClient.patch<Task>(`/tasks/${id}/status?status=${status}`);
    return response.data;
  }
};

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