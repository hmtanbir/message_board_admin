export type UserRole = 'Admin' | 'User';

export interface User {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  department: string;
  roles: UserRole[];
  permissions: string[];
  status: 'Active' | 'Inactive' | 'Pending';
  createdAt: string;
}
