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

export const initialTransactions: Transaction[] = [
  { id: '1', type: 'income', category: 'Salary', amount: 4500, date: new Date(new Date().setDate(1)).toISOString(), description: 'Monthly Salary' },
  { id: '2', type: 'expense', category: 'Groceries', amount: 350, date: new Date(new Date().setDate(2)).toISOString(), description: 'Weekly grocery shopping' },
  { id: '3', type: 'expense', category: 'Rent', amount: 1500, date: new Date(new Date().setDate(5)).toISOString(), description: 'Monthly rent' },
  { id: '4', type: 'expense', category: 'Transport', amount: 80, date: new Date(new Date().setDate(5)).toISOString(), description: 'Gasoline' },
  { id: '5', type: 'expense', category: 'Entertainment', amount: 75, date: new Date(new Date().setDate(8)).toISOString(), description: 'Movie tickets' },
  { id: '6', type: 'income', category: 'Freelance', amount: 600, date: new Date(new Date().setDate(10)).toISOString(), description: 'Project X payment' },
  { id: '7', type: 'expense', category: 'Utilities', amount: 120, date: new Date(new Date().setDate(12)).toISOString(), description: 'Electricity bill' },
  { id: '8', type: 'expense', category: 'Groceries', amount: 150, date: new Date(new Date().setDate(14)).toISOString(), description: 'Mid-month groceries' },
];

export const initialBudgets: Budget[] = [
  { category: 'Groceries', amount: 600 },
  { category: 'Transport', amount: 150 },
  { category: 'Entertainment', amount: 200 },
  { category: 'Utilities', amount: 250 },
  { category: 'Rent', amount: 1500 },
  { category: 'Other', amount: 300 },
];

export const initialBills: Bill[] = [
    { id: 'b1', name: 'Netflix Subscription', amount: 15.99, dueDate: new Date(new Date().setDate(20)).toISOString(), paid: false },
    { id: 'b2', name: 'Gym Membership', amount: 40, dueDate: new Date(new Date().setDate(25)).toISOString(), paid: false },
    { id: 'b3', name: 'Internet Bill', amount: 60, dueDate: new Date(new Date().setDate(28)).toISOString(), paid: true },
];

export const initialQuickExpenses: QuickExpenseSetting[] = [
  { id: 'qe1', name: 'Coffee', amount: 4.50, category: 'Groceries', icon: 'Coffee' },
  { id: 'qe2', name: 'Lunch', amount: 12.00, category: 'Groceries', icon: 'Utensils' },
  { id: 'qe3', name: 'Bus Fare', amount: 2.75, category: 'Transport', icon: 'Bus' },
]

export const spendingCategories = [
    'Groceries', 'Rent', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Shopping', 'Other'
];

export const incomeCategories = [
    'Salary', 'Freelance', 'Investment', 'Gift', 'Other'
];
