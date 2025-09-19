export interface User {
    id: string;
    username: string;
    email: string;
    is_admin: boolean;
    created_at: string;
    updated_at?: string;
  }
  
  export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'done';
    total_minutes: number;
    user_id: string;
    created_at: string;
    updated_at?: string;
  }
  
  export interface AuthResponse {
    access_token: string;
    token_type: string;
  }