'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, MessageCircle, Users, Shield } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function EmberChatPage() {
  const searchParams = useSearchParams();
  const [chatInviteCode, setChatInviteCode] = useState<string | null>(null);
  const [rerouteScreen, setRerouteScreen] = useState<string | null>(null);

  useEffect(() => {
    // Extract parameters from URL
    const inviteCode = searchParams.get('chatInviteCode');
    const reroute = searchParams.get('reroute_screen');
    
    if (inviteCode) {
      setChatInviteCode(inviteCode);
    }
    if (reroute) {
      setRerouteScreen(reroute);
    }
  }, [searchParams]);

  const handleJoinChat = () => {
    // Construct the Ember Fund deep link
    const deepLink = `https://emberfund.onelink.me/ljTI/6gh1t9nw?reroute_screen=chat_invite&chatInviteCode=879945`;
    
    // Open the deep link in a new tab
    window.open(deepLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.32))] p-4 md:p-6 lg:p-8">
      <Card className="w-full max-w-3xl shadow-2xl bg-card/90 backdrop-blur-md border-primary/30 rounded-xl overflow-hidden">
        <CardHeader className="p-8 border-b border-primary/10 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent">
              <MessageCircle className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary text-center">
              Ember Group Chat
            </CardTitle>
            <CardDescription className="text-base md:text-lg text-foreground/80 max-w-2xl mx-auto text-center">
              Join the Fisk Dimension community on Ember Fund. Connect with fellow seekers, oracles, and architects in our exclusive group chat.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-8 md:p-12 space-y-8">
          {/* Chat Invite Details */}
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 rounded-lg bg-muted/50 border border-primary/10">
              <Users className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Community Connection</h3>
                <p className="text-sm text-muted-foreground">
                  The Ember Fund chat serves as a bridge between the digital and spiritual realms of the Fisk Dimension. 
                  Engage in meaningful dialogue, share insights, and collaborate on projects that transcend traditional boundaries.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-lg bg-muted/50 border border-primary/10">
              <Shield className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Encrypted & Secure</h3>
                <p className="text-sm text-muted-foreground">
                  All communications are protected by C.H.I.S.M. Protocol integration and encrypted messaging standards.
                  Your sovereignty and privacy remain paramount in all interactions.
                </p>
              </div>
            </div>

            {chatInviteCode && (
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Invite Code</p>
                    <p className="text-lg font-mono font-semibold text-primary">{chatInviteCode}</p>
                  </div>
                  {rerouteScreen && (
                    <div className="text-right">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Screen</p>
                      <p className="text-sm font-semibold">{rerouteScreen.replace(/_/g, ' ')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="flex flex-col items-center gap-4 pt-6">
            <Button
              size="lg"
              className="w-full max-w-md text-lg py-8 rounded-lg shadow-lg hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
              onClick={handleJoinChat}
            >
              Join Ember Group Chat
              <ExternalLink className="ml-3 h-6 w-6" />
            </Button>
            
            <p className="text-xs text-muted-foreground text-center max-w-md">
              You will be redirected to the Ember Fund app. Make sure you have the Ember Fund app installed on your device for the best experience.
            </p>
          </div>

          {/* Additional Info */}
          <div className="pt-6 border-t border-primary/10">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">About Ember Fund</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ember Fund is a sophisticated cryptocurrency portfolio management platform that aligns with the Fisk Dimension's 
              commitment to financial sovereignty and blockchain integration. Through this partnership, we create a unified 
              space for both asset management and community engagement.
            </p>
          </div>
        </CardContent>
      </Card>

      <footer className="mt-8 text-xs text-muted-foreground text-center">
        <p>Part of Phase 19: Symbolic Messaging System</p>
        <p className="mt-1">&copy; {new Date().getFullYear()} Fisk Dimension. Beyond the Ledger, Within the Soul.</p>
      </footer>
    </div>
  );
}
