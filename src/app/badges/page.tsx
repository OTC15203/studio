
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award, Construction } from "lucide-react";

export default function SoulboundTrackerPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Soulbound Badges</CardTitle>
              <CardDescription>
                Track and display your immutable Soulbound Badges, earned through activities and symbolic growth within the Fisk Dimension.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Construction className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Soulbound Badge tracking and display system is under development.</p>
            <p className="mt-1 text-sm">Badges will unlock hidden realms, lore, and economic gateways.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
