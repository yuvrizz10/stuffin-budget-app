'use client';

import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAppData } from '@/hooks/use-app-data';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Bot } from 'lucide-react';
import { visualizeSpendingAnalysis } from '@/ai/flows/spending-analysis-visualization';
import { Skeleton } from '@/components/ui/skeleton';
import { QuickExpenseCard } from '@/components/QuickExpenseCard';

export default function DashboardPage() {
  const { transactions, budgets } = useAppData();
  const [aiSummary, setAiSummary] = useState('');
  const [isAiSummaryLoading, setIsAiSummaryLoading] = useState(true);

  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      income,
      expenses,
      balance: income - expenses,
    };
  }, [transactions]);

  const chartData = useMemo(() => {
    return budgets.map((budget) => {
      const spent = transactions
        .filter((t) => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        name: budget.category,
        budget: budget.amount,
        spent: spent,
      };
    });
  }, [transactions, budgets]);

  const recentTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, [transactions]);
  
  useEffect(() => {
    const fetchAiSummary = async () => {
        setIsAiSummaryLoading(true);
        try {
            const income = stats.income;
            const expenses = transactions.filter(t => t.type === 'expense').map(({ category, amount, date}) => ({category, amount, date}));
            const result = await visualizeSpendingAnalysis({ income, expenses, budgets });
            setAiSummary(result.summary);
        } catch (e) {
            console.error(e);
            setAiSummary("Could not load AI-powered summary.");
        } finally {
            setIsAiSummaryLoading(false);
        }
    }
    fetchAiSummary();
  }, [transactions, budgets, stats.income]);


  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <div className="grid gap-4 md:grid-cols-2 xl:col-span-3 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.income)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.expenses)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.balance)}</div>
          </CardContent>
        </Card>
        <QuickExpenseCard />
      </div>
      
      <div className="grid gap-4 xl:col-span-3 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Spending vs. Budget</CardTitle>
            <CardDescription>A look at your spending compared to your set budgets for this month.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                    cursor={{fill: 'hsl(var(--muted))'}}
                    formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Bar dataKey="spent" fill="hsl(var(--primary))" name="Spent" radius={[4, 4, 0, 0]} />
                <Bar dataKey="budget" fill="hsl(var(--accent))" name="Budget" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5"/>
              AI-Powered Spending Analysis
            </CardTitle>
            <CardDescription>GenAI insights into your spending habits.</CardDescription>
          </CardHeader>
          <CardContent>
             {isAiSummaryLoading ? (
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                 </div>
             ) : (
                <p className="text-sm text-muted-foreground">{aiSummary}</p>
             )}
          </CardContent>
        </Card>
      </div>

      <Card className="xl:col-span-3">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{transaction.category}</Badge>
                  </TableCell>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell className={`text-right ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
