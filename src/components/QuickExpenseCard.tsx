'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppData } from '@/hooks/use-app-data';
import { spendingCategories } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';

const quickExpenseSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
});

type QuickExpenseFormValues = z.infer<typeof quickExpenseSchema>;

export function QuickExpenseCard() {
  const { addTransaction } = useAppData();
  const { toast } = useToast();

  const form = useForm<QuickExpenseFormValues>({
    resolver: zodResolver(quickExpenseSchema),
    defaultValues: {
      amount: undefined,
      category: '',
      description: '',
    },
  });

  const onSubmit = (data: QuickExpenseFormValues) => {
    addTransaction({
      ...data,
      type: 'expense',
      date: new Date().toISOString(),
    });
    toast({
      title: 'Expense Added',
      description: `Your expense of ${data.amount} has been recorded.`,
    });
    form.reset();
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">Quick Expense</CardTitle>
        <CardDescription className="text-xs">Quickly add a new expense.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Amount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {spendingCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
