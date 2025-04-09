import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Family, FamilyRule, User } from '@/types/user';
import { mockFamily, mockUsers } from '@/mocks/users';

interface UserState {
  currentUser: User | null;
  family: Family | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (userId: string) => void;
  logout: () => void;
  switchUser: (userId: string) => void;
  updateUser: (user: Partial<User>) => void;
  
  // Family rule actions
  addFamilyRule: (rule: Omit<FamilyRule, 'id'>) => void;
  updateFamilyRule: (ruleId: string, updates: Partial<FamilyRule>) => void;
  deleteFamilyRule: (ruleId: string) => void;
  toggleFamilyRule: (ruleId: string, isActive: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      family: null,
      isLoading: false,
      error: null,

      login: (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          const user = mockUsers.find(u => u.id === userId);
          if (!user) {
            throw new Error('User not found');
          }
          set({ 
            currentUser: user,
            family: mockFamily,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to login',
            isLoading: false 
          });
        }
      },

      logout: () => {
        set({ currentUser: null, family: null });
      },

      switchUser: (userId: string) => {
        const { family } = get();
        if (!family) return;
        
        const user = family.members.find(m => m.id === userId);
        if (user) {
          set({ currentUser: user });
        }
      },

      updateUser: (userData: Partial<User>) => {
        const { currentUser, family } = get();
        if (!currentUser || !family) return;

        const updatedUser = { ...currentUser, ...userData };
        
        // Update user in the family members array
        const updatedMembers = family.members.map(member => 
          member.id === currentUser.id ? updatedUser : member
        );
        
        set({ 
          currentUser: updatedUser,
          family: { ...family, members: updatedMembers }
        });
      },

      // Family rule actions
      addFamilyRule: (ruleData) => {
        const { family } = get();
        if (!family) return;

        const newRule: FamilyRule = {
          ...ruleData,
          id: `rule${Date.now()}`,
        };

        set({
          family: {
            ...family,
            rules: [...family.rules, newRule]
          }
        });
      },

      updateFamilyRule: (ruleId, updates) => {
        const { family } = get();
        if (!family) return;

        const updatedRules = family.rules.map(rule => 
          rule.id === ruleId ? { ...rule, ...updates } : rule
        );

        set({
          family: {
            ...family,
            rules: updatedRules
          }
        });
      },

      deleteFamilyRule: (ruleId) => {
        const { family } = get();
        if (!family) return;

        const filteredRules = family.rules.filter(rule => rule.id !== ruleId);

        set({
          family: {
            ...family,
            rules: filteredRules
          }
        });
      },

      toggleFamilyRule: (ruleId, isActive) => {
        const { family } = get();
        if (!family) return;

        const updatedRules = family.rules.map(rule => 
          rule.id === ruleId ? { ...rule, isActive } : rule
        );

        set({
          family: {
            ...family,
            rules: updatedRules
          }
        });
      }
    }),
    {
      name: 'kidcash-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);