
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThirdEyeDomeIcon } from '@/components/icons/ThirdEyeDomeIcon';
import { ArrowRight, Waves } from 'lucide-react';

export default function PortalPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.32))] p-4 md:p-6 lg:p-8 text-center bg-gradient-to-br from-background to-muted/30">
      <Card className="w-full max-w-2xl shadow-2xl bg-card/80 backdrop-blur-md border-primary/20 rounded-xl overflow-hidden">
        <CardHeader className="p-8 border-b border-primary/10">
          <div className="flex flex-col items-center gap-4">
            <ThirdEyeDomeIcon className="h-20 w-20 text-primary animate-pulse" />
            <CardTitle className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
              Fisk Dimension
            </CardTitle>
            <CardDescription className="text-lg md:text-xl text-foreground/80 max-w-md mx-auto">
              Your portal to a multidimensional ecosystem of finance, AI, and symbolic resonance.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-8 md:p-12 flex flex-col items-center gap-8">
          <Button
            size="lg"
            className="w-full max-w-xs text-lg py-8 rounded-lg shadow-lg hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground"
            onClick={() => alert("Entering the Fisk Dimension...")}
          >
            ENTER THE FISK DIMENSION
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>

          <div className="w-full max-w-md mt-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
              <span>Resonance Field</span>
              <Waves className="h-5 w-5 text-accent" />
            </div>
            <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-primary animate-pulse rounded-full"
                style={{ width: '60%' }} // Placeholder for dynamic value
                data-ai-hint="frequency wave"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              Frequency Vibration Bar (Conceptual)
            </p>
          </div>
        </CardContent>
      </Card>
      <footer className="mt-12 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Fisk Dimension. Beyond the Ledger, Within the Soul.
      </footer>
    </div>
  );
}
