--- a/src/app/page.tsx
+++ b/src/app/page.tsx
@@ -1,5 +1,5 @@
 
-"use client";
+'use client';
 
 import React, { useState, useEffect } from 'react';
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
@@ -8,13 +8,13 @@
 import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
 // Imported actual Recharts container components and aliased them
 import { 
-  BarChart as RechartsBarChartContainer, 
-  LineChart as RechartsLineChartContainer, 
-  Bar, 
-  CartesianGrid, 
-  XAxis, 
-  YAxis, 
-  Tooltip as RechartsTooltip, 
+  BarChart as RechartsBarChartContainer,
+  LineChart as RechartsLineChartContainer,
+  Bar,
+  CartesianGrid,
+  XAxis,
+  YAxis,
+  Tooltip as RechartsTooltip,
   ResponsiveContainer, 
   Pie, 
   Cell, 
@@ -23,7 +23,7 @@
 } from 'recharts';
 import Image from 'next/image';
 import { Progress } from "@/components/ui/progress";
-
+import { CardDescription } from '@/components/ui/card';
 
 const mockRevenueData = [
   { month: "Jan", revenue: 4000, expenses: 2400, profit: 1600 },
