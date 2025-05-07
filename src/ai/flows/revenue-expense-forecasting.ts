//RevenueExpenseForecasting.ts
'use server';

/**
 * @fileOverview AI-powered predictive analytics for forecasting revenue and expenses based on historical data and market trends.
 *
 * - revenueExpenseForecasting - A function that handles the revenue and expense forecasting process.
 * - RevenueExpenseForecastingInput - The input type for the revenueExpenseForecasting function.
 * - RevenueExpenseForecastingOutput - The return type for the revenueExpenseForecasting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RevenueExpenseForecastingInputSchema = z.object({
  historicalData: z
    .string()
    .describe(
      'Historical revenue and expense data, including dates, amounts, and categories.'
    ),
  marketTrends: z
    .string()
    .describe(
      'Current market trends and economic indicators relevant to the business.'
    ),
});
export type RevenueExpenseForecastingInput = z.infer<
  typeof RevenueExpenseForecastingInputSchema
>;

const RevenueExpenseForecastingOutputSchema = z.object({
  revenueForecast: z
    .string()
    .describe('Forecasted revenue for the upcoming period.'),
  expenseForecast: z
    .string()
    .describe('Forecasted expenses for the upcoming period.'),
  profitForecast: z
    .string()
    .describe('Forecasted profit (revenue minus expenses) for the upcoming period.'),
  recommendations: z
    .string()
    .describe(
      'Recommendations for improving financial performance based on the forecast.'
    ),
});
export type RevenueExpenseForecastingOutput = z.infer<
  typeof RevenueExpenseForecastingOutputSchema
>;

export async function revenueExpenseForecasting(
  input: RevenueExpenseForecastingInput
): Promise<RevenueExpenseForecastingOutput> {
  return revenueExpenseForecastingFlow(input);
}

const revenueExpenseForecastingPrompt = ai.definePrompt({
  name: 'revenueExpenseForecastingPrompt',
  input: {schema: RevenueExpenseForecastingInputSchema},
  output: {schema: RevenueExpenseForecastingOutputSchema},
  prompt: `You are a financial analyst tasked with forecasting revenue and expenses for a business.

  Based on the historical data and market trends provided, generate a forecast for revenue, expenses, and profit for the upcoming period.

  Also, provide recommendations for improving financial performance based on your forecast.

  Historical Data: {{{historicalData}}}
  Market Trends: {{{marketTrends}}}`,
});

const revenueExpenseForecastingFlow = ai.defineFlow(
  {
    name: 'revenueExpenseForecastingFlow',
    inputSchema: RevenueExpenseForecastingInputSchema,
    outputSchema: RevenueExpenseForecastingOutputSchema,
  },
  async input => {
    const {output} = await revenueExpenseForecastingPrompt(input);
    return output!;
  }
);
