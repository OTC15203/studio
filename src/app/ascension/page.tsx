
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Construction } from "lucide-react";

export default function TieredAscensionPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Tiered Ascension</CardTitle>
              <CardDescription>
                Track your progression through the Fisk Dimension membership hierarchy: Seeker → Cipher → Oracle → Architect → RoundTable.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Construction className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Tiered Ascension pathway and role logic are under development.</p>
            <p className="mt-1 text-sm">Roles will unlock access, content, voting rights, and symbolic contribution metrics.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
