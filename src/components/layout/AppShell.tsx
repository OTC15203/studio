"use client";

import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar collapsible="icon">
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </>
  );
}
