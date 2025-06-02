
"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Network, Zap, Milestone, Users, Edit3, Palette, Settings2, BotMessageSquare, BarChartBig, Aperture, MessageSquareHeart, Waves, Landmark, GitFork, AudioLines, BadgeCent, PackageOpen, UserSquare2, Film, UsersRound, WalletCards, Microscope, Link2, DraftingCompass, BookOpen, Repeat, Telescope } from "lucide-react";

const phases = [
  { title: "Phase 1: Vision & Philosophical Design", purpose: "Define spiritual, symbolic, and experiential architecture.", function: "Craft the meta-framework for meaning and intention.", icon: Aperture },
  { title: "Phase 2: NFT Crafting & Symbol Encoding", purpose: "Design 20 unique one-of-a-kind Fisk Dimension NFTs.", function: "Create antique encrypted icons with soulcode.", icon: Palette },
  { title: "Phase 3: Lore Engineering: Genesis Z Bloodline", purpose: "Construct mythos connecting KingFISK to Bitcoin lineage.", function: "Author symbolic narrative, glyphs, AI-narrated modules.", icon: BookOpen },
  { title: "Phase 4: Frequency Calibration (432/528 Hz Engine)", purpose: "Embed healing and consciousness-enhancing frequencies.", function: "Tune sonic layers across NFTs, podcast, AI.", icon: Waves },
  { title: "Phase 5: Domain Sovereignty Layer", purpose: "Anchor symbolic identity across ENS, Unstoppable, NES.", function: "Domains as keys, badges, and routing tokens.", icon: Landmark },
  { title: "Phase 6: UX Interface: Multidimensional Grid Mapping", purpose: "Build portal interface to navigate the platform.", function: "Design the immersive symbolic user journey map.", icon: DraftingCompass },
  { title: "Phase 7: Lightning Micropayment Integration", purpose: "Enable sovereign payment rails in meaningful space.", function: "Layer Lightning Network across symbolic triggers.", icon: Zap },
  { title: "Phase 8: Podcast Delivery System", purpose: "Channel audio lore through symbolic resonance.", function: "Deliver time-locked, AI-analyzed sonic content.", icon: AudioLines },
  { title: "Phase 9: Soulbound Badge Creation Engine", purpose: "Track spiritual and interactive progression.", function: "Issue immutable identity badges based on journey.", icon: BadgeCent },
  { title: "Phase 10: Mystery Box Configuration Protocol", purpose: "Personalize user onboarding with symbolic resonance.", function: "AI-determined care pack with encrypted elements.", icon: PackageOpen },
  { title: "Phase 11: Avatar Personalization Module", purpose: "Build anime-style avatar reflecting user soulstate.", function: "Visual/voice AI interface responding to biometric input.", icon: UserSquare2 },
  { title: "Phase 12: AI-Led Cinematic Initiation", purpose: "Introduce new users to platform via immersive AI journey.", function: "Render cinematic sequence aligned with vibration score.", icon: Film },
  { title: "Phase 13: Role Tier Logic & Governance Mapping", purpose: "Define role transitions and symbolic responsibilities.", function: "Create the Seeker → Cipher → Oracle → Architect → RoundTable path.", icon: UsersRound },
  { title: "Phase 14: Milestone Display & Resonance Tracking", purpose: "Show users their journey, achievements, and frequency shifts.", function: "Visual dashboard with progression and symbolic triggers.", icon: BarChartBig },
  { title: "Phase 15: Round Table Assembly Mechanism", purpose: "Form 15-seat DAO governance council.", function: "Allocate seats, assign voting logic, and avatar representation.", icon: Users },
  { title: "Phase 16: Royalty Distribution Logic", purpose: "Reward contributions with a capped 20% royalty system.", function: "Auto-allocate flows based on soulpath and value.", icon: WalletCards },
  { title: "Phase 17: Vibration-Based Engagement Tracker", purpose: "Monitor user frequency and symbolic engagement.", function: "Score interactions and suggest resonance upgrades.", icon: Microscope },
  { title: "Phase 18: Inter-Platform Link Bridge", purpose: "Connect external realms (fashion, gallery, theater).", function: "Create portals to outside collaborations via NFTs and podcasts.", icon: Link2 },
  { title: "Phase 19: Symbolic Messaging System", purpose: "Allow encrypted, symbolic dialogue between users.", function: "Build message engine that uses glyphs and soulcodes.", icon: MessageSquareHeart },
  { title: "Phase 20: Feedback Engine (Vibration & Symbolism)", purpose: "Provide responsive feedback based on energy/symbol use.", function: "Trigger AI affirmations or messages based on input.", icon: BotMessageSquare },
  { title: "Phase 21: Art-Sound Synesthetic Integration", purpose: "Link visuals and sound into spiritual triggers.", function: "Craft moments where image + sound = symbolic unlock.", icon: Settings2 },
  { title: "Phase 22: On/Off-Chain Legacy Preservation", purpose: "Secure history, contribution, and resonance for future generations.", function: "Preserve assets and stories across chain and archive.", icon: Edit3 },
  { title: "Phase 23: DAO Transition Blueprint", purpose: "Set platform on path to autonomous symbolic DAO.", function: "Create self-governing logic and decentralized proposals.", icon: GitFork },
  { title: "Phase 24: Evolution Audit & Update Portal", purpose: "Enable upgrades, reflections, and long-term audits.", function: "Track evolution, user feedback, and meta-phase shifts.", icon: Telescope },
  { title: "Phase 25: Recursive Intelligence Uplink", purpose: "Focuses on self-replicating data integrity models and interdimensional API bridges.", function: "Enable self-sustaining AI logic and cross-dimensional data flow.", icon: Repeat }
];


export default function PhaseMapPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Network className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Project Phase Map</CardTitle>
              <CardDescription>Visualizing the 25-phase master structure of Fisk Dimension. Each phase outlines key objectives and functions within the ecosystem.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {phases.map((phase, index) => (
              <AccordionItem value={`item-${index + 1}`} key={index}>
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <phase.icon className="h-5 w-5 text-primary/80" />
                    <span className="font-semibold">{phase.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground mb-1"><strong>Purpose:</strong> {phase.purpose}</p>
                  <p className="text-sm text-muted-foreground"><strong>Primary Function:</strong> {phase.function}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
