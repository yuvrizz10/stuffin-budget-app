'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppData } from '@/hooks/use-app-data';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const billSchema = z.object({
  name: z.string().min(1, "Bill name is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  dueDate: z.date(),
});
type BillFormValues = z.infer<typeof billSchema>;

export default function BillsPage() {
  const { bills, addBill, setBillPaid } = useAppData();
  const { toast } = useToast();

  const form = useForm<BillFormValues>({
    resolver: zodResolver(billSchema),
    defaultValues: { name: '', amount: 0, dueDate: new Date() },
  });

  const { upcomingBills, paidBills } = useMemo(() => {
    const sortedBills = [...bills].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    return {
      upcomingBills: sortedBills.filter(b => !b.paid),
      paidBills: sortedBills.filter(b => b.paid),
    };
  }, [bills]);

  const onSubmit = (data: BillFormValues) => {
    addBill({ ...data, dueDate: data.dueDate.toISOString() });
    toast({ title: "Bill Added", description: `Reminder for ${data.name} has been set.` });
    form.reset();
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Add New Bill Reminder</CardTitle>
          <CardDescription>Set up a reminder for an upcoming bill.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bill Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Netflix" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl><Input type="number" placeholder="$0.00" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Bill
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Bill Reminders</CardTitle>
          <CardDescription>Manage your upcoming and paid bills.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Upcoming Bills</h3>
            <div className="space-y-2">
              {upcomingBills.length > 0 ? upcomingBills.map(bill => (
                <div key={bill.id} className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox id={bill.id} onCheckedChange={(checked) => setBillPaid(bill.id, !!checked)} />
                    <div>
                      <label htmlFor={bill.id} className="font-medium">{bill.name}</label>
                      <p className="text-sm text-muted-foreground">Due: {format(new Date(bill.dueDate), 'PPP')}</p>
                    </div>
                  </div>
                  <div className="font-semibold">{formatCurrency(bill.amount)}</div>
                </div>
              )) : <p className="text-sm text-muted-foreground">No upcoming bills.</p>}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Paid Bills</h3>
            <div className="space-y-2">
              {paidBills.length > 0 ? paidBills.map(bill => (
                <div key={bill.id} className="flex items-center justify-between rounded-md border p-3 bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <Checkbox id={bill.id} checked={bill.paid} onCheckedChange={(checked) => setBillPaid(bill.id, !!checked)} />
                    <div>
                      <label htmlFor={bill.id} className="font-medium text-muted-foreground line-through">{bill.name}</label>
                      <p className="text-sm text-muted-foreground">Paid on: {format(new Date(bill.dueDate), 'PPP')}</p>
                    </div>
                  </div>
                  <div className="font-semibold text-muted-foreground line-through">{formatCurrency(bill.amount)}</div>
                </div>
              )) : <p className="text-sm text-muted-foreground">No bills paid this month.</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
