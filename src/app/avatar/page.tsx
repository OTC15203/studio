
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { UserCircle2, Waves, UploadCloud, Palette } from "lucide-react"; // Palette for customization
import Image from 'next/image';

export default function AvatarPage() {
  const [soundChannel, setSoundChannel] = useState("432hz");
  const [soulprintFile, setSoulprintFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSoulprintFile(event.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl bg-card/80 backdrop-blur-md border-primary/20 rounded-xl overflow-hidden">
        <CardHeader className="border-b border-primary/10 p-6">
          <div className="flex items-center gap-3">
            <UserCircle2 className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
                Avatar Resonance Room
              </CardTitle>
              <CardDescription className="text-foreground/80 mt-1">
                Craft your unique avatar, tune into binaural soundscapes, and upload your soulprint signature.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 grid md:grid-cols-2 gap-8 items-start">
          {/* Left Column: Avatar Display and Customization Placeholder */}
          <div className="space-y-6">
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Palette className="h-5 w-5 text-accent" />
                  Mirror Interface: Avatar Selection
                </CardTitle>
                <CardDescription>Your current resonant form.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-64 h-96 bg-muted rounded-lg flex items-center justify-center mb-4 border border-dashed border-primary/30 overflow-hidden">
                  {/* Placeholder for 3D Avatar */}
                  <Image
                    src="https://placehold.co/400x600.png"
                    alt="Avatar Placeholder"
                    width={400}
                    height={600}
                    className="object-contain"
                    data-ai-hint="anime avatar"
                  />
                </div>
                <Button variant="outline" className="w-full border-accent/50 hover:bg-accent/10 hover:text-accent">
                  Customize Appearance (Conceptual)
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Real-time biometric-reactive responses and 3D anime-style avatars are part of the vision.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Controls */}
          <div className="space-y-8">
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Waves className="h-5 w-5 text-accent" />
                  Binaural Sound Channel
                </CardTitle>
                <CardDescription>Select your preferred resonance frequency.</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={soundChannel} onValueChange={setSoundChannel} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="432hz" id="r1" />
                    <Label htmlFor="r1">432Hz - Emotional Restoration</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="528hz" id="r2" />
                    <Label htmlFor="r2">528Hz - DNA Activation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="r3" disabled />
                    <Label htmlFor="r3" className="text-muted-foreground/70">Custom (Future Integration)</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <UploadCloud className="h-5 w-5 text-accent" />
                  Soulprint Signature Upload
                </CardTitle>
                <CardDescription>Upload your encrypted biometric soulprint.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-32 border-2 border-dashed border-primary/30 rounded-lg flex flex-col items-center justify-center p-4 bg-muted/30">
                  <Input type="file" id="soulprintUpload" className="hidden" onChange={handleFileChange} accept=".sig,.enc" />
                  <Button variant="ghost" onClick={() => document.getElementById('soulprintUpload')?.click()} className="text-primary hover:text-primary/80">
                    <UploadCloud className="mr-2 h-5 w-5" />
                    {soulprintFile ? `Selected: ${soulprintFile.name}` : "Choose Encrypted File"}
                  </Button>
                  {soulprintFile && <p className="text-xs text-muted-foreground mt-2">File: {soulprintFile.name}</p>}
                   <p className="text-xs text-muted-foreground mt-1 text-center">Placeholder for animated biometric input field.</p>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90" disabled={!soulprintFile}>
                  Upload & Synchronize Soulprint
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
