
"use client";

import React from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Wallet, User } from "lucide-react"; // Added User icon
import { ThirdEyeDomeIcon } from '@/components/icons/ThirdEyeDomeIcon';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex items-center gap-2">
        <ThirdEyeDomeIcon className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Fisk Dimension</h1>
          <p className="text-xs text-muted-foreground">THIRD EYE DOME</p>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Wallet className="h-6 w-6" /> 
          <span className="sr-only">i need my wallets to function</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="h-6 w-6" />
          <span className="sr-only">User Profile</span>
        </Button>
      </div>
    </header>
  );
}
