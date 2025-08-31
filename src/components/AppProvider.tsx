'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useMemo } from 'react';
import type { Transaction, Budget, Bill, QuickExpenseSetting } from '@/lib/data';
import { initialTransactions, initialBudgets, initialBills, initialQuickExpenses } from '@/lib/data';
import { getBudgetSuggestions } from '@/ai/flows/ai-driven-budget-suggestions';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  transactions: Transaction[];
  budgets: Budget[];
  bills: Bill[];
  quickExpenses: QuickExpenseSetting[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateBudget: (category: string, amount: number) => void;
  addBill: (bill: Omit<Bill, 'id' | 'paid'>) => void;
  setBillPaid: (id: string, paid: boolean) => void;
  getAiBudgetSuggestions: () => Promise<void>;
  isGeneratingSuggestions: boolean;
  setQuickExpenses: (expenses: QuickExpenseSetting[]) => void;
  resetData: () => void;
  resetBudgets: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [quickExpenses, setQuickExpenses] = useState<QuickExpenseSetting[]>(initialQuickExpenses);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const { toast } = useToast();

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [...prev, { ...transaction, id: crypto.randomUUID() }]);
  };

  const updateBudget = (category: string, amount: number) => {
    setBudgets(prev =>
      prev.map(b => (b.category === category ? { ...b, amount } : b))
    );
  };
  
  const addBill = (bill: Omit<Bill, 'id' | 'paid'>) => {
    setBills(prev => [...prev, { ...bill, id: crypto.randomUUID(), paid: false }]);
  };

  const setBillPaid = (id: string, paid: boolean) => {
    setBills(prev => prev.map(b => (b.id === id ? { ...b, paid } : b)));
  };

  const resetData = () => {
    setTransactions(initialTransactions);
    setBudgets(initialBudgets);
    setBills(initialBills);
    setQuickExpenses(initialQuickExpenses);
  };
  
  const resetBudgets = () => {
    setBudgets(prev => prev.map(b => ({ ...b, amount: 0 })));
    toast({
        title: "Budgets Reset",
        description: "All your budget amounts have been set to zero.",
    });
  };

  const getAiBudgetSuggestions = async () => {
    setIsGeneratingSuggestions(true);
    try {
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

      const spendingHabits = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          if (!acc[t.category]) {
            acc[t.category] = 0;
          }
          acc[t.category] += t.amount;
          return acc;
        }, {} as Record<string, number>);
        
      const totalBudget = budgets.reduce((acc, b) => acc + b.amount, 0);

      // Ensure all budget categories are present in spending habits, even if they have 0 spending
      budgets.forEach(b => {
          if (!spendingHabits[b.category]) {
              spendingHabits[b.category] = 0;
          }
      });

      const suggestions = await getBudgetSuggestions({
        income: totalIncome,
        totalBudget: totalBudget > 0 ? totalBudget : totalIncome * 0.8, // Provide a default budget if none is set
        spendingHabits,
      });

      const updatedBudgets = budgets.map(b => ({
        ...b,
        amount: suggestions[b.category] !== undefined ? suggestions[b.category] : b.amount,
      }));
      setBudgets(updatedBudgets);

      toast({
        title: "AI Budget Suggestions Applied",
        description: "Your budgets have been updated with AI-powered recommendations.",
      });

    } catch (error) {
      console.error("Failed to get AI budget suggestions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate AI budget suggestions. Please try again later.",
      });
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };


  const contextValue = useMemo(() => ({
    transactions,
    budgets,
    bills,
    quickExpenses,
    addTransaction,
    updateBudget,
    addBill,
    setBillPaid,
    getAiBudgetSuggestions,
    isGeneratingSuggestions,
    setQuickExpenses,
    resetData,
    resetBudgets,
  }), [transactions, budgets, bills, quickExpenses, isGeneratingSuggestions]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}
