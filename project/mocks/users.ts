import { Family, FamilyRule, User } from '@/types/user';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    familyId: 'family1',
  },
  {
    id: '2',
    name: 'Emma Johnson',
    role: 'child',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    familyId: 'family1',
  },
  {
    id: '3',
    name: 'Noah Johnson',
    role: 'child',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    familyId: 'family1',
  },
];

export const mockFamilyRules: FamilyRule[] = [
  {
    id: 'rule1',
    title: 'Save 10% of allowance',
    description: "Always set aside 10% of any money received into your savings account.",
    isActive: true,
  },
  {
    id: 'rule2',
    title: 'Weekly spending limit',
    description: "No more than $20 can be spent on entertainment per week.",
    isActive: true,
  },
  {
    id: 'rule3',
    title: 'Educational purchases',
    description: "Books and educational materials are always approved.",
    isActive: true,
  },
];

export const mockFamily: Family = {
  id: 'family1',
  name: 'Johnson Family',
  members: mockUsers,
  rules: mockFamilyRules,
};