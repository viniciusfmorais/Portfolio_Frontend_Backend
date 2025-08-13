export type UserStatus = 'active' | 'invited' | 'suspended';
export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string; // ISO
  avatarUrl?: string | null;
}
