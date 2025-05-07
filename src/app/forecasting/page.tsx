"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { revenueExpenseForecasting, RevenueExpenseForecastingInput, RevenueExpenseForecastingOutput } from '@/ai/flows/revenue-expense-forecasting';
import { Brain, Zap, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const forecastingSchema = z.object({
  historicalData: z.string().min(50, { message: "Please provide sufficient historical data (at least 50 characters)." }),
  marketTrends: z.string().min(20, { message: "Please describe relevant market trends (at least 20 characters)." }),
});

type ForecastingFormValues = z.infer<typeof forecastingSchema>;

export default function ForecastingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [forecastResult, setForecastResult] = useState<RevenueExpenseForecastingOutput | null>(null);

  const form = useForm<ForecastingFormValues>({
    resolver: zodResolver(forecastingSchema),
    defaultValues: {
      historicalData: "Example: \nJan 2023: Revenue $10000, Expenses $6000\nFeb 2023: Revenue $12000, Expenses $6500\nMar 2023: Revenue $11000, Expenses $6200\n...",
      marketTrends: "Example: \nOverall economic growth steady. Competitor X launched a new product. Increased demand for Y services.\n...",
    },
  });

  const onSubmit: SubmitHandler<ForecastingFormValues> = async (data) => {
    setIsLoading(true);
    setForecastResult(null);
    try {
      const result = await revenueExpenseForecasting(data);
      setForecastResult(result);
      toast({
        title: "Forecast Generated",
        description: "AI-powered forecast and recommendations are ready.",
      });
    } catch (error) {
      console.error("Forecasting error:", error);
      toast({
        variant: "destructive",
        title: "Forecasting Error",
        description: "Could not generate forecast. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Brain className="h-7 w-7 text-primary" />
            AI-Powered Financial Forecasting
          </CardTitle>
          <CardDescription>
            Utilize predictive analytics to forecast revenue and expenses based on historical data and market trends.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="historicalData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Historical Revenue & Expense Data</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide detailed historical data including dates, amounts, and categories..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The more detailed and accurate the data, the better the forecast.
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
                    <FormLabel>Current Market Trends & Economic Indicators</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe relevant market conditions, competitor activities, economic forecasts, etc..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                     <FormDescription>
                      Include factors that might impact your business performance.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Zap className="mr-2 h-4 w-4 animate-pulse" /> Generating Forecast...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" /> Generate Forecast
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="max-w-3xl mx-auto mt-8 shadow-xl">
          <CardHeader>
            <CardTitle>Generating Forecast...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      )}

      {forecastResult && !isLoading && (
        <Card className="max-w-3xl mx-auto mt-8 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-yellow-400" />
              Forecast Results & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertTitle className="font-semibold">Revenue Forecast</AlertTitle>
              <AlertDescription>{forecastResult.revenueForecast}</AlertDescription>
            </Alert>
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertTitle className="font-semibold">Expense Forecast</AlertTitle>
              <AlertDescription>{forecastResult.expenseForecast}</AlertDescription>
            </Alert>
             <Alert variant="default" className="bg-primary/10 border-primary/30">
              <Brain className="h-4 w-4 text-primary" />
              <AlertTitle className="font-semibold text-primary">Profit Forecast</AlertTitle>
              <AlertDescription className="text-primary/90">{forecastResult.profitForecast}</AlertDescription>
            </Alert>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Strategic Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{forecastResult.recommendations}</p>
              </CardContent>
            </Card>
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground">
              Note: AI forecasts are based on provided data and current models. Use them as a tool to assist decision-making, not as a sole source of truth.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
