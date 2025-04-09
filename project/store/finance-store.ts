import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  MoneyRequest, 
  RequestStatus, 
  SavingsGoal, 
  Transaction,
  CategoryType
} from '@/types/finance';
import { 
  mockRequests, 
  mockSavingsGoals, 
  mockTransactions 
} from '@/mocks/finance';

interface FinanceState {
  transactions: Transaction[];
  requests: MoneyRequest[];
  savingsGoals: SavingsGoal[];
  isLoading: boolean;
  error: string | null;
  
  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  getTransactionsByUser: (userId: string) => Transaction[];
  
  // Request actions
  createRequest: (request: Omit<MoneyRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  updateRequestStatus: (requestId: string, status: RequestStatus, parentNote?: string) => void;
  getRequestsByChild: (childId: string) => MoneyRequest[];
  getPendingRequests: () => MoneyRequest[];
  
  // Savings goal actions
  createSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'isCompleted'>) => void;
  updateSavingsGoal: (goalId: string, amount: number) => void;
  completeSavingsGoal: (goalId: string) => void;
  getSavingsGoalsByUser: (userId: string) => SavingsGoal[];
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      requests: mockRequests,
      savingsGoals: mockSavingsGoals,
      isLoading: false,
      error: null,
      
      // Transaction methods
      addTransaction: (transactionData) => {
        const newTransaction: Transaction = {
          ...transactionData,
          id: `trans${Date.now()}`,
          date: new Date().toISOString(),
        };
        
        set(state => ({
          transactions: [...state.transactions, newTransaction]
        }));
      },
      
      getTransactionsByUser: (userId) => {
        const { transactions } = get();
        return transactions.filter(t => t.userId === userId);
      },
      
      // Request methods
      createRequest: (requestData) => {
        const timestamp = new Date().toISOString();
        const newRequest: MoneyRequest = {
          ...requestData,
          id: `req${Date.now()}`,
          status: 'pending',
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        
        set(state => ({
          requests: [...state.requests, newRequest]
        }));
      },
      
      updateRequestStatus: (requestId, status, parentNote) => {
        set(state => ({
          requests: state.requests.map(req => 
            req.id === requestId 
              ? { 
                  ...req, 
                  status, 
                  parentNote: parentNote || req.parentNote,
                  updatedAt: new Date().toISOString() 
                } 
              : req
          )
        }));
        
        // If approved, create a transaction
        if (status === 'approved') {
          const request = get().requests.find(r => r.id === requestId);
          if (request) {
            get().addTransaction({
              userId: request.childId,
              amount: request.amount,
              type: 'income',
              category: request.category,
              description: request.reason,
              requestId: request.id
            });
          }
        }
      },
      
      getRequestsByChild: (childId) => {
        const { requests } = get();
        return requests.filter(r => r.childId === childId);
      },
      
      getPendingRequests: () => {
        const { requests } = get();
        return requests.filter(r => r.status === 'pending');
      },
      
      // Savings goal methods
      createSavingsGoal: (goalData) => {
        const newGoal: SavingsGoal = {
          ...goalData,
          id: `goal${Date.now()}`,
          createdAt: new Date().toISOString(),
          isCompleted: false,
        };
        
        set(state => ({
          savingsGoals: [...state.savingsGoals, newGoal]
        }));
      },
      
      updateSavingsGoal: (goalId, amount) => {
        set(state => ({
          savingsGoals: state.savingsGoals.map(goal => {
            if (goal.id === goalId) {
              const newAmount = goal.currentAmount + amount;
              const isCompleted = newAmount >= goal.targetAmount;
              
              return { 
                ...goal, 
                currentAmount: newAmount,
                isCompleted
              };
            }
            return goal;
          })
        }));
      },
      
      completeSavingsGoal: (goalId) => {
        set(state => ({
          savingsGoals: state.savingsGoals.map(goal => 
            goal.id === goalId 
              ? { ...goal, isCompleted: true } 
              : goal
          )
        }));
      },
      
      getSavingsGoalsByUser: (userId) => {
        const { savingsGoals } = get();
        return savingsGoals.filter(g => g.userId === userId);
      },
    }),
    {
      name: 'kidcash-finance-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);