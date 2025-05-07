"use client";

import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from '@/components/ui/tooltip';
import AppShell from './AppShell';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <AppShell>
          {children}
        </AppShell>
      </SidebarProvider>
    </TooltipProvider>
  );
}
