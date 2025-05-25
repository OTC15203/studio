
"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Network, Construction } from "lucide-react";

export default function PhaseMapPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Network className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Project Phase Map</CardTitle>
              <CardDescription>Visualizing the 25-phase master structure of Fisk Dimension. This page is under construction.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col items-center justify-center py-12 text-center">
            <Construction className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">The interactive Phase Map is currently under development.</p>
            <p className="mt-2 text-sm">This section will provide an overview and status of each of the 25 project phases, including "Recursive Intelligence Uplink".</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
