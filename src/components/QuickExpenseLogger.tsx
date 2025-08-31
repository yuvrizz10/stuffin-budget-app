'use client';

import { Coffee, Utensils, Bus } from 'lucide-react';
import { useAppData } from '@/hooks/use-app-data';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import type { QuickExpenseSetting } from '@/lib/data';

const iconMap = {
  Coffee: <Coffee className="mr-2 h-4 w-4" />,
  Utensils: <Utensils className="mr-2 h-4 w-4" />,
  Bus: <Bus className="mr-2 h-4 w-4" />,
};

export function QuickExpenseLogger() {
  const { quickExpenses, addTransaction } = useAppData();
  const { toast } = useToast();

  const handleQuickExpense = (expense: QuickExpenseSetting) => {
    addTransaction({
      amount: expense.amount,
      category: expense.category,
      description: expense.name,
      type: 'expense',
      date: new Date().toISOString(),
    });
    toast({
      title: 'Quick Expense Added',
      description: `${expense.name} for ${formatCurrency(expense.amount)} has been recorded.`,
    });
  };

  return (
    <div className="space-y-2">
      {quickExpenses.map((expense) => (
        <Button
          key={expense.id}
          variant="outline"
          className="w-full justify-start"
          onClick={() => handleQuickExpense(expense)}
        >
          {iconMap[expense.icon]}
          <span>{expense.name}</span>
          <span className="ml-auto">{formatCurrency(expense.amount)}</span>
        </Button>
      ))}
    </div>
  );
}
