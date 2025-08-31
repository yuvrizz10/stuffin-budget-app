'use client';

import { useMemo } from 'react';
import { useAppData } from '@/hooks/use-app-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';
import { Bot, Loader2 } from 'lucide-react';

export default function BudgetsPage() {
  const { budgets, transactions, updateBudget, getAiBudgetSuggestions, isGeneratingSuggestions } = useAppData();

  const budgetWithSpending = useMemo(() => {
    return budgets.map((budget) => {
      const spent = transactions
        .filter((t) => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      return {
        ...budget,
        spent,
        progress: Math.min(100, progress),
      };
    }).sort((a,b) => b.spent - a.spent);
  }, [budgets, transactions]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Monthly Budgets</h1>
          <p className="text-muted-foreground">Set and track your spending limits for each category.</p>
        </div>
        <Button onClick={getAiBudgetSuggestions} disabled={isGeneratingSuggestions}>
          {isGeneratingSuggestions ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Bot className="mr-2 h-4 w-4" />
          )}
          Get AI Suggestions
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgetWithSpending.map((budget) => (
          <Card key={budget.category}>
            <CardHeader>
              <CardTitle>{budget.category}</CardTitle>
              <CardDescription>
                {formatCurrency(budget.spent)} spent of {formatCurrency(budget.amount)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={budget.progress} className={budget.progress > 90 ? '[&>div]:bg-destructive' : ''} />
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">$</span>
                <Input
                  type="number"
                  defaultValue={budget.amount}
                  onBlur={(e) => updateBudget(budget.category, Number(e.target.value))}
                  className="h-8"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
