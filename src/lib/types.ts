export type UserRole = "admin" | "user";
export type UserStatus = "Active" | "Inactive";
export type SubscriptionTier = "Basic" | "Standard" | "Premium";
export type Language = "en" | "fr" | "es" | "zh" | "ja";
export type Theme = "Dark" | "Light";

export interface PaginatedResponse<T> {
  status?: number;
  message?: string;
  data: T[];
  current_page?: number;
  per_page?: number;
  total_pages?: number;
  total_count?: number;
  next_page?: number | null;
  prev_page?: number | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  subscription: SubscriptionTier;
  appwrite_user_id: string;
  preferences: {
    theme: Theme;
    language: Language;
  };
  project?: {
    name: string;
    package_name: string;
    android: boolean;
    apple: boolean;
    user_id: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  package_name: string;
  android: boolean;
  apple: boolean;
  appwrite_project_id: string;
  user_id: number;
  appwrite_user_id: string;
  user_name?: string;
  user_email?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  appwrite_user_id: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardData {
  total_accounts: number;
  active_users: number;
  inactive_users: number;
  basic_users: number;
  standard_users: number;
  premium_users: number;
  live_projects: number;
}
