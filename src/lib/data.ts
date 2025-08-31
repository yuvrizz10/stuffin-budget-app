
export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string; // ISO string
  description: string;
};

export type Budget = {
  category: string;
  amount: number;
};

export type Bill = {
  id:string;
  name: string;
  amount: number;
  dueDate: string; // ISO string
  paid: boolean;
};

export type QuickExpenseSetting = {
  id: string;
  name: string;
  amount: number;
  category: string;
  icon: 'Coffee' | 'Utensils' | 'Bus';
};

export const initialTransactions: Transaction[] = [];

export const initialBudgets: Budget[] = [
  { category: 'Groceries', amount: 0 },
  { category: 'Transport', amount: 0 },
  { category: 'Entertainment', amount: 0 },
  { category: 'Utilities', amount: 0 },
  { category: 'Rent', amount: 0 },
  { category: 'Other', amount: 0 },
];

export const initialBills: Bill[] = [];

export const initialQuickExpenses: QuickExpenseSetting[] = [
  { id: 'qe1', name: 'Coffee', amount: 150, category: 'Groceries', icon: 'Coffee' },
  { id: 'qe2', name: 'Lunch', amount: 300, category: 'Groceries', icon: 'Utensils' },
  { id: 'qe3', name: 'Bus Fare', amount: 50, category: 'Transport', icon: 'Bus' },
]

export const spendingCategories = [
    'Groceries', 'Rent', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Shopping', 'Other'
];

export const incomeCategories = [
    'Salary', 'Freelance', 'Investment', 'Gift', 'Other'
];
