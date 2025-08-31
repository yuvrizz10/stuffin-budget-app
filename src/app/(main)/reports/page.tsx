'use client';

import { useAppData } from '@/hooks/use-app-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportToCsv } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function ReportsPage() {
  const { transactions, budgets } = useAppData();
  const { toast } = useToast();

  const handleDownload = () => {
    const incomeData = transactions.filter(t => t.type === 'income');
    const expenseData = transactions.filter(t => t.type === 'expense');

    const csvRows: (string | number)[][] = [];

    // Income
    csvRows.push(['Income Report']);
    csvRows.push(['Date', 'Description', 'Category', 'Amount']);
    incomeData.forEach(t => {
      csvRows.push([new Date(t.date).toLocaleDateString(), t.description, t.category, t.amount]);
    });
    csvRows.push([]); // Spacer

    // Expenses
    csvRows.push(['Expense Report']);
    csvRows.push(['Date', 'Description', 'Category', 'Amount']);
    expenseData.forEach(t => {
      csvRows.push([new Date(t.date).toLocaleDateString(), t.description, t.category, t.amount]);
    });
    csvRows.push([]); // Spacer

    // Budget Summary
    csvRows.push(['Budget Summary']);
    csvRows.push(['Category', 'Budget', 'Spent', 'Remaining']);
    budgets.forEach(b => {
      const spent = expenseData
        .filter(t => t.category === b.category)
        .reduce((sum, t) => sum + t.amount, 0);
      csvRows.push([b.category, b.amount, spent, b.amount - spent]);
    });

    exportToCsv(`budgetwise_report_${new Date().toISOString().split('T')[0]}.csv`, csvRows);

    toast({
        title: "Report Generated",
        description: "Your CSV report has started downloading."
    });
  };

  return (
    <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Generate Financial Report</CardTitle>
                <CardDescription>Download a comprehensive CSV file of your income, expenses, and budget performance for the current period.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="w-full" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV Report
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
