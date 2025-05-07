"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { addTransaction } from '@/services/blockchain';
import { detectManipulationAttempts } from '@/ai/flows/threat-detection';
import { PlusCircle, Upload } from 'lucide-react';

const transactionSchema = z.object({
  type: z.enum(['revenue', 'expense'], { required_error: "Transaction type is required." }),
  amount: z.coerce.number().positive({ message: "Amount must be a positive number." }),
  currency: z.string().min(3, { message: "Currency must be 3 characters."}).max(3),
  description: z.string().min(1, { message: "Description is required."}).max(200),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format." }),
  category: z.string().min(1, {message: "Category is required."}),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export default function DataEntryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'revenue',
      amount: 0,
      currency: 'USD',
      description: '',
      date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
      category: '',
    },
  });

  const onSubmit: SubmitHandler<TransactionFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      // AI Threat Detection
      const threatResult = await detectManipulationAttempts({ transactionData: data });
      if (threatResult.threatDetected) {
        toast({
          variant: "destructive",
          title: "Potential Threat Detected!",
          description: `AI analysis flagged this transaction: ${threatResult.threatDetails?.type || 'Unknown threat'}. Please review carefully.`,
        });
        // Optionally, prevent submission or require confirmation
        // For now, we'll proceed but with a warning
      }

      // Blockchain Integration
      const blockchainTransaction = await addTransaction(data);
      toast({
        title: "Transaction Logged",
        description: (
          <div>
            <p>Transaction successfully added to the immutable log.</p>
            <p className="text-xs mt-1">Blockchain ID: {blockchainTransaction.id}</p>
          </div>
        ),
      });

      // TODO: Actual data saving to database or state management
      console.log("Transaction Data:", data);
      console.log("Blockchain Transaction:", blockchainTransaction);
      form.reset(); // Reset form after successful submission

    } catch (error) {
      console.error("Submission error:", error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Could not process the transaction. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: Implement file parsing (e.g., CSV, QIF) and automated entry creation
      console.log("Uploaded file:", file.name);
      toast({
        title: "File Uploaded",
        description: `${file.name} is ready for processing (feature coming soon).`,
      });
    }
  };


  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <PlusCircle className="h-7 w-7 text-primary" />
            New Transaction Entry
          </CardTitle>
          <CardDescription>
            Manually add revenue or expense transactions. For automated entries, use the upload feature.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Button variant="outline" className="w-full" onClick={() => document.getElementById('fileUploadInput')?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Transaction File (CSV, QIF)
            </Button>
            <input type="file" id="fileUploadInput" accept=".csv,.qif" className="hidden" onChange={handleFileUpload} />
            <p className="text-xs text-muted-foreground mt-2 text-center">Automated processing of uploaded files is under development.</p>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or Enter Manually</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transaction type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 100.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD - United States Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                           {/* Add more currencies as needed */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sales, Marketing, Utilities" {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detailed description of the transaction" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Add Transaction"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
