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
