'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import Image from 'next/image';
import { Progress } from "@/components/ui/progress";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink, ArrowRight, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Sigma, BrainCircuit, Blocks, ServerCrash, Zap, ShieldAlert, Settings, Users, Activity } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";


const mockRevenueData = [
  { month: "Jan", revenue: 4000, expenses: 2400, profit: 1600 },
  { month: "Feb", revenue: 3000, expenses: 1398, profit: 1602 },
  { month: "Mar", revenue: 2000, expenses: 9800, profit: -7800 },
  { month: "Apr", revenue: 2780, expenses: 3908, profit: -1128 },
  { month: "May", revenue: 1890, expenses: 4800, profit: -2910 },
  { month: "Jun", revenue: 2390, expenses: 3800, profit: -1410 },
  { month: "Jul", revenue: 3490, expenses: 4300, profit: -810 },
  { month: "Aug", revenue: 3680, expenses: 4100, profit: -420 },
  { month: "Sep", revenue: 3900, expenses: 3950, profit: -50 },
  { month: "Oct", revenue: 4200, expenses: 3800, profit: 400 },
  { month: "Nov", revenue: 4500, expenses: 4000, profit: 500 },
  { month: "Dec", revenue: 4800, expenses: 4200, profit: 600 },
];

const mockExpenseCategoryData = [
  { name: "Marketing", value: 400, fill: "hsl(var(--chart-1))" },
  { name: "Operations", value: 300, fill: "hsl(var(--chart-2))" },
  { name: "Development", value: 300, fill: "hsl(var(--chart-3))" },
  { name: "Sales", value: 200, fill: "hsl(var(--chart-4))" },
  { name: "Admin", value: 278, fill: "hsl(var(--chart-5))" },
  { name: "Support", value: 189, fill: "hsl(var(--primary))" },
];

const chartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--chart-3))" }, // Teal - Neutral
  expenses: { label: "Expenses", color: "hsl(var(--chart-2))" }, // Red - Negative
  profit: { label: "Profit", color: "hsl(var(--chart-1))" }, // Yellow - Positive
};

const kpiData = [
    { title: "Total Revenue", value: "$1.2M", trend: "+15%", period: "vs last month", icon: TrendingUp, iconColor: "text-green-500", dataAiHint: "money bag" },
    { title: "Net Profit Margin", value: "18.5%", trend: "-2.1%", period: "vs last quarter", icon: TrendingDown, iconColor: "text-red-500", dataAiHint: "graph down"},
    { title: "Customer Acquisition Cost", value: "$120", trend: "+5%", period: "vs last month", icon: Users, iconColor: "text-blue-500", dataAiHint: "target user"},
    { title: "Transaction Throughput", value: "1.5k", unit: "tx/hr", trend: "+8%", period: "peak", icon: Activity, iconColor: "text-indigo-500", dataAiHint: "speed fast" },
];

const recentActivities = [
  { id: 'act-1', description: "AI model 'RevenuePredict_v3' retrained successfully.", timestamp: "2 hours ago", type: "system", icon: BrainCircuit },
  { id: 'act-2', description: "Large expense transaction $15,200 (Marketing) logged.", timestamp: "5 hours ago", type: "finance", icon: TrendingDown },
  { id: 'act-3', description: "Blockchain integrity check passed for all nodes.", timestamp: "Yesterday", type: "security", icon: Blocks },
  { id: 'act-4', description: "User 'john.doe@example.com' accessed sensitive report 'Q4_Financials'.", timestamp: "Yesterday", type: "access", icon: ExternalLink },
  { id: 'act-5', description: "Threat detection system flagged 2 low-priority anomalies.", timestamp: "3 days ago", type: "threat", icon: ShieldAlert },
];

const systemHealthMetrics = [
    { name: 'AI Core Processing', value: 75, unit: '%', icon: BrainCircuit, normalRange: [0,85], hint: "Current load on AI processing units." },
    { name: 'Blockchain Node Sync', value: 99.8, unit: '%', icon: Blocks, normalRange: [99,100], hint: "Synchronization status with the blockchain network." },
    { name: 'Database IOPS', value: 3500, unit: 'ops/s', icon: ServerCrash, normalRange: [0,10000], hint: "Input/Output operations per second on database." },
    { name: 'API Gateway Latency', value: 45, unit: 'ms', icon: Zap, normalRange: [0,150], hint: "Average response time of the API gateway." },
    { name: 'Threat Detection Queue', value: 5, unit: 'items', icon: ShieldAlert, normalRange: [0,50], hint: "Items pending in the threat detection queue." },
];


export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("90d"); // Example: 90 days

  // Effect for any client-side only operations if needed
  useEffect(() => {
    // For example, if you needed to use window or other browser APIs
  }, []);

  const getHealthStatus = (value: number, normalRange: [number, number]): { color: string, icon: React.ElementType, label: string } => {
    if (value < normalRange[0] || value > normalRange[1]) {
      return { color: "text-red-500", icon: AlertTriangle, label: "Critical" };
    }
    // Check for warning (e.g. within 10% of range boundaries)
    const rangeSize = normalRange[1] - normalRange[0];
    if (value < normalRange[0] + rangeSize * 0.1 || value > normalRange[1] - rangeSize * 0.1) {
      return { color: "text-yellow-500", icon: AlertTriangle, label: "Warning" };
    }
    return { color: "text-green-500", icon: CheckCircle, label: "Normal" };
  };


  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">THIRD EYE DOME - Dashboard</h1>
        <div className="flex items-center space-x-2">
          {/* Time range selector can be added here if needed */}
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Customize
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={`h-5 w-5 ${kpi.iconColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{kpi.value}{kpi.unit && <span className="text-xl text-muted-foreground">{kpi.unit}</span>}</div>
              <p className={`text-xs ${kpi.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.trend} <span className="text-muted-foreground">{kpi.period}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue and Expenses Chart */}
        <Card className="lg:col-span-4 shadow-lg">
          <CardHeader>
            <CardTitle>Revenue vs. Expenses Overview</CardTitle>
            <CardDescription>Monthly financial performance trends.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <ResponsiveContainer>
                <RechartsBarChartContainer data={mockRevenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
                  <RechartsTooltip
                    content={<ChartTooltipContent indicator="dot" cursor={{ fill: 'hsl(var(--accent) / 0.2)' }} />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} barSize={20}/>
                  <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} barSize={20}/>
                  {/* <Bar dataKey="profit" fill="var(--color-profit)" radius={[4, 4, 0, 0]} /> Profit bar can be too dominant or confusing with stacked/grouped bars*/}
                </RechartsBarChartContainer>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Expense Categories Pie Chart */}
        <Card className="lg:col-span-3 shadow-lg">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Distribution of expenses by category.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[350px]">
              <ResponsiveContainer>
                <RechartsPieChartContainer>
                  <RechartsTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={mockExpenseCategoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {mockExpenseCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <RechartsLegend iconType="circle" />
                </RechartsPieChartContainer>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Recent Activities */}
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Recent Platform Activity</CardTitle>
                <CardDescription>Key events and system notifications.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3">
                            <div className="flex-shrink-0 pt-0.5">
                                <activity.icon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-medium leading-tight">{activity.description}</p>
                                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        {/* System Health Monitoring */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>System Health & Performance</CardTitle>
            <CardDescription>Real-time status of critical system components.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {systemHealthMetrics.map((metric) => {
              const status = getHealthStatus(metric.value, metric.normalRange);
              return (
                <Tooltip key={metric.name}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors">
                      <div className="flex items-center gap-3">
                        <metric.icon className={`h-5 w-5 ${status.color}`} />
                        <span className="text-sm font-medium">{metric.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={status.label === 'Critical' ? 'destructive' : status.label === 'Warning' ? 'default' : 'secondary'} className="text-xs">{status.label}</Badge>
                        <span className="text-sm font-semibold">{metric.value}{metric.unit}</span>
                        <Progress value={(metric.value / metric.normalRange[1]) * 100} className="w-24 h-2" 
                            aria-label={`${metric.name} at ${metric.value}${metric.unit}, ${status.label}`} />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="start">
                    <p>{metric.hint}</p>
                    <p className="text-xs text-muted-foreground">Normal Range: {metric.normalRange[0]} - {metric.normalRange[1]}{metric.unit}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
