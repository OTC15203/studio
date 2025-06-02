
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Scroll, Construction } from "lucide-react";

export default function LegacyArtifactsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Scroll className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Legacy Artifacts</CardTitle>
              <CardDescription>
                Explore and interact with preserved Legacy Artifacts, including historical data, contributions, and resonant stories from the Fisk Dimension.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Construction className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Legacy Artifacts archive and viewer are under development.</p>
            <p className="mt-1 text-sm">This will connect to IPFS, Ceramic Network, and Arweave for preservation.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
