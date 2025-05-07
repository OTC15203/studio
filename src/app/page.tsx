
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
// Aliased Lucide icons to avoid conflict with Recharts components
import { BarChart as LucideBarChartIcon, LineChart as LucideLineChartIcon } from "lucide-react"; 
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
// Imported actual Recharts container components and aliased them
import { 
  BarChart as RechartsBarChartContainer, 
  LineChart as RechartsLineChartContainer, 
  Bar, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Pie, 
  Cell, 
  Legend as RechartsLegend, 
  Line 
} from 'recharts';
import Image from 'next/image';

const mockRevenueData = [
  { month: "Jan", revenue: 4000, expenses: 2400 },
  { month: "Feb", revenue: 3000, expenses: 1398 },
  { month: "Mar", revenue: 2000, expenses: 7800 },
  { month: "Apr", revenue: 2780, expenses: 3908 },
  { month: "May", revenue: 1890, expenses: 4800 },
  { month: "Jun", revenue: 2390, expenses: 3800 },
];

const mockProfitData = mockRevenueData.map(d => ({ ...d, profit: d.revenue - d.expenses }));

const chartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--chart-3))" },
  expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
  profit: { label: "Profit", color: "hsl(var(--chart-1))" },
};

// const positiveColor = "hsl(var(--chart-1))"; // Yellow - Not used directly, colors come from chartConfig
// const negativeColor = "hsl(var(--chart-2))"; // Red - Not used directly

export default function DashboardPage() {
  const totalRevenue = mockRevenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = mockRevenueData.reduce((sum, item) => sum + item.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <MetricCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={<TrendingUp className="h-6 w-6 text-green-500" />} trend="+15% from last month" />
        <MetricCard title="Total Expenses" value={`$${totalExpenses.toLocaleString()}`} icon={<TrendingDown className="h-6 w-6 text-red-500" />} trend="+5% from last month" color="text-red-400" />
        <MetricCard title="Net Profit" value={`$${totalProfit.toLocaleString()}`} icon={<DollarSign className={`h-6 w-6 ${totalProfit >= 0 ? 'text-yellow-400' : 'text-red-500'}`} />} trend={`${totalProfit >= 0 ? '+' : ''}${((totalProfit / totalRevenue) * 100).toFixed(1)}% margin`} color={totalProfit >= 0 ? 'text-yellow-400' : 'text-red-500'} />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 mb-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Revenue & Expenses Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChartContainer data={mockRevenueData}> {/* Use correct container */}
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <RechartsTooltip
                    content={<ChartTooltipContent indicator="dot" />}
                    cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
                </RechartsBarChartContainer>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Profit Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChartContainer data={mockProfitData}> {/* Use correct container */}
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <RechartsTooltip
                    content={<ChartTooltipContent indicator="dot" />}
                    cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 2, fill: 'hsl(var(--accent) / 0.2)' }}
                  />
                   <ChartLegend content={<ChartLegendContent />} />
                  <Line type="monotone" dataKey="profit" stroke="var(--color-profit)" strokeWidth={3} dot={{ r: 5, fill: "var(--color-profit)" }} activeDot={{ r: 7 }} />
                </RechartsLineChartContainer>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <Card className="shadow-lg col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Recent Activity & Alerts</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    <li className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                            <p className="font-medium">New $5,000 revenue recorded</p>
                            <p className="text-sm text-muted-foreground">Source: Project Alpha - 2 min ago</p>
                        </div>
                    </li>
                    <li className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        <div>
                            <p className="font-medium">AI Threat Detection: Minor anomaly</p>
                            <p className="text-sm text-muted-foreground">Transaction ID #7890 - 15 min ago</p>
                        </div>
                    </li>
                     <li className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <div>
                            <p className="font-medium">AI Forecast: Q3 Revenue expected to rise by 8%</p>
                            <p className="text-sm text-muted-foreground">Generated 1 hour ago</p>
                        </div>
                    </li>
                </ul>
            </CardContent>
        </Card>
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-full">
                <Image src="https://picsum.photos/300/200?random=1" alt="System Status" width={300} height={200} className="rounded-md mb-4" data-ai-hint="server status" />
                <p className="text-2xl font-semibold text-green-400">All Systems Operational</p>
                <p className="text-sm text-muted-foreground">Last check: Just now</p>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
}

function MetricCard({ title, value, icon, trend, color = "text-foreground" }: MetricCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${color}`}>{value}</div>
        {trend && <p className="text-xs text-muted-foreground pt-1">{trend}</p>}
      </CardContent>
    </Card>
  );
}

// Removed incorrect re-declarations of RechartsBarChart and RechartsLineChart
// const RechartsBarChart = Bar; // This was incorrect
// const RechartsLineChart = Line; // This was incorrect

