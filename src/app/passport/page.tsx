
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BadgeCheck, Construction } from "lucide-react";

export default function ResonancePassportPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <BadgeCheck className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Resonance Passport</CardTitle>
              <CardDescription>
                View and manage your unique Resonance Passport, linked to your soulcode and biometric data, providing access across the Fisk Dimension.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Construction className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Resonance Passport system and Biometric NFT integration are under development.</p>
            <p className="mt-1 text-sm">This will feature your unique encrypted resonance ID and symbolic passport artifact.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
