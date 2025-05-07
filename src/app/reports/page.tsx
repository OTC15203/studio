// @ts-nocheck
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker"; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, BarChart2 as LucideBarChart2Icon, PieChart as LucidePieChartIcon, LineChart as LucideLineChartIcon } from "lucide-react"; // Aliased Lucide Icons
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
// Imported actual Recharts container components and aliased them
import { 
  BarChart as RechartsBarChartContainer, 
  LineChart as RechartsLineChartContainer, 
  PieChart as RechartsPieChartContainer,
  Bar, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Pie, // Pie series component
  Cell, 
  Legend as RechartsLegend, 
  Line as RechartsLineSeries // Line series component, aliased to avoid conflict if any other 'Line' is in scope
} from 'recharts';
import type { DateRange } from "react-day-picker";
import { addDays, format } from 'date-fns';
import { toast } from '@/hooks/use-toast';


// Mock data - replace with actual data fetching
const mockTransactions = [
  { id: '1', date: '2023-01-15', type: 'revenue', category: 'Software Sales', amount: 5000, currency: 'USD' },
  { id: '2', date: '2023-01-20', type: 'expense', category: 'Marketing', amount: 500, currency: 'USD' },
  { id: '3', date: '2023-02-10', type: 'revenue', category: 'Consulting', amount: 3000, currency: 'USD' },
  { id: '4', date: '2023-02-25', type: 'expense', category: 'Office Supplies', amount: 150, currency: 'USD' },
  { id: '5', date: '2023-03-05', type: 'revenue', category: 'Software Sales', amount: 6000, currency: 'USD' },
  { id: '6', date: '2023-03-15', type: 'expense', category: 'Salaries', amount: 8000, currency: 'USD' },
  { id: '7', date: '2023-04-10', type: 'revenue', category: 'Maintenance', amount: 1200, currency: 'USD' },
  { id: '8', date: '2023-04-20', type: 'expense', category: 'Cloud Hosting', amount: 300, currency: 'USD' },
];

interface ReportData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
}

const chartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--chart-3))" }, // Teal
  expenses: { label: "Expenses", color: "hsl(var(--chart-2))" }, // Red
  profit: { label: "Profit", color: "hsl(var(--chart-1))" }, // Yellow
};

const PIE_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];


export default function ReportsPage() {
  const [timePeriod, setTimePeriod] = useState<string>("last_3_months");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -90),
    to: new Date(),
  });
  const [chartType, setChartType] = useState<"bar" | "pie" | "line">("bar");

  const filteredData = useMemo(() => {
    return mockTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      if (dateRange?.from && dateRange?.to) {
        return transactionDate >= dateRange.from && transactionDate <= dateRange.to;
      }
      return true; // If no date range, include all (or handle as error)
    });
  }, [dateRange]);

  const aggregatedData: ReportData[] = useMemo(() => {
    // This is a simplified aggregation by month. A real app would need more robust logic.
    const monthlyData: { [key: string]: { revenue: number, expenses: number } } = {};
    filteredData.forEach(t => {
      const monthYear = format(new Date(t.date), "MMM yyyy");
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { revenue: 0, expenses: 0 };
      }
      if (t.type === 'revenue') monthlyData[monthYear].revenue += t.amount;
      if (t.type === 'expense') monthlyData[monthYear].expenses += t.amount;
    });

    return Object.entries(monthlyData).map(([period, data]) => ({
      period,
      revenue: data.revenue,
      expenses: data.expenses,
      profit: data.revenue - data.expenses,
    })).sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime());
  }, [filteredData]);
  
  const expenseBreakdown = useMemo(() => {
    const breakdown: { name: string, value: number }[] = [];
    const expenseCategories: { [key: string]: number } = {};
    filteredData.filter(t => t.type === 'expense').forEach(t => {
        expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
    });
    for (const [name, value] of Object.entries(expenseCategories)) {
        breakdown.push({ name, value });
    }
    return breakdown;
  }, [filteredData]);


  const handleExport = (format: "csv" | "pdf") => {
    // Placeholder for export functionality
    toast({ title: `Exporting as ${format.toUpperCase()}`, description: "This feature is under development." });
    console.log(`Exporting data as ${format}`, aggregatedData);
  };

  const renderChart = () => {
    if (chartType === "bar") {
      return (
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer>
            <RechartsBarChartContainer data={aggregatedData}> {/* Use correct container */}
              <CartesianGrid vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis dataKey="amount" tickLine={false} axisLine={false} />
              <RechartsTooltip content={<ChartTooltipContent indicator="dot" />} cursor={{ fill: 'hsl(var(--accent) / 0.2)' }} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" fill="var(--color-profit)" radius={[4, 4, 0, 0]} />
            </RechartsBarChartContainer>
          </ResponsiveContainer>
        </ChartContainer>
      );
    }
    if (chartType === "line") {
        return (
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <ResponsiveContainer>
                <RechartsLineChartContainer data={aggregatedData}> {/* Use correct container */}
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="period" tickLine={false} axisLine={false} />
                  <YAxis dataKey="amount" tickLine={false} axisLine={false} />
                  <RechartsTooltip content={<ChartTooltipContent indicator="dot" />} cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 2, fill: 'hsl(var(--accent) / 0.2)' }}/>
                  <ChartLegend content={<ChartLegendContent />} />
                  <RechartsLineSeries type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={{ r: 4}} />
                  <RechartsLineSeries type="monotone" dataKey="expenses" stroke="var(--color-expenses)" strokeWidth={2} dot={{ r: 4}} />
                  <RechartsLineSeries type="monotone" dataKey="profit" stroke="var(--color-profit)" strokeWidth={3} dot={{ r: 5}} />
                </RechartsLineChartContainer>
              </ResponsiveContainer>
            </ChartContainer>
        );
    }
    if (chartType === "pie" && expenseBreakdown.length > 0) {
      return (
        <ChartContainer config={{}} className="h-[400px] w-full">
          <ResponsiveContainer>
            <RechartsPieChartContainer> {/* Use correct container */}
              <RechartsTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={expenseBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                {expenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <RechartsLegend iconType="circle" />
            </RechartsPieChartContainer>
          </ResponsiveContainer>
        </ChartContainer>
      );
    }
    return <p className="text-center text-muted-foreground py-10">Select a chart type or ensure data is available for pie chart.</p>;
  };
  

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Financial Reports</CardTitle>
          <CardDescription>Analyze profit vs. expense, customize time periods, and visualize data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Time period selection removed, DatePickerWithRange is primary */}
            <DatePickerWithRange date={dateRange} setDate={setDateRange} className="flex-grow" />
            <Select value={chartType} onValueChange={(value: "bar" | "pie" | "line") => setChartType(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Chart Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar"><LucideBarChart2Icon className="inline-block mr-2 h-4 w-4" />Bar Chart</SelectItem>
                <SelectItem value="line"><LucideLineChartIcon className="inline-block mr-2 h-4 w-4" />Line Chart</SelectItem>
                <SelectItem value="pie"><LucidePieChartIcon className="inline-block mr-2 h-4 w-4" />Expense Pie</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => handleExport("csv")} variant="outline">
              <Download className="mr-2 h-4 w-4" /> CSV
            </Button>
            <Button onClick={() => handleExport("pdf")} variant="outline">
              <Download className="mr-2 h-4 w-4" /> PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl mb-8">
        <CardHeader>
          <CardTitle>{chartType === 'pie' ? 'Expense Breakdown' : 'Profit & Loss Analysis'}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Detailed Transactions</CardTitle>
          <CardDescription>Transactions within the selected period.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? filteredData.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{format(new Date(t.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell className={`capitalize ${t.type === 'revenue' ? 'text-green-400' : 'text-red-400'}`}>{t.type}</TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell className={`text-right font-medium ${t.type === 'revenue' ? 'text-green-400' : 'text-red-400'}`}>
                    {t.type === 'expense' ? '-' : ''}${t.amount.toLocaleString()} {t.currency}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-10">No transactions found for the selected period.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Removed incorrect re-declarations of Recharts components
// const RechartsBarChart = Bar; // Incorrect
// const RechartsPieChart = Pie; // Incorrect
// const RechartsLineChartOriginal = RechartsLine; // Incorrect
