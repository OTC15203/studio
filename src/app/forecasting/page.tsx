"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { revenueExpenseForecasting, RevenueExpenseForecastingInput, RevenueExpenseForecastingOutput } from '@/ai/flows/revenue-expense-forecasting';
import { Brain, Zap, Lightbulb, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const forecastingSchema = z.object({
  historicalData: z.string().min(50, { message: "Please provide sufficient historical data (at least 50 characters)." }).max(5000, { message: "Historical data is too long (max 5000 characters)."}),
  marketTrends: z.string().min(20, { message: "Please describe relevant market trends (at least 20 characters)." }).max(3000, { message: "Market trends description is too long (max 3000 characters)."})
});

type ForecastingFormValues = z.infer<typeof forecastingSchema>;

export default function ForecastingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [forecastResult, setForecastResult] = useState<RevenueExpenseForecastingOutput | null>(null);

  const form = useForm<ForecastingFormValues>({
    resolver: zodResolver(forecastingSchema),
    defaultValues: {
      historicalData: "Example: \nJan 2023: Revenue $10000, Expenses $6000, Profit $4000 (Category: Software Sales)\nFeb 2023: Revenue $12000, Expenses $6500, Profit $5500 (Category: Consulting Fees)\nMar 2023: Revenue $11000, Expenses $6200, Profit $4800 (Category: Maintenance Contracts)\nQ1 Summary: Revenue $33000, Expenses $18700, Profit $14300\n\nKey Milestones:\n- Launched Product Y in Feb 2023, leading to increased software sales.\n- Seasonal dip in consulting observed in Jan, recovered in Feb.\n\nNotes: Expenses include salaries, marketing, operational costs.",
      marketTrends: "Example: \n- Overall economic growth projected at 2.5% for the next quarter.\n- Competitor X launched a new product line, potentially impacting our market share in segment Z.\n- Increased global demand for AI-driven analytics services, aligning with our new offerings.\n- Upcoming regulatory changes in data privacy might increase compliance costs.\n- Supply chain disruptions for hardware components are easing.",
    },
  });

  const onSubmit: SubmitHandler<ForecastingFormValues> = async (data) => {
    setIsLoading(true);
    setForecastResult(null);
    try {
      // AI-powered forecasting
      const result = await revenueExpenseForecasting({
        historicalData: data.historicalData,
        marketTrends: data.marketTrends,
      });
      setForecastResult(result);
      toast({
        title: "Forecast Generated Successfully",
        description: "AI-powered financial forecast and strategic recommendations are now available below.",
      });
    } catch (error) {
      console.error("Forecasting error:", error);
      toast({
        variant: "destructive",
        title: "Forecasting Error",
        description: "An error occurred while generating the forecast. Please check your input or try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-4xl mx-auto shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary/90 to-primary/70 p-6">
          <div className="flex items-center gap-3">
            <Brain className="h-10 w-10 text-primary-foreground" />
            <div>
              <CardTitle className="text-3xl font-bold text-primary-foreground">
                AI-Powered Financial Forecasting
              </CardTitle>
              <CardDescription className="text-base text-primary-foreground/80 mt-1">
                Leverage predictive analytics to project future revenue, expenses, and profit. Gain actionable insights from historical data and market intelligence.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="historicalData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Historical Financial Data</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter detailed historical data: revenue, expenses, profit, categories, dates, key events..."
                        className="min-h-[200px] border-2 focus:border-primary focus:ring-primary transition-shadow shadow-sm hover:shadow-md"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-sm">
                      Provide comprehensive data for accurate forecasting. Include context like product launches or market shifts. (Max 5000 chars)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="marketTrends"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Current Market Trends & Economic Indicators</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe relevant market conditions: competitor activities, economic outlook, industry regulations, technological advancements..."
                        className="min-h-[150px] border-2 focus:border-primary focus:ring-primary transition-shadow shadow-sm hover:shadow-md"
                        {...field}
                      />
                    </FormControl>
                     <FormDescription className="text-sm">
                      Include factors that could significantly impact your business performance, both positively and negatively. (Max 3000 chars)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full text-lg py-3" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Forecast...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" /> Generate Advanced Forecast
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="max-w-4xl mx-auto mt-10 shadow-2xl rounded-xl">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl flex items-center gap-2">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
                AI Analyzing Data & Trends...
            </CardTitle>
            <CardDescription>Please wait while our advanced algorithms process your information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6 md:p-8">
            <Skeleton className="h-10 w-3/4 rounded-md" />
            <Skeleton className="h-24 w-full rounded-md" />
            <Skeleton className="h-10 w-1/2 rounded-md" />
            <Skeleton className="h-20 w-full rounded-md" />
             <Skeleton className="h-10 w-2/3 rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
          </CardContent>
        </Card>
      )}

      {forecastResult && !isLoading && (
        <Card className="max-w-4xl mx-auto mt-10 shadow-2xl rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5 p-6">
            <CardTitle className="text-2xl flex items-center gap-3">
              <Lightbulb className="h-8 w-8 text-yellow-400" />
              AI Financial Forecast & Strategic Insights
            </CardTitle>
             <CardDescription>Generated based on the data provided.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-6 md:p-8">
            <Alert className="border-l-4 border-green-500 bg-green-500/10 shadow-md">
              <Zap className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-xl font-bold text-green-700">Revenue Forecast</AlertTitle>
              <AlertDescription className="text-base mt-1 whitespace-pre-wrap">{forecastResult.revenueForecast}</AlertDescription>
            </Alert>
            <Alert className="border-l-4 border-red-500 bg-red-500/10 shadow-md">
              <Zap className="h-5 w-5 text-red-600" />
              <AlertTitle className="text-xl font-bold text-red-700">Expense Forecast</AlertTitle>
              <AlertDescription className="text-base mt-1 whitespace-pre-wrap">{forecastResult.expenseForecast}</AlertDescription>
            </Alert>
             <Alert variant="default" className="border-l-4 border-primary bg-primary/10 shadow-md">
              <Brain className="h-5 w-5 text-primary" />
              <AlertTitle className="text-xl font-bold text-primary">Projected Profit</AlertTitle>
              <AlertDescription className="text-base mt-1 whitespace-pre-wrap">{forecastResult.profitForecast}</AlertDescription>
            </Alert>
            
            <Card className="border-primary/30 shadow-md">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-xl text-primary flex items-center gap-2">
                  <Lightbulb className="h-6 w-6" />
                  Strategic Recommendations & Insights
                  </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-base whitespace-pre-wrap leading-relaxed">{forecastResult.recommendations}</p>
              </CardContent>
            </Card>

          </CardContent>
           <CardFooter className="p-6 bg-muted/50 border-t">
            <p className="text-sm text-muted-foreground italic">
              <strong>Disclaimer:</strong> AI-generated forecasts are based on the provided data and current analytical models. They are intended as a tool to assist in decision-making and should not be considered as definitive financial advice or the sole source of truth. Always cross-reference with other financial analyses and expert opinions.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}