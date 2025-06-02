
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard, // Used for Home (Portal)
  DollarSign,
  FileText,
  Brain,
  Blocks,
  ShieldAlert,
  Settings,
  LogOut,
  HelpCircle,
  GalleryVerticalEnd, // Used for AI Studio
  Mic,
  Network, // Used for Phase Map
  ImageIcon, // For NFT Gallery (Changed from GalleryThumbnails for variety)
  UserCircle2, // For Avatar
  KanbanSquare, // For Symbolic Dashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThirdEyeDomeIcon } from '@/components/icons/ThirdEyeDomeIcon';

const navItems = [
  { href: '/', label: 'Home Portal', icon: LayoutDashboard },
  { href: '/dashboard', label: 'Dashboard', icon: KanbanSquare },
  { href: '/studio', label: 'AI Studio', icon: GalleryVerticalEnd },
  { href: '/nft-gallery', label: 'NFT Gallery', icon: ImageIcon },
  { href: '/avatar', label: 'Avatar Room', icon: UserCircle2 },
  { href: '/data-entry', label: 'Data Entry', icon: DollarSign },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/forecasting', label: 'AI Forecasting', icon: Brain },
  { href: '/chain', label: 'Chain Log', icon: Blocks },
  { href: '/voice', label: 'Voice Systems', icon: Mic },
  { href: '/phase-map', label: 'Phase Map', icon: Network },
  { href: '/threats', label: 'Threat Alerts', icon: ShieldAlert },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <ThirdEyeDomeIcon className="h-8 w-8 text-primary hidden group-data-[collapsible=icon]:block" />
          <div className="group-data-[collapsible=icon]:hidden">
            <h2 className="text-lg font-semibold text-primary">Fisk Dimension</h2>
            <p className="text-xs text-muted-foreground">Beyond the Ledger, Within the Soul.</p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  isActive={pathname === item.href}
                  tooltip={{ content: item.label, side: 'right', className: 'ml-2' }}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-sidebar-border">
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start" tooltip={{ content: "Settings", side: 'right', className: 'ml-2' }}>
                    <Settings className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start" tooltip={{ content: "Help", side: 'right', className: 'ml-2' }}>
                    <HelpCircle className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">Help</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start" tooltip={{ content: "Log Out", side: 'right', className: 'ml-2' }}>
                    <LogOut className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">Log Out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
