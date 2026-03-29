import { User } from './types';

export const MOCK_USERS: User[] = [
  {
    id: '69c8c4c987ac7740eae7',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    jobTitle: 'Senior Software Engineer',
    department: 'Engineering',
    roles: ['User'],
    subscription: 'Premium',
    permissions: ['read:users', 'write:code', 'deploy:prod'],
    status: 'Active',
    createdAt: '2023-10-01',
    preferences: { darkTheme: false },
    project: { name: 'Lumina Edge' },
    platform: {
      name: 'Lumina Mobile',
      package_name: 'com.lumina.edge',
      platform_type: ['android', 'apple']
    }
  },
  {
    id: 'a1b2c3d4e5f6g7h8i9j0',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    jobTitle: 'Product Manager',
    department: 'Product',
    roles: ['User'],
    subscription: 'Standard',
    permissions: ['read:all', 'edit:roadmap', 'manage:billing'],
    status: 'Active',
    createdAt: '2023-11-15',
    preferences: { darkTheme: false },
    project: { name: 'Nexus Core' },
    platform: {
      name: 'Nexus Dashboard',
      package_name: 'com.nexus.core',
      platform_type: ['apple']
    }
  },
  {
    id: 'f9e8d7c6b5a493827160',
    name: 'Marcus Thorne',
    email: 'm.thorne@example.com',
    jobTitle: 'Security Specialist',
    department: 'Security',
    roles: ['User'],
    subscription: 'Premium',
    permissions: ['read:logs', 'manage:iam', 'write:security-audit'],
    status: 'Active',
    createdAt: '2024-01-20',
    preferences: { darkTheme: false },
    project: { name: 'Aether Portal' },
    platform: {
      name: 'Aether Secure',
      package_name: 'com.aether.portal',
      platform_type: ['android']
    }
  },
  {
    id: 'bcdef0123456789abcde',
    name: 'Elena Gilbert',
    email: 'elena.g@example.com',
    jobTitle: 'Junior Designer',
    department: 'Design',
    roles: ['User'],
    subscription: 'Basic',
    permissions: ['read:assets', 'comment:designs'],
    status: 'Active',
    createdAt: '2024-03-05',
    preferences: { darkTheme: false },
    project: { name: 'Vantage Flow' },
    platform: {
      name: 'Vantage Preview',
      package_name: 'com.vantage.flow',
      platform_type: ['apple']
    }
  },
  {
    id: '1a2b3c4d5e6f7a8b9c0d',
    name: 'Jordan Smith',
    email: 'j.smith@example.com',
    jobTitle: 'Marketing Lead',
    department: 'Marketing',
    roles: ['User'],
    subscription: 'Basic',
    permissions: ['read:campaigns', 'write:copy'],
    status: 'Inactive',
    createdAt: '2023-08-12',
    preferences: { darkTheme: false },
    project: { name: 'Horizon Sync' },
    platform: {
      name: 'Horizon Connect',
      package_name: 'com.horizon.sync',
      platform_type: ['android', 'apple']
    }
  },
];
