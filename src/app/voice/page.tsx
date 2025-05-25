
"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, Construction } from "lucide-react";

export default function VoicePage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Mic className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Voice Systems</CardTitle>
              <CardDescription>Integration point for "Tales from the Inner Conscience" podcast and Fisk Neural Router v2. This page is under construction.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Construction className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Voice interaction and content management systems are currently under development.</p>
            <p className="mt-2 text-sm">This section will feature controls for the AI-powered podcast and voice command interfaces.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
