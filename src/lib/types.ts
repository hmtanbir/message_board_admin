export type UserRole = 'Admin' | 'Editor' | 'Viewer' | 'Developer' | 'Auditor' | 'Manager';

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