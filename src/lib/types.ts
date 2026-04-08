export type UserRole = "admin" | "user";
export type UserStatus = "Active" | "Inactive";
export type SubscriptionTier = "Basic" | "Standard" | "Premium";
export type Language = "en" | "fr" | "es" | "zh" | "ja";
export type Theme = "Dark" | "Light";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  subscription: SubscriptionTier;
  status: UserStatus;
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
