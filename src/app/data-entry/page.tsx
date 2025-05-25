
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { addTransaction } from '@/services/blockchain'; // This service calls /api/transactions
import { detectManipulationAttempts } from '@/ai/flows/threat-detection';
import { PlusCircle, Upload, Loader2, FileCheck2, Activity } from 'lucide-react';

// Define all possible transaction/event types for the form
const ALL_EVENT_TYPES = [
  'revenue', 'expense', 'system_update', 'data_access', 'config_change', 
  'user_auth', 'api_call', 'security_event', 'audit_log', 'nft_mint', 
  'token_transfer', 'contract_deploy', 'oracle_update'
] as const;

// Updated Zod schema for the form, matching the backend
const eventSchema = z.object({
  type: z.enum(ALL_EVENT_TYPES, { required_error: "Event type is required." }),
  amount: z.coerce.number().positive({ message: "Amount, if provided, must be a positive number." }).optional(),
  currency: z.string().min(2, { message: "Currency, if provided, must be 2-10 characters."}).max(10).optional(),
  description: z.string().min(1, { message: "Description is required."}).max(500),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format." }),
  category: z.string().min(1, {message: "Category is required."}),
  tags: z.string().optional().describe("Comma-separated tags for easier filtering and organization."),
  
  network: z.string().optional(),
  userAddress: z.string().optional(),
  contractAddress: z.string().optional(),
  referenceId: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function DataEntryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isFileProcessing, setIsFileProcessing] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      type: 'revenue', // Default to one of the types
      // amount: 0, // Make amount undefined by default as it's optional
      currency: 'USD', // Default currency if amount is provided
      description: '',
      date: new Date().toISOString().split('T')[0], // Today's date
      category: '',
      tags: '',
      network: '',
      userAddress: '',
      contractAddress: '',
      referenceId: '',
    },
  });

  const onSubmit: SubmitHandler<EventFormValues> = async (data) => {
    setIsSubmitting(true);
    
    // Filter out empty optional fields before sending to backend
    const payload: Partial<EventFormValues> = { ...data };
    for (const key in payload) {
      if (payload[key as keyof EventFormValues] === '' || payload[key as keyof EventFormValues] === undefined) {
        delete payload[key as keyof EventFormValues];
      }
    }
    if (payload.amount === 0 && !Object.prototype.hasOwnProperty.call(data, 'amount')) { // If amount was not touched and is 0, treat as not provided.
        delete payload.amount;
    }


    try {
      // AI Threat Detection (remains flexible due to `any` input for transactionData)
      const threatResult = await detectManipulationAttempts({ transactionData: payload });
      if (threatResult.threatDetected) {
        toast({
          variant: "destructive",
          title: "Potential Threat Detected!",
          description: `AI analysis flagged this event: ${threatResult.threatDetails?.type || 'Unknown threat'}. Please review carefully. Submission proceeded with warning.`,
        });
      }

      // Service call (addTransaction internally calls /api/transactions)
      const loggedEvent = await addTransaction(payload); // `addTransaction` service expects `any`
      toast({
        title: "Event Logged Successfully",
        description: (
          <div>
            <p>The event was successfully added to the immutable log.</p>
            <p className="text-xs mt-1">Log ID: {loggedEvent.id}</p> {/* Assuming `id` is returned */}
          </div>
        ),
      });

      console.log("Submitted Event Data:", payload);
      console.log("API Response:", loggedEvent);
      form.reset(); 
      setUploadedFile(null);

    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: error.message || "Could not process the event. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setIsFileProcessing(true);
      setTimeout(() => {
        setIsFileProcessing(false);
        toast({
          title: "File Processed (Simulated)",
          description: `${file.name} ready. Automated data extraction is a future enhancement. Please fill details manually.`,
        });
      }, 2000);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Activity className="h-7 w-7 text-primary" /> {/* Changed Icon */}
            Log New Event / Transaction
          </CardTitle>
          <CardDescription>
            Manually log various system events, financial transactions, or blockchain interactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 border rounded-md bg-muted/20">
            <h3 className="text-lg font-medium mb-2">Automated Entry (Beta)</h3>
            <Button variant="outline" className="w-full mb-2" onClick={() => document.getElementById('fileUploadInput')?.click()} disabled={isFileProcessing}>
              {isFileProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              {isFileProcessing ? 'Processing File...' : (uploadedFile ? `Change File: ${uploadedFile.name}` : 'Upload Event File (CSV, JSON)')}
            </Button>
            <input type="file" id="fileUploadInput" accept=".csv,.json,.xlsx" className="hidden" onChange={handleFileUpload} />
            {uploadedFile && !isFileProcessing && (
                <div className="text-sm text-green-600 flex items-center gap-2">
                    <FileCheck2 className="h-4 w-4" /> 
                    <span>{uploadedFile.name} is ready. (Manual details still required)</span>
                </div>
            )}
            <p className="text-xs text-muted-foreground mt-2 text-center">Automated data extraction is under development.</p>
          </div>

          <div className="relative my-6">
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
                    <FormLabel>Event Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {ALL_EVENT_TYPES.map(type => (
                          <SelectItem key={type} value={type} className="capitalize">
                            {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </SelectItem>
                        ))}
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
                      <FormLabel>Amount (Optional)</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" placeholder="e.g., 100.00 or 0.5" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} />
                      </FormControl>
                      <FormDescription>Only for financial events. Must be positive.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency (Optional)</FormLabel>
                       <FormControl>
                        <Input placeholder="e.g., USD, ETH, FISK" {...field} />
                      </FormControl>
                       <FormDescription>E.g., USD, EUR, ETH, BTC, FISK.</FormDescription>
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
                      <Input placeholder="e.g., Software Sales, System Maintenance, NFT Mint" {...field} />
                    </FormControl>
                    <FormDescription>A general category for this event.</FormDescription>
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
                      <Textarea placeholder="Detailed description of the event (max 500 characters)" {...field} />
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
              
              <FormField
                control={form.control}
                name="network"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Network (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Ethereum, Polygon, zkSync" {...field} />
                    </FormControl>
                    <FormDescription>Relevant blockchain network, if applicable.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Address (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 0x123..." {...field} />
                    </FormControl>
                     <FormDescription>User's blockchain address, if applicable.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contractAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Address (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 0xabc..." {...field} />
                    </FormControl>
                     <FormDescription>Smart contract address, if applicable.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referenceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference ID (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Transaction Hash, NFT ID, Batch ID" {...field} />
                    </FormControl>
                    <FormDescription>Any relevant ID for cross-referencing.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., phase-15, security-audit, user-onboarding" {...field} />
                    </FormControl>
                    <FormDescription>
                      Comma-separated tags for easier filtering and organization.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting || isFileProcessing}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting Event...</> : "Log Event"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

