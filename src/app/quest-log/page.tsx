
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClipboardList, Construction } from "lucide-react";

export default function EncryptedQuestLogPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Encrypted Quest Log</CardTitle>
              <CardDescription>
                View and track your active quests and milestones. Your progress is logged securely and tied to resonance-triggered events.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Construction className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Encrypted Quest Log and milestone journey system are under development.</p>
            <p className="mt-1 text-sm">Features will include smart quest tokens and frequency badge activations.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
