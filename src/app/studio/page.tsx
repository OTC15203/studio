
"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GalleryVerticalEnd, Podcast, FileJson, Users, Palette, Settings2, Construction } from "lucide-react";

export default function StudioPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <GalleryVerticalEnd className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">AI Studio</CardTitle>
              <CardDescription>
                A modular dashboard for managing AI agents, the "Tales from the Inner Conscience" podcast, smart contracts, and NFT metadata. This serves as a central hub for creative and technical asset management within Fisk Dimension.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Podcast Management</CardTitle>
                <Podcast className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Tools for "Tales from the Inner Conscience": episode scheduling, voice AI configuration, and distribution.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Smart Contract Interface</CardTitle>
                <FileJson className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Monitor, deploy, and interact with smart contracts. View transaction history and audit logs.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">NFT Metadata Control</CardTitle>
                <Palette className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Manage NFT collections, update metadata, classify with biometric & project-phase tags.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">AI Agent Configuration</CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Configure and monitor custom GPT agents assigned to each project phase.
                </p>
              </CardContent>
            </Card>
             <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">FiskOS Core Analytics</CardTitle>
                <Settings2 className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Centralized control dashboard providing real-time analytics and system status.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col items-center justify-center py-12 text-center mt-8 border-t">
            <Construction className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Further AI Studio modules are currently under development.</p>
            <p className="mt-1 text-sm">Upcoming features will enhance interaction with the HoloShell UI and Quantum Mirror Portals.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
