
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Blocks, Search, ListFilter, ArrowUpDown, Copy, CalendarDays, Check, Construction } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from '@/components/ui/badge'; 
import type { Transaction as BlockchainTransaction } from '@/services/blockchain'; // Renamed to avoid conflict
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import type { DateRange } from "react-day-picker";
import { toast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/use-debounce';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ALL_TRANSACTION_TYPES = ['revenue', 'expense', 'system_update', 'data_access', 'config_change', 'user_auth', 'api_call', 'security_event', 'audit_log', 'nft_mint', 'token_transfer', 'contract_deploy', 'oracle_update']; 

// Cache mock data to avoid regenerating on every call
let cachedMockData: BlockchainTransaction[] | null = null;

function generateMockTransactions(): BlockchainTransaction[] {
  if (cachedMockData) return cachedMockData;
  
  cachedMockData = Array.from({ length: 250 }, (_, i) => { // Increased mock data
      const type = ALL_TRANSACTION_TYPES[i % ALL_TRANSACTION_TYPES.length];
      const isFinancial = type === 'revenue' || type === 'expense';
      const isSystem = ['system_update', 'config_change', 'oracle_update'].includes(type);
      const isDataAccess = type === 'data_access';
      const isUserAuth = type === 'user_auth';
      const isApiCall = type === 'api_call';
      const isSecurityEvent = type === 'security_event';
      const isAuditLog = type === 'audit_log';
      const isNftRelated = ['nft_mint'].includes(type);
      const isTokenTransfer = type === 'token_transfer';
      const isContractDeploy = type === 'contract_deploy';

      return {
        id: `tx-${i + 1}-${Date.now()}`,
        data: { 
          type,
          amount: isFinancial || isTokenTransfer ? parseFloat((Math.random() * 20000).toFixed(2)) : undefined, 
          currency: isFinancial || isTokenTransfer ? (['USD', 'ETH', 'BTC', 'FISK', 'USDC', 'DAI'][i % 6]) : undefined, 
          description: isFinancial ? `Financial Transaction ${i+1}` : 
                       `${type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} Event ${i+1}`,
          user: `user_${(i%50)+1}@fisk.dimension`, 
          details: isSystem ? { parameter: `param_sys_${i%5}`, oldValue: `${i*12}`, newValue: `${i*12 + (i%3)}`, component: `core_module_${i%2}` } :
                     isDataAccess ? { resource: `resource_id_${i%10}`, action: (['read', 'write', 'delete', 'grant_perm'][i%4]), sensitivity: (['low', 'medium', 'high'][i%3]) } :
                   isUserAuth ? { event: (['login_success', 'logout', 'password_reset_request', '2fa_verified', 'session_expired'][i%5]), ip: `172.16.${i%256}.${i%256}`, device: `device_${i%10}` } :
                   isApiCall ? { endpoint: `/api/v3/resource${i%12}`, method: (['GET', 'POST', 'PUT', 'DELETE', 'PATCH'][i%5]), status: ([200, 201, 204, 400, 401, 403, 404, 500, 503][i%9]) } :
                   isSecurityEvent ? { alert_type: (['firewall_block', 'waf_rule_triggered', 'anomaly_detected', 'rate_limit_exceeded'][i%4]), severity: (['low', 'medium', 'high', 'critical'][i%4]), source_ip: `203.0.113.${i%256}` } :
                   isAuditLog ? { entity: `document_audit_${i+200}`, action: (['viewed', 'edited', 'shared', 'deleted'][i%4]), editor: `editor_${(i%15)+1}@fisk.dimension` } :
                   isNftRelated ? { nftId: `bnp_passport_${i+1000}`, collection: 'BiometricNFTFramework', recipient: `0x${(Math.random().toString(16)+'00000000000000000').slice(2,42)}` } :
                   isTokenTransfer ? { from: `0x${(Math.random().toString(16)+'00000000000000000').slice(2,42)}`, to: `0x${(Math.random().toString(16)+'00000000000000000').slice(2,42)}`, token: (['FISK', 'ETH', 'USDC'][i%3]) } :
                   isContractDeploy ? { contractName: `Phase${i%25+1}Governance`, gasUsed: Math.floor(Math.random()*500000)+100000, version: `v1.${i%3}.${i%5}` } :
                    { notes: 'Standard operational data log entry' }
        },
        timestamp: Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 180), // Up to 180 days
        blockNumber: 500000 + i, 
        confirmations: Math.floor(Math.random() * 200) + 6, 
      };
    });
  
  return cachedMockData;
}

// Mock blockchain data fetching function
async function fetchBlockchainTransactions(page: number = 1, limit: number = 10, filters: any = {}): Promise<{transactions: BlockchainTransaction[], total: number}> {
  await new Promise(resolve => setTimeout(resolve, 750)); 
  
  const allTransactions = generateMockTransactions();

  let filteredTransactions = allTransactions;

  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filteredTransactions = filteredTransactions.filter(tx => 
      tx.id.toLowerCase().includes(term) ||
      tx.data.type.toLowerCase().includes(term) ||
      (tx.data.description && tx.data.description.toLowerCase().includes(term)) ||
      (tx.data.user && tx.data.user.toLowerCase().includes(term)) ||
      (tx.data.currency && tx.data.currency.toLowerCase().includes(term)) ||
      (tx.data.details && Object.values(tx.data.details).some(val => String(val).toLowerCase().includes(term)))
    );
  }

  if (filters.types && filters.types.length > 0) {
    filteredTransactions = filteredTransactions.filter(tx => filters.types.includes(tx.data.type));
  }

  if (filters.dateRange?.from && filters.dateRange?.to) {
    filteredTransactions = filteredTransactions.filter(tx => {
      const txDate = new Date(tx.timestamp);
      return txDate >= filters.dateRange.from && txDate <= filters.dateRange.to;
    });
  }

  const total = filteredTransactions.length;
  const paginatedTransactions = filteredTransactions.slice((page - 1) * limit, page * limit);
  
  return { transactions: paginatedTransactions, total };
}

export default function ChainLogPage() {
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  
  const itemsPerPage = 20;
  
  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    const filters = { 
      searchTerm: debouncedSearchTerm, 
      types: selectedTypes,
      dateRange
    };
    const { transactions: fetchedTransactions, total } = await fetchBlockchainTransactions(currentPage, itemsPerPage, filters);
    setTransactions(fetchedTransactions);
    setTotalPages(Math.ceil(total / itemsPerPage));
    setIsLoading(false);
  }, [currentPage, debouncedSearchTerm, selectedTypes, dateRange, itemsPerPage]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); 
  };

  const handleTypeToggle = useCallback((type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  }, []);

  const handleCopyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Copied to clipboard!", description: text.substring(0,50) + "..." });
    }).catch(err => {
      toast({ variant: "destructive", title: "Failed to copy", description: "Could not copy text to clipboard." });
    });
  }, []);

  const getBadgeVariantForType = useCallback((type: string) => {
    if (['revenue', 'token_transfer'].includes(type)) return 'default';
    if (['expense', 'security_event'].includes(type)) return 'destructive';
    if (['system_update', 'config_change', 'contract_deploy', 'oracle_update'].includes(type)) return 'secondary';
    if (['nft_mint'].includes(type)) return 'outline'; // Consider a specific color for NFTs
    return 'outline';
  }, []);

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Blocks className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">
                  Inter-Chain Transaction Log
                </CardTitle>
                <CardDescription>
                  Immutable audit trail of all critical data transactions, system events, smart contract interactions, and state changes across integrated blockchain networks (zkSync, Linea, StarkNet, Etherlink, etc.).
                </CardDescription>
              </div>
            </div>
             <Button variant="outline" onClick={loadTransactions} disabled={isLoading}>
              <ArrowUpDown className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Log ({isLoading ? 'Loading...' : 'Live'})
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by ID, type, description, user, currency, details..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 w-full"
              />
            </div>
            <div className="flex gap-2 items-center flex-wrap">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex-shrink-0">
                            <ListFilter className="mr-2 h-4 w-4" />
                            Tx Types ({selectedTypes.length > 0 ? selectedTypes.length : 'All'})
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="max-h-96 overflow-y-auto"> {/* Increased max-h */}
                        <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {ALL_TRANSACTION_TYPES.map(type => (
                            <DropdownMenuCheckboxItem
                                key={type}
                                checked={selectedTypes.includes(type)}
                                onCheckedChange={() => handleTypeToggle(type)}
                                className="capitalize"
                            >
                                {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <DatePickerWithRange date={dateRange} setDate={(range) => { setDateRange(range); setCurrentPage(1); }} />
            </div>
          </div>

          {isLoading ? (
            Array.from({ length: itemsPerPage }).map((_, i) => (
              <Skeleton key={`skel-${i}`} className="h-20 w-full mb-2 rounded-md" /> // Increased height
            ))
          ) : transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Tx ID / Block</TableHead><TableHead>Type</TableHead><TableHead>Primary Details</TableHead><TableHead className="w-[250px]">Additional Info</TableHead><TableHead className="text-right w-[180px]">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-muted/50 transition-colors text-xs">
                    <TableCell>
                      <div className="font-medium text-xs flex items-center">
                        {tx.id.substring(0, 15)}...
                        <Button variant="ghost" size="icon" className="h-5 w-5 ml-1" onClick={() => handleCopyToClipboard(tx.id)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">Block: {tx.blockNumber} ({tx.confirmations} confs)</div>
                    </TableCell><TableCell>
                      <Badge variant={getBadgeVariantForType(tx.data.type)} className="capitalize text-[10px] py-0.5 px-1.5 leading-tight"> 
                       {tx.data.type?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'N/A'}
                      </Badge>
                    </TableCell><TableCell className="max-w-xs"> {/* max-w added */}
                      <p className="truncate font-medium" title={tx.data.description}>{tx.data.description}</p>
                      {tx.data.amount && <p className="text-muted-foreground">Amount: {tx.data.currency} {tx.data.amount.toFixed(2)}</p>}
                      {tx.data.user && <p className="text-muted-foreground">User: {tx.data.user}</p>}
                    </TableCell><TableCell className="text-muted-foreground max-w-md"> {/* New Cell, max-w added */}
                      {tx.data.details && Object.entries(tx.data.details).slice(0,2).map(([key, value]) => ( // Show first 2 details
                        <div key={key} className="truncate" title={`${key}: ${value}`}>
                          <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span> {String(value).substring(0,30)}{String(value).length > 30 ? '...' : ''}
                        </div>
                      ))}
                    </TableCell><TableCell className="text-right text-muted-foreground">
                      <div className="flex items-center justify-end gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {new Date(tx.timestamp).toLocaleString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <Construction className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions found matching your criteria.</p>
              <p className="text-xs mt-1">Try adjusting your search or filters.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4 mt-4 border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || isLoading}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

