'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useMemo } from 'react';
import type { Transaction, Budget, Bill } from '@/lib/data';
import { initialTransactions, initialBudgets, initialBills } from '@/lib/data';
import { getBudgetSuggestions } from '@/ai/flows/ai-driven-budget-suggestions';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  transactions: Transaction[];
  budgets: Budget[];
  bills: Bill[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateBudget: (category: string, amount: number) => void;
  addBill: (bill: Omit<Bill, 'id' | 'paid'>) => void;
  setBillPaid: (id: string, paid: boolean) => void;
  getAiBudgetSuggestions: () => Promise<void>;
  isGeneratingSuggestions: boolean;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [bills, setBills] = useState<Bill[]>(initialBills);
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

  const getAiBudgetSuggestions = async () => {
    setIsGeneratingSuggestions(true);
    try {
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

      const spendingHabits = budgets.reduce((acc, budget) => {
        const spent = transactions
          .filter(t => t.type === 'expense' && t.category === budget.category)
          .reduce((sum, t) => sum + t.amount, 0);
        acc[budget.category] = spent;
        return acc;
      }, {} as Record<string, number>);

      const totalBudget = budgets.reduce((acc, b) => acc + b.amount, 0);

      const suggestions = await getBudgetSuggestions({
        income: totalIncome,
        totalBudget: totalBudget,
        spendingHabits,
      });

      const updatedBudgets = budgets.map(b => ({
        ...b,
        amount: suggestions[b.category] || b.amount,
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
    addTransaction,
    updateBudget,
    addBill,
    setBillPaid,
    getAiBudgetSuggestions,
    isGeneratingSuggestions,
  }), [transactions, budgets, bills, isGeneratingSuggestions]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}
