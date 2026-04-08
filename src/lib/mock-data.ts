import { type User } from "./types";

export const MOCK_USERS: User[] = [
  {
    id: "69c8c4c987ac7740eae7",
    appwrite_user_id: "user_69c8c4c987ac7740eae7",
    name: "Alex Rivera",
    email: "alex.rivera@example.com",
    role: "user",
    subscription: "Premium",
    status: "Active",
    created_at: "2023-10-01T10:00:00Z",
    updated_at: "2023-10-01T10:00:00Z",
    preferences: { theme: "Light", language: "en" },
    project: {
      name: "Titan Shield Pro",
      package_name: "com.titan.shield",
      android: true,
      apple: true,
      user_id: "69c8c4c987ac7740eae7"
    },
  },
  {
    id: "a1b2c3d4e5f6g7h8i9j0",
    appwrite_user_id: "user_a1b2c3d4e5f6g7h8i9j0",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: "user",
    subscription: "Standard",
    status: "Active",
    created_at: "2023-11-15T10:00:00Z",
    updated_at: "2023-11-15T10:00:00Z",
    preferences: { theme: "Light", language: "en" },
    project: {
      name: "Nova Genesis",
      package_name: "com.nova.genesis",
      android: false,
      apple: true,
      user_id: "a1b2c3d4e5f6g7h8i9j0"
    },
  },
  {
    id: "f9e8d7c6b5a493827160",
    appwrite_user_id: "user_f9e8d7c6b5a493827160",
    name: "Marcus Thorne",
    email: "m.thorne@example.com",
    role: "user",
    subscription: "Premium",
    status: "Active",
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z",
    preferences: { theme: "Light", language: "en" },
    project: {
      name: "Zenith Flow",
      package_name: "com.zenith.flow",
      android: true,
      apple: false,
      user_id: "f9e8d7c6b5a493827160"
    },
  },
  {
    id: "bcdef0123456789abcde",
    appwrite_user_id: "user_bcdef0123456789abcde",
    name: "Elena Gilbert",
    email: "elena.g@example.com",
    role: "user",
    subscription: "Basic",
    status: "Active",
    created_at: "2024-03-05T10:00:00Z",
    updated_at: "2024-03-05T10:00:00Z",
    preferences: { theme: "Light", language: "en" },
    project: {
      name: "Prism Core",
      package_name: "com.prism.core",
      android: false,
      apple: true,
      user_id: "bcdef0123456789abcde"
    },
  },
  {
    id: "1a2b3c4d5e6f7a8b9c0d",
    appwrite_user_id: "user_1a2b3c4d5e6f7a8b9c0d",
    name: "Jordan Smith",
    email: "j.smith@example.com",
    role: "user",
    subscription: "Basic",
    status: "Inactive",
    created_at: "2023-08-12T10:00:00Z",
    updated_at: "2023-08-12T10:00:00Z",
    preferences: { theme: "Light", language: "en" },
    project: {
      name: "Aether Network",
      package_name: "com.aether.network",
      android: true,
      apple: true,
      user_id: "1a2b3c4d5e6f7a8b9c0d"
    },
  },
];
