export type UserRole = 'User';
export type SubscriptionTier = 'Basic' | 'Standard' | 'Premium';
export type Language = 'English' | 'French' | 'Spanish' | 'Chinese' | 'Japanese';
export type Theme = 'Light' | 'Dark';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  jobTitle: string;
  department: string;
  roles: UserRole[];
  subscription: SubscriptionTier;
  permissions: string[];
  status: 'Active' | 'Inactive';
  preferences: {
    theme: Theme;
    language: Language;
  };
  project?: {
    name: string;
  };
  platform?: {
    name?: string;
    package_name: string;
    platform_type: ('android' | 'apple')[];
  };
  createdAt: string;
}

export interface Account {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  appwrite_user_id: string;
  preferences: any | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Project {
  id: number;
  name: string;
  appwrite_project_id: string;
  user_email: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  current_page?: number;
  per_page?: number;
  total_pages?: number;
  total_count?: number;
  next_page?: number;
  prev_page?: number;
}
