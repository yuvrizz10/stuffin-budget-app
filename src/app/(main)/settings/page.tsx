
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppData } from '@/hooks/use-app-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, PlusCircle } from 'lucide-react';
import { spendingCategories } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import type { QuickExpenseSetting } from '@/lib/data';

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
  const { quickExpenses, setQuickExpenses } = useAppData();
  const { toast } = useToast();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      quickExpenses: quickExpenses,
    },
  });

  const { fields, append, remove, update } = useFieldArray({
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
    </div>
  );
}
