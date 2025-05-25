
"use client";

import React from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Wallet, User } from "lucide-react";
import { ThirdEyeDomeIcon } from '@/components/icons/ThirdEyeDomeIcon';

export default function AppHeader() {
  const handleWalletClick = () => {
    // TODO: Implement actual wallet connection logic here
    // For now, we can check if MetaMask is available and log messages
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
      // Example: try to request accounts
      // window.ethereum.request({ method: 'eth_requestAccounts' })
      //   .then(handles => console.log('Accounts requested:', handles))
      //   .catch(err => console.error('Error requesting accounts:', err));
      alert("Wallet functionality is under development. MetaMask is detected.");
    } else {
      console.warn('MetaMask is not installed. Please install it to use wallet features.');
      alert('Wallet functionality is under development. MetaMask is not detected. Please install MetaMask.');
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex items-center gap-2">
        <ThirdEyeDomeIcon className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Fisk Dimension</h1>
          <p className="text-xs text-muted-foreground">Beyond the Ledger, Within the Soul.</p>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        {/* Wallet Button with placeholder onClick handler */}
        <Button variant="ghost" size="icon" className="rounded-full" onClick={handleWalletClick} aria-label="Wallet">
          <Wallet className="h-6 w-6" />
          <span className="sr-only">i need my wallets to function</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="User Profile">
          <User className="h-6 w-6" />
          <span className="sr-only">User Profile</span>
        </Button>
      </div>
    </header>
  );
}
