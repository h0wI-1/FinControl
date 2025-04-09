export type RequestStatus = 'pending' | 'approved' | 'rejected';
export type TransactionType = 'income' | 'expense';
export type CategoryType = 'food' | 'entertainment' | 'education' | 'clothing' | 'savings' | 'other';

export interface MoneyRequest {
  id: string;
  childId: string;
  amount: number;
  reason: string;
  category: CategoryType;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  parentNote?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  category: CategoryType;
  description: string;
  date: string;
  requestId?: string;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  createdAt: string;
  isCompleted: boolean;
}

export interface SpendingStats {
  totalSpent: number;
  totalReceived: number;
  byCategorySpending: Record<CategoryType, number>;
  savingsPercentage: number;
}