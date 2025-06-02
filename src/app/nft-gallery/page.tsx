
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, ZoomIn, Layers, ShieldCheck } from "lucide-react"; // Added ShieldCheck for encryption/soul-signature
import Image from 'next/image';

const mockNfts = [
  { id: "nft1", name: "Quantum Entanglement Orb", description: "A swirling orb reflecting the user's soulcode.", imageUrl: "https://placehold.co/300x400.png", dataAiHint: "abstract orb", price: "1.5 ETH", rarity: "Mythic" },
  { id: "nft2", name: "Cipher Key of Eldoria", description: "Unlocks hidden pathways within the Genesis Z Bloodline.", imageUrl: "https://placehold.co/300x400.png", dataAiHint: "ancient key", price: "0.8 ETH", rarity: "Legendary" },
  { id: "nft3", name: "Resonance Crystal Shard", description: "Amplifies frequency vibrations in the Avatar Room.", imageUrl: "https://placehold.co/300x400.png", dataAiHint: "glowing crystal", price: "0.3 ETH", rarity: "Rare" },
  { id: "nft4", name: "Symbolic Codex Fragment", description: "A piece of ancient lore, pulsating with energy.", imageUrl: "https://placehold.co/300x400.png", dataAiHint: "old scroll", price: "0.5 ETH", rarity: "Epic" },
  { id: "nft5", name: "Aetheric Weaver's Loom", description: "Used to craft new soulbound realities.", imageUrl: "https://placehold.co/300x400.png", dataAiHint: "magic loom", price: "2.2 ETH", rarity: "Mythic" },
  { id: "nft6", name: "Void Walker's Compass", description: "Navigates the spaces between dimensions.", imageUrl: "https://placehold.co/300x400.png", dataAiHint: "fantasy compass", price: "1.1 ETH", rarity: "Legendary" },
];

export default function NftGalleryPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl bg-card/80 backdrop-blur-md border-primary/20 rounded-xl overflow-hidden">
        <CardHeader className="border-b border-primary/10 p-6">
          <div className="flex items-center gap-3">
            <ImageIcon className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
                NFT Gallery of Whispers
              </CardTitle>
              <CardDescription className="text-foreground/80 mt-1">
                Explore unique, antique-grade NFT tokens encoded with encrypted soul signatures and dynamic behaviors.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          {/* Placeholder for 3D rotating art displays and glyph-triggered background shifts */}
          <div className="text-center p-4 my-6 border border-dashed border-muted-foreground/50 rounded-lg bg-muted/30">
            <Layers className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Conceptual Area: Imagine 3D Rotating Art Displays & Glyph-Triggered Backgrounds Here.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockNfts.map((nft) => (
              <Card key={nft.id} className="overflow-hidden shadow-lg hover:shadow-primary/30 transition-shadow duration-300 group bg-card/70 border-primary/10">
                <CardHeader className="p-0 relative">
                  <Image
                    src={nft.imageUrl}
                    alt={nft.name}
                    width={300}
                    height={400}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={nft.dataAiHint}
                  />
                  {/* Placeholder for Zoom-on-Hover for symbolic decrypt overlays */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ZoomIn className="h-12 w-12 text-white" />
                    <p className="text-white text-sm ml-2">Decrypt Overlay (Conceptual)</p>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors">{nft.name}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mb-2 h-10 overflow-hidden">{nft.description}</CardDescription>
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-lg font-semibold text-accent">{nft.price}</p>
                    <ShieldCheck className="h-5 w-5 text-green-500" title="Soul-Signature Encrypted" />
                  </div>
                   <Button variant="outline" className="w-full mt-4 border-primary/50 hover:bg-primary/10 hover:text-primary">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
