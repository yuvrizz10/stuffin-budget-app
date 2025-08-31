'use client';
import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppData } from '@/hooks/use-app-data';
import { formatCurrency } from '@/lib/utils';
import { ListFilter } from 'lucide-react';

type SortConfig = {
    key: keyof import('@/lib/data').Transaction;
    direction: 'ascending' | 'descending';
} | null;

export default function TransactionsPage() {
  const { transactions } = useAppData();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'descending' });

  const filteredTransactions = useMemo(() => {
    let sortableItems = [...transactions];
    if (filter !== 'all') {
      sortableItems = sortableItems.filter((t) => t.type === filter);
    }

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'date') {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableItems;
  }, [transactions, filter, sortConfig]);

  const requestSort = (key: keyof import('@/lib/data').Transaction) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key: keyof import('@/lib/data').Transaction) => {
    if (!sortConfig || sortConfig.key !== key) {
        return null;
    }
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  }


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Transactions</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={filter === 'all'} onCheckedChange={() => setFilter('all')}>
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={filter === 'income'} onCheckedChange={() => setFilter('income')}>
                Income
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={filter === 'expense'} onCheckedChange={() => setFilter('expense')}>
                Expense
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => requestSort('description')} className="cursor-pointer">Description{getSortIndicator('description')}</TableHead>
              <TableHead onClick={() => requestSort('category')} className="cursor-pointer">Category{getSortIndicator('category')}</TableHead>
              <TableHead onClick={() => requestSort('date')} className="cursor-pointer">Date{getSortIndicator('date')}</TableHead>
              <TableHead onClick={() => requestSort('amount')} className="text-right cursor-pointer">Amount{getSortIndicator('amount')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.description}</TableCell>
                <TableCell><Badge variant="outline">{transaction.category}</Badge></TableCell>
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
  );
}
