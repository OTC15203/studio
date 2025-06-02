
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { KeySquare, Construction } from "lucide-react";

export default function CipherSanctuaryPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <KeySquare className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Cipher Sanctuary</CardTitle>
              <CardDescription>
                A secure space for managing ciphers, keys, and engaging in encrypted communication using glyphs and soulcodes.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Construction className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Cipher Sanctuary and symbolic messaging systems are under development.</p>
            <p className="mt-1 text-sm">This will integrate with CipherCommand v2 and CodeSigil v3.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
