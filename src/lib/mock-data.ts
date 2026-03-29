import { User } from './types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    jobTitle: 'Senior Software Engineer',
    department: 'Engineering',
    roles: ['User'],
    subscription: 'Premium',
    permissions: ['read:users', 'write:code', 'deploy:prod'],
    status: 'Active',
    createdAt: '2023-10-01',
    preferences: { darkTheme: false }
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    jobTitle: 'Product Manager',
    department: 'Product',
    roles: ['Admin'],
    subscription: 'Standard',
    permissions: ['read:all', 'edit:roadmap', 'manage:billing'],
    status: 'Active',
    createdAt: '2023-11-15',
    preferences: { darkTheme: false }
  },
  {
    id: '3',
    name: 'Marcus Thorne',
    email: 'm.thorne@example.com',
    jobTitle: 'Security Specialist',
    department: 'Security',
    roles: ['Admin'],
    subscription: 'Premium',
    permissions: ['read:logs', 'manage:iam', 'write:security-audit'],
    status: 'Active',
    createdAt: '2024-01-20',
    preferences: { darkTheme: false }
  },
  {
    id: '4',
    name: 'Elena Gilbert',
    email: 'elena.g@example.com',
    jobTitle: 'Junior Designer',
    department: 'Design',
    roles: ['User'],
    subscription: 'Basic',
    permissions: ['read:assets', 'comment:designs'],
    status: 'Active',
    createdAt: '2024-03-05',
    preferences: { darkTheme: false }
  },
  {
    id: '5',
    name: 'Jordan Smith',
    email: 'j.smith@example.com',
    jobTitle: 'Marketing Lead',
    department: 'Marketing',
    roles: ['User'],
    subscription: 'Basic',
    permissions: ['read:campaigns', 'write:copy'],
    status: 'Inactive',
    createdAt: '2023-08-12',
    preferences: { darkTheme: false }
  },
];
