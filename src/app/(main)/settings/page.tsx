
'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppData } from '@/hooks/use-app-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, PlusCircle, AlertTriangle, RotateCw } from 'lucide-react';
import { spendingCategories, initialQuickExpenses } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import type { QuickExpenseSetting } from '@/lib/data';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const quickExpenseSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Name is required"),
    amount: z.coerce.number().positive("Amount must be positive"),
    category: z.string().min(1, "Category is required"),
    icon: z.enum(['Coffee', 'Utensils', 'Bus']),
});

const settingsSchema = z.object({
  quickExpenses: z.array(quickExpenseSchema),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { quickExpenses, setQuickExpenses, resetData, resetBudgets } = useAppData();
  const { toast } = useToast();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      quickExpenses: quickExpenses,
    },
    values: { // Use values to ensure form re-renders when context data changes
      quickExpenses: quickExpenses,
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'quickExpenses',
  });

  const onSubmit = (data: SettingsFormValues) => {
    setQuickExpenses(data.quickExpenses);
    toast({
        title: "Settings Saved",
        description: "Your quick expense settings have been updated.",
    });
  };

  const addQuickExpenseField = () => {
    append({ id: crypto.randomUUID(), name: '', amount: 0, category: 'Groceries', icon: 'Coffee' });
  };
  
  const handleReset = () => {
    resetData();
    form.reset({ quickExpenses: initialQuickExpenses }); // Reset form state
    toast({
        title: "Application Reset",
        description: "All your data has been reset to the initial state.",
    });
  }

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your application settings.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Quick Expense Settings</CardTitle>
                <CardDescription>Customize the one-tap expenses on your dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 border rounded-lg">
                                    <FormField
                                        control={form.control}
                                        name={`quickExpenses.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl><Input placeholder="e.g., Daily Coffee" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`quickExpenses.${index}.amount`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Amount</FormLabel>
                                                <FormControl><Input type="number" placeholder="₹0" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`quickExpenses.${index}.category`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {spendingCategories.map(category => (
                                                            <SelectItem key={category} value={category}>{category}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="button" variant="destructive" onClick={() => remove(index)} className="w-full md:w-auto">
                                        <Trash2 className="mr-2 h-4 w-4" /> Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                         <div className="flex justify-between items-center">
                            <Button type="button" variant="outline" onClick={addQuickExpenseField}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Quick Expense
                            </Button>
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Reset Budgets</CardTitle>
                <CardDescription>This will set all of your budget amounts to zero, without affecting your transaction history. This is useful for starting a new month.</CardDescription>
            </CardHeader>
            <CardContent>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline">
                            <RotateCw className="mr-2 h-4 w-4" />
                            Reset All Budgets to Zero
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action will set the amount for all your budget categories to ₹0. Your transaction data will not be affected. This cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={resetBudgets}>
                                Yes, reset budgets
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
        
        <Card className="border-destructive">
            <CardHeader>
                <CardTitle>Reset Application Data</CardTitle>
                <CardDescription>This will permanently delete all your transactions, budgets, and bills, and restore the application to its initial state.</CardDescription>
            </CardHeader>
            <CardContent>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Reset Application Data
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete all your application data and restore it to the default settings.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/90">
                                Yes, reset my data
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    </div>
  );
}
