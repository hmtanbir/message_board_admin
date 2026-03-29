export type UserRole = 'Admin' | 'User';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  jobTitle: string;
  department: string;
  roles: UserRole[];
  permissions: string[];
  status: 'Active' | 'Inactive';
  preferences: {
    darkTheme: boolean;
  };
  project?: {
    name: string;
  };
  platform?: {
    name: string;
    package_name: string;
    platform_type: ('android' | 'apple')[];
  };
  createdAt: string;
}
