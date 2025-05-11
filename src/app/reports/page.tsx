// @ts-nocheck
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker"; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, BarChart2 as LucideBarChart2Icon, PieChart as LucidePieChartIcon, LineChart as LucideLineChartIcon, ArrowUpDown, Image as LucideImage } from "lucide-react"; 
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
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
  Pie, 
  Cell, 
  Legend as RechartsLegend, 
  Line as RechartsLineSeries 
} from 'recharts';
import type { DateRange } from "react-day-picker";
import { addDays, format, parseISO } from 'date-fns';
import { toast } from '@/hooks/use-toast';


// Mock data - replace with actual data fetching
const mockTransactions = [
  { id: '1', date: '2023-01-15', type: 'revenue', category: 'Software Sales', amount: 5000, currency: 'USD', description: 'Annual license for Product X' },
  { id: '2', date: '2023-01-20', type: 'expense', category: 'Marketing', amount: 500, currency: 'USD', description: 'Social media ad campaign' },
  { id: '3', date: '2023-02-10', type: 'revenue', category: 'Consulting', amount: 3000, currency: 'USD', description: 'Project Alpha phase 1' },
  { id: '4', date: '2023-02-25', type: 'expense', category: 'Office Supplies', amount: 150, currency: 'USD', description: 'Stationery and paper' },
  { id: '5', date: '2023-03-05', type: 'revenue', category: 'Software Sales', amount: 6000, currency: 'USD', description: 'Enterprise deal for Product Y' },
  { id: '6', date: '2023-03-15', type: 'expense', category: 'Salaries', amount: 8000, currency: 'USD', description: 'Monthly payroll' },
  { id: '7', date: '2023-04-10', type: 'revenue', category: 'Maintenance', amount: 1200, currency: 'USD', description: 'Support contract renewal' },
  { id: '8', date: '2023-04-20', type: 'expense', category: 'Cloud Hosting', amount: 300, currency: 'USD', description: 'AWS S3 and EC2 costs' },
  { id: '9', date: '2023-01-05', type: 'expense', category: 'Travel', amount: 1200, currency: 'EUR', description: 'Conference trip to Berlin' },
  { id: '10', date: '2023-03-25', type: 'revenue', category: 'Training', amount: 800, currency: 'GBP', description: 'Online workshop series' },
];

type Transaction = typeof mockTransactions[0];
type SortableTransactionKeys = keyof Pick<Transaction, 'date' | 'type' | 'category' | 'amount'>;

interface ReportData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
}

const chartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--chart-3))" }, 
  expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
  profit: { label: "Profit", color: "hsl(var(--chart-1))" }, 
};

const PIE_COLORS = [
  "hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))",
  "hsl(var(--chart-4))", "hsl(var(--chart-5))", "hsl(var(--primary))",
  "hsl(var(--secondary))"
];


export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -90),
    to: new Date(),
  });
  const [chartType, setChartType] = useState<"bar" | "pie" | "line">("bar");
  const [sortConfig, setSortConfig] = useState<{ key: SortableTransactionKeys, direction: 'asc' | 'desc' } | null>({ key: 'date', direction: 'desc'});


  const filteredData = useMemo(() => {
    let transactions = mockTransactions.filter(t => {
      const transactionDate = parseISO(t.date);
      if (dateRange?.from && dateRange?.to) {
        return transactionDate >= dateRange.from && transactionDate <= dateRange.to;
      }
      return true; 
    });

    if (sortConfig !== null) {
      transactions.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === 'date') {
          valA = parseISO(a.date).getTime();
          valB = parseISO(b.date).getTime();
        }
        
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return transactions;
  }, [dateRange, sortConfig]);

  const aggregatedData: ReportData[] = useMemo(() => {
    const monthlyData: { [key: string]: { revenue: number, expenses: number } } = {};
    filteredData.forEach(t => {
      const monthYear = format(parseISO(t.date), "MMM yyyy");
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
    })).sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime()); // Ensure correct date sorting for periods
  }, [filteredData]);
  
  const expenseBreakdown = useMemo(() => {
    const breakdown: { name: string, value: number }[] = [];
    const expenseCategories: { [key: string]: number } = {};
    filteredData.filter(t => t.type === 'expense').forEach(t => {
        expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
    });
    return Object.entries(expenseCategories)
      .map(([name, value]) => ({ name, value }))
      .sort((a,b) => b.value - a.value); // Sort by value desc for pie chart
  }, [filteredData]);

  const reportSummary = useMemo(() => {
    const totalRevenue = filteredData.filter(t => t.type === 'revenue').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = filteredData.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const totalProfit = totalRevenue - totalExpenses;
    return { totalRevenue, totalExpenses, totalProfit };
  }, [filteredData]);


  const handleExport = (format: "csv" | "pdf" | "png") => {
    toast({ title: `Exporting as ${format.toUpperCase()}`, description: "This feature is under development." });
    if (format === "csv") console.log(`Exporting data as CSV`, filteredData);
    if (format === "pdf") console.log(`Exporting report as PDF`, aggregatedData, reportSummary);
    if (format === "png") console.log(`Exporting chart as PNG`);
  };

  const requestSort = (key: SortableTransactionKeys) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (columnKey: SortableTransactionKeys) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ArrowUpDown className="ml-2 h-3 w-3 opacity-30 group-hover:opacity-100 inline-block" />;
    }
    return sortConfig.direction === 'desc' ? '▼' : '▲';
  };

  const renderChart = () => {
    if (aggregatedData.length === 0 && chartType !== 'pie') {
        return <p className="text-center text-muted-foreground py-10">No data available for the selected period to render {chartType} chart.</p>;
    }
    if (chartType === "pie" && expenseBreakdown.length === 0) {
        return <p className="text-center text-muted-foreground py-10">No expense data available for the pie chart.</p>;
    }

    if (chartType === "bar") {
      return (
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer>
            <RechartsBarChartContainer data={aggregatedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="period" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
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
                <RechartsLineChartContainer data={aggregatedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="period" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} />
                  <RechartsTooltip content={<ChartTooltipContent indicator="dot" />} cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 2, fill: 'hsl(var(--accent) / 0.2)' }}/>
                  <ChartLegend content={<ChartLegendContent />} />
                  <RechartsLineSeries type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={{ r: 4}} activeDot={{ r: 6 }} />
                  <RechartsLineSeries type="monotone" dataKey="expenses" stroke="var(--color-expenses)" strokeWidth={2} dot={{ r: 4}} activeDot={{ r: 6 }}/>
                  <RechartsLineSeries type="monotone" dataKey="profit" stroke="var(--color-profit)" strokeWidth={3} dot={{ r: 5}} activeDot={{ r: 7 }} />
                </RechartsLineChartContainer>
              </ResponsiveContainer>
            </ChartContainer>
        );
    }
    if (chartType === "pie") { // expenseBreakdown.length > 0 already checked
      return (
        <ChartContainer config={{}} className="h-[400px] w-full">
          <ResponsiveContainer>
            <RechartsPieChartContainer margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <RechartsTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
              <Pie data={expenseBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {expenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <RechartsLegend iconType="circle" verticalAlign="bottom" height={36} />
            </RechartsPieChartContainer>
          </ResponsiveContainer>
        </ChartContainer>
      );
    }
    return <p className="text-center text-muted-foreground py-10">Select a chart type or ensure data is available for pie chart.</p>;
  };
  

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Financial Reports</CardTitle>
          <CardDescription>Analyze profit vs. expense, customize time periods, and visualize data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <DatePickerWithRange date={dateRange} setDate={setDateRange} className="flex-grow sm:max-w-md" />
            <div className="flex gap-2 flex-wrap justify-start sm:justify-end">
                <Select value={chartType} onValueChange={(value: "bar" | "pie" | "line") => setChartType(value)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Chart Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="bar"><LucideBarChart2Icon className="inline-block mr-2 h-4 w-4" />Bar Chart (P&L)</SelectItem>
                    <SelectItem value="line"><LucideLineChartIcon className="inline-block mr-2 h-4 w-4" />Line Chart (P&L)</SelectItem>
                    <SelectItem value="pie"><LucidePieChartIcon className="inline-block mr-2 h-4 w-4" />Expense Pie</SelectItem>
                </SelectContent>
                </Select>
                <Button onClick={() => handleExport("csv")} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> CSV
                </Button>
                <Button onClick={() => handleExport("pdf")} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> PDF
                </Button>
                <Button onClick={() => handleExport("png")} variant="outline" size="sm">
                  <LucideImage className="mr-2 h-4 w-4" /> PNG
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
            <CardTitle>Report Summary</CardTitle>
            <CardDescription>Key metrics for the selected period: {dateRange?.from && dateRange?.to ? `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}` : "All Time"}</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4 text-center md:text-left">
            <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-neutral">${reportSummary.totalRevenue.toLocaleString()}</p>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-negative">${reportSummary.totalExpenses.toLocaleString()}</p>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className={`text-2xl font-bold ${reportSummary.totalProfit >=0 ? 'text-positive' : 'text-negative'}`}>${reportSummary.totalProfit.toLocaleString()}</p>
            </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>{chartType === 'pie' ? 'Expense Breakdown Visualization' : 'Profit & Loss Visualization'}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Detailed Transactions</CardTitle>
          <CardDescription>All transactions within the selected period. Click headers to sort.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer group" onClick={() => requestSort('date')}>Date {renderSortIcon('date')}</TableHead>
                <TableHead className="cursor-pointer group" onClick={() => requestSort('type')}>Type {renderSortIcon('type')}</TableHead>
                <TableHead className="cursor-pointer group" onClick={() => requestSort('category')}>Category {renderSortIcon('category')}</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right cursor-pointer group" onClick={() => requestSort('amount')}>Amount {renderSortIcon('amount')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? filteredData.map((t) => (
                <TableRow key={t.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>{format(parseISO(t.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell className={`capitalize font-medium ${t.type === 'revenue' ? 'text-neutral' : 'text-negative'}`}>{t.type}</TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell className="text-xs text-muted-foreground truncate max-w-xs">{t.description}</TableCell>
                  <TableCell className={`text-right font-medium ${t.type === 'revenue' ? 'text-neutral' : 'text-negative'}`}>
                    {t.type === 'expense' ? '-' : ''}${t.amount.toLocaleString()} {t.currency}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-10">No transactions found for the selected period or filters.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
         <CardFooter className="text-sm text-muted-foreground">
            Displaying {filteredData.length} of {mockTransactions.length} total transactions.
        </CardFooter>
      </Card>
    </div>
  );
}
