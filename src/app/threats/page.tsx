"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, AlertTriangle, Info, CheckCircle, RotateCcw, ListFilter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Threat } from '@/services/threat-detection'; 

// Extended Threat type for local state
interface DisplayThreat extends Threat {
  status: 'new' | 'investigating' | 'resolved';
  details: string;
}

// Mock threat detection data fetching
async function fetchThreats(filters: { severities: string[], statuses: string[] }): Promise<DisplayThreat[]> {
  await new Promise(resolve => setTimeout(resolve, 1200)); 
  const allThreats: DisplayThreat[] = [
    { id: 'threat-001', type: 'SQL Injection Attempt', severity: 'High', timestamp: Date.now() - 3600000, status: 'new', details: 'Detected on login endpoint from IP 192.168.1.100. Payload: OR 1=1' },
    { id: 'threat-002', type: 'Unusual Data Modification', severity: 'Medium', timestamp: Date.now() - 7200000, status: 'investigating', details: 'User account "admin" modified critical financial data outside business hours.' },
    { id: 'threat-003', type: 'Failed Login Spike', severity: 'Low', timestamp: Date.now() - 10800000, status: 'resolved', details: 'Multiple failed login attempts for user "guest". Blocked IP for 24h.' },
    { id: 'threat-004', type: 'Cross-Site Scripting (XSS)', severity: 'High', timestamp: Date.now() - 86400000, status: 'new', details: 'Potential XSS in user profile comments section. Input: <script>alert(1)</script>' },
    { id: 'threat-005', type: 'Anomalous Network Traffic', severity: 'Medium', timestamp: Date.now() - 172800000, status: 'investigating', details: 'Unusual outbound traffic to unknown C&C server from internal host 10.0.5.23.' },
    { id: 'threat-006', type: 'Data Exfiltration Pattern', severity: 'Critical', timestamp: Date.now() - 600000, status: 'new', details: 'Large volume of sensitive data being transferred from database server to external IP.' },
    { id: 'threat-007', type: 'Privilege Escalation Attempt', severity: 'High', timestamp: Date.now() - 2400000, status: 'investigating', details: 'User "support_agent" attempted to access admin-only functions.' },
  ];
  
  let filteredThreats = allThreats;
  if (filters.severities.length > 0) {
    filteredThreats = filteredThreats.filter(t => filters.severities.includes(t.severity.toLowerCase()));
  }
   if (filters.statuses.length > 0) {
    filteredThreats = filteredThreats.filter(t => filters.statuses.includes(t.status));
  }

  return filteredThreats.sort((a, b) => b.timestamp - a.timestamp);
}


export default function ThreatsPage() {
  const [threats, setThreats] = useState<DisplayThreat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedThreat, setSelectedThreat] = useState<DisplayThreat | null>(null);

  const [severityFilter, setSeverityFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const loadThreats = useCallback(async () => {
    setIsLoading(true);
    const fetchedThreats = await fetchThreats({ severities: severityFilter, statuses: statusFilter });
    setThreats(fetchedThreats);
    setIsLoading(false);
    if (fetchedThreats.length > 0 && !selectedThreat) {
      setSelectedThreat(fetchedThreats[0]);
    } else if (fetchedThreats.length === 0) {
      setSelectedThreat(null);
    }
  }, [severityFilter, statusFilter, selectedThreat]);


  useEffect(() => {
    loadThreats();
  }, [loadThreats]); // Removed severityFilter and statusFilter to rely on useCallback dependency

  const getSeverityBadgeVariant = (severity: string): "destructive" | "default" | "secondary" | "outline" => {
    switch (severity.toLowerCase()) {
      case 'critical': return "destructive";
      case 'high': return "destructive";
      case 'medium': return "default"; 
      case 'low': return "secondary";
      default: return "outline";
    }
  };
  
  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return <ShieldAlert className="h-5 w-5 text-red-400" />;
      case 'high': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium': return <Info className="h-5 w-5 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-5 w-5 text-green-500" />; 
      default: return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const handleThreatSelect = (threat: DisplayThreat) => {
    setSelectedThreat(threat);
  };
  
  const updateThreatStatus = (threatId: string, newStatus: 'new' | 'investigating' | 'resolved') => {
    setThreats(prevThreats => 
      prevThreats.map(t => t.id === threatId ? { ...t, status: newStatus } : t)
    );
    if (selectedThreat && selectedThreat.id === threatId) {
      setSelectedThreat(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };


  return (
    <div className="container mx-auto py-8">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <ShieldAlert className="h-7 w-7 text-primary" />
                    AI Threat Detection Alerts
                  </CardTitle>
                  <CardDescription>
                    Real-time monitoring and analysis of potential security threats and manipulation attempts.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={loadThreats} disabled={isLoading}>
                    <RotateCcw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <ListFilter className="mr-2 h-4 w-4" /> Filters
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by Severity</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {['Critical', 'High', 'Medium', 'Low'].map((sev) => (
                        <DropdownMenuCheckboxItem
                          key={sev}
                          checked={severityFilter.includes(sev.toLowerCase())}
                          onCheckedChange={(checked) => {
                            setSeverityFilter(prev => 
                              checked ? [...prev, sev.toLowerCase()] : prev.filter(s => s !== sev.toLowerCase())
                            );
                          }}
                        >
                          {sev}
                        </DropdownMenuCheckboxItem>
                      ))}
                      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                       {['new', 'investigating', 'resolved'].map((stat) => (
                        <DropdownMenuCheckboxItem
                          key={stat}
                          checked={statusFilter.includes(stat)}
                          onCheckedChange={(checked) => {
                            setStatusFilter(prev => 
                              checked ? [...prev, stat] : prev.filter(s => s !== stat)
                            );
                          }}
                        >
                          {stat.charAt(0).toUpperCase() + stat.slice(1)}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Severity</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={`skeleton-threat-${index}`}>
                        <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-5 w-32 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : threats.length > 0 ? (
                    threats.map((threat) => (
                      <TableRow 
                        key={threat.id} 
                        onClick={() => handleThreatSelect(threat)}
                        className={`cursor-pointer hover:bg-muted/50 transition-colors ${selectedThreat?.id === threat.id ? 'bg-muted' : ''}`}
                      >
                        <TableCell className="flex justify-center items-center h-full pt-3">
                          {getSeverityIcon(threat.severity)}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{threat.type}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            threat.status === 'new' ? 'default' : 
                            threat.status === 'investigating' ? 'outline' : 
                            'secondary' // resolved
                          } className="capitalize text-xs">
                            {threat.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {new Date(threat.timestamp).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                          No threats found matching your criteria, or all systems clear!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="shadow-xl sticky top-20"> {/* top-20 to account for header */}
            <CardHeader>
              <CardTitle>Threat Details</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[400px]">
              {selectedThreat ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {getSeverityIcon(selectedThreat.severity)}
                      {selectedThreat.type}
                    </h3>
                    <Badge variant={getSeverityBadgeVariant(selectedThreat.severity)} className="mt-1">
                      Severity: {selectedThreat.severity}
                    </Badge>
                     <Badge variant={
                        selectedThreat.status === 'new' ? 'default' : 
                        selectedThreat.status === 'investigating' ? 'outline' : 
                        'secondary'
                      } className="mt-1 ml-2 capitalize text-xs">
                        Status: {selectedThreat.status}
                      </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Timestamp:</strong> {new Date(selectedThreat.timestamp).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>ID:</strong> <span className="font-mono text-xs">{selectedThreat.id}</span>
                  </p>
                  <div>
                    <h4 className="font-medium mb-1">Details:</h4>
                    <p className="text-sm bg-muted/50 p-3 rounded-md whitespace-pre-wrap">{selectedThreat.details}</p>
                  </div>
                   <div className="pt-4">
                      <h4 className="font-medium mb-2">Actions:</h4>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateThreatStatus(selectedThreat.id, 'investigating')} disabled={selectedThreat.status === 'investigating'}>Mark as Investigating</Button>
                        <Button size="sm" variant="outline" onClick={() => updateThreatStatus(selectedThreat.id, 'resolved')} disabled={selectedThreat.status === 'resolved'}>Mark as Resolved</Button>
                      </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <ShieldAlert className="h-12 w-12 mb-4 opacity-50" />
                  <p>Select a threat from the list to view details.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
