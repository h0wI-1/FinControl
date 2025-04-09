export type UserRole = 'parent' | 'child';

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  avatar?: string;
  familyId: string;
}

export interface Family {
  id: string;
  name: string;
  members: User[];
  rules: FamilyRule[];
}

export interface FamilyRule {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
}