
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KanbanSquare, BarChartHorizontalBig, Target, UserCheck, ShieldCheck, Link as LinkIcon, Bell, RadioTower } from "lucide-react";
import Link from 'next/link';

const dashboardModules = [
  { title: "Resonance Feed", description: "Real-time updates and symbolic alignments.", icon: RadioTower, link: "/dashboard/resonance" },
  { title: "Active Quests & Milestones", description: "Track your journey and ongoing tasks.", icon: Target, link: "/dashboard/quests" },
  { title: "Soulbound Badges", description: "View your collected immutable achievements.", icon: UserCheck, link: "/dashboard/badges" },
  { title: "Realm Navigation", description: "Access different dimensions and project phases.", icon: BarChartHorizontalBig, link: "/phase-map" },
  { title: "Security Center", description: "Monitor threat levels and manage access.", icon: ShieldCheck, link: "/threats" },
  { title: "Inter-Platform Links", description: "Connect to partnered external realms.", icon: LinkIcon, link: "/dashboard/links" },
];

export default function SymbolicDashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl bg-card/80 backdrop-blur-md border-primary/20 rounded-xl overflow-hidden">
        <CardHeader className="border-b border-primary/10 p-6">
          <div className="flex items-center gap-3">
            <KanbanSquare className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
                Symbolic Dashboard
              </CardTitle>
              <CardDescription className="text-foreground/80 mt-1">
                Your central hub for navigating the Fisk Dimension, tracking progress, and interacting with core platform modules.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardModules.map((item) => (
              <Card key={item.title} className="shadow-lg hover:shadow-primary/30 transition-shadow duration-300 bg-card/70 border-primary/10 flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{item.title}</CardTitle>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground h-10 overflow-hidden">{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-end">
                   <Link href={item.link} passHref>
                    <Button variant="outline" className="w-full mt-4 border-accent/50 hover:bg-accent/10 hover:text-accent">
                      Access Module
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
             <Card className="shadow-lg hover:shadow-primary/30 transition-shadow duration-300 bg-card/70 border-primary/10 md:col-span-1 lg:col-span-3">
                <CardHeader>
                     <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-md">
                            <Bell className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">System Notifications & Alerts</CardTitle>
                    </div>
                  <CardDescription className="text-xs text-muted-foreground">Recent activities and important system messages.</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Placeholder for notifications list */}
                  <ul className="space-y-2 text-sm">
                    <li className="text-muted-foreground">No new notifications.</li>
                  </ul>
                   <Button variant="link" className="text-accent mt-2 p-0 h-auto">View All Notifications</Button>
                </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
