
"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, Bot, SlidersHorizontal, AudioLines, Construction } from "lucide-react";

export default function VoicePage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Mic className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Voice Systems & Fisk Neural Router</CardTitle>
              <CardDescription>
                Integration hub for the "Tales from the Inner Conscience" podcast, voice command interfaces, and the Fisk Neural Router v2. This system connects voice input to backend execution pipelines.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Podcast Transmission Chamber</CardTitle>
                <AudioLines className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Access and manage episodes of "Tales from the Inner Conscience." Features include frequency-tuned playback (432Hz & 528Hz) and AI audio-layered insights.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Fisk Neural Router v2</CardTitle>
                <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Configure and monitor the voice command to backend execution pipeline. Manages CipherCommand v2 inputs (voice, sigil, glyph).
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Voice AI Co-Hosting (ElevenLabs)</CardTitle>
                <Bot className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Interface for managing AI co-hosting capabilities for the podcast, utilizing ElevenLabs GMFM.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Sentient Symbol Translation</CardTitle>
                <Mic className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Access to voice-activated multilingual and metaphysical content decoding features.
                </p>
              </CardContent>
            </Card>
          </div>

           <div className="flex flex-col items-center justify-center py-12 text-center mt-8 border-t">
            <Construction className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Advanced voice interaction systems and CipherCommand v2 integrations are under development.</p>
            <p className="mt-1 text-sm">Future updates will include real-time voice-modulated world unfolding based on AI resonance decryption.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
