
"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GalleryVerticalEnd, Construction } from "lucide-react";

export default function StudioPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <GalleryVerticalEnd className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">AI Studio</CardTitle>
              <CardDescription>Modular dashboard for podcast, smart contract, and NFT management. This page is under construction as per the Fisk Dimension Master Update (May 2025).</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Construction className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">The AI Studio is currently under development.</p>
            <p className="mt-2 text-sm">Functionality will include tools for managing AI agents, podcast episodes, smart contract interactions, and NFT metadata.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
