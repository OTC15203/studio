
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
  LayoutDashboard, 
  DollarSign,
  FileText,
  Brain,
  Blocks,
  ShieldAlert,
  Settings,
  LogOut,
  HelpCircle,
  GalleryVerticalEnd, 
  Mic,
  Network, 
  ImageIcon, 
  UserCircle2, 
  KanbanSquare,
  SlidersHorizontal, // For Frequency Sync
  PocketKnife, // For Frequency Oracle (tool/oracle)
  Users, // For Round Table
  BadgeCheck, // For Passport
  Award, // For Badges
  ServerCog, // For Node Init
  Globe, // For Domain
  Lock, // For Vault (Quantum Vault)
  Zap, // For Lightning
  Scroll, // For Legacy Artifacts
  GitMerge, // For Genesis Bridge
  PackageSearch, // For Mystery Box
  TrendingUp, // For Ascension
  TowerControl, // For Guardian Node
  KeySquare, // For Cipher Sanctuary
  ClipboardList, // For Quest Log
  Atom, // For Soul Core
  BookOpenText, // For Prophecy
  MessageCircle, // For Ember Chat
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
  // New items based on the expanded list
  { href: '/frequency-sync', label: 'Frequency Sync', icon: SlidersHorizontal },
  { href: '/frequency-oracle', label: 'Frequency Oracle', icon: PocketKnife },
  { href: '/round-table', label: 'Round Table', icon: Users },
  { href: '/passport', label: 'Resonance Passport', icon: BadgeCheck },
  { href: '/badges', label: 'Soulbound Badges', icon: Award },
  { href: '/node-init', label: 'Node Init', icon: ServerCog },
  { href: '/domain', label: 'Domain Sovereignty', icon: Globe },
  { href: '/vault', label: 'Quantum Vault', icon: Lock },
  { href: '/lightning', label: 'Lightning Bridge', icon: Zap },
  { href: '/legacy-artifacts', label: 'Legacy Artifacts', icon: Scroll },
  { href: '/genesis-bridge', label: 'Genesis Bridge', icon: GitMerge },
  { href: '/mystery-box', label: 'Mystery Box Hub', icon: PackageSearch },
  { href: '/ascension', label: 'Tiered Ascension', icon: TrendingUp },
  { href: '/guardian-node', label: 'Guardian Node', icon: TowerControl },
  { href: '/cipher-sanctuary', label: 'Cipher Sanctuary', icon: KeySquare },
  { href: '/quest-log', label: 'Encrypted Quest Log', icon: ClipboardList },
  { href: '/soul-core', label: 'Soul Matrix Core', icon: Atom },
  { href: '/prophecy', label: 'Legacy Prophecy', icon: BookOpenText },
  { href: '/ember-chat', label: 'Ember Chat', icon: MessageCircle },
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
