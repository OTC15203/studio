"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Blocks, Search, ListFilter, ArrowUpDown, Copy, CalendarDays, Check } from "lucide-react"; // Changed Filter to ListFilter
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from '@/components/ui/badge'; 
import type { Transaction } from '@/services/blockchain'; 
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import type { DateRange } from "react-day-picker";
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ALL_TRANSACTION_TYPES = ['revenue', 'expense', 'system_update', 'data_access', 'config_change', 'user_auth', 'api_call', 'security_event', 'audit_log']; 

// Mock blockchain data fetching function
async function fetchBlockchainTransactions(page: number = 1, limit: number = 10, filters: any = {}): Promise<{transactions: Transaction[], total: number}> {
  await new Promise(resolve => setTimeout(resolve, 750)); 
  
  const allTransactions: Transaction[] = Array.from({ length: 153 }, (_, i) => { 
      const type = ALL_TRANSACTION_TYPES[i % ALL_TRANSACTION_TYPES.length];
      const isFinancial = type === 'revenue' || type === 'expense';
      const isSystem = type === 'system_update' || type === 'config_change';
      const isDataAccess = type === 'data_access';
      const isUserAuth = type === 'user_auth';
      const isApiCall = type === 'api_call';
      const isSecurityEvent = type === 'security_event';
      const isAuditLog = type === 'audit_log';


      return {
        id: `tx-${i + 1}-${Date.now()}`,
        data: { 
          type,
          amount: isFinancial ? parseFloat((Math.random() * 15000).toFixed(2)) : undefined, 
          currency: isFinancial ? (['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'][i % 7]) : undefined, 
          description: isFinancial ? `Financial Transaction ${i+1}` : 
                       `${type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)} Event ${i+1}`,
          user: `user_${(i%20)+1}@example.com`, 
          details: isSystem ? { parameter: `param_${i%3}`, oldValue: `${i*10}`, newValue: `${i*10 + 5}` } :
                     isDataAccess ? { resource: `db_table_${i%4}`, action: (i%2 === 0 ? 'read' : 'write'), count: (i+1)*5 } :
                   isUserAuth ? { event: (i%3 === 0 ? 'login_success' : (i%3 === 1 ? 'logout' : 'password_reset_request')), ip: `192.168.${i%256}.${i%256}` } :
                   isApiCall ? { endpoint: `/api/v2/resource${i%8}`, method: (['GET', 'POST', 'PUT', 'DELETE'][i%4]), status: ([200, 201, 400, 401, 403, 404, 500][i%7]) } :
                   isSecurityEvent ? { alert_type: 'firewall_block', severity: (['low', 'medium', 'high'][i%3]), source_ip: `203.0.113.${i%256}` } :
                   isAuditLog ? { entity: `document_${i+100}`, action: 'viewed', editor: `editor_${(i%7)+1}@example.com` } :
                    { notes: 'Standard operational procedure' }
        },
        timestamp: Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 90), 
        blockNumber: 10000 + i, 
        confirmations: Math.floor(Math.random() * 100) + 1, 
      };
    });

  let filteredTransactions = allTransactions;

  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filteredTransactions = filteredTransactions.filter(tx => 
      tx.id.toLowerCase().includes(term) ||
      tx.data.type.toLowerCase().includes(term) ||
      (tx.data.description && tx.data.description.toLowerCase().includes(term)) ||
      (tx.data.user && tx.data.user.toLowerCase().includes(term))
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

export default function BlockchainLogPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  
  const itemsPerPage = 15; 

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    const filters = { 
      searchTerm, 
      types: selectedTypes,
      dateRange
    };
    const { transactions: fetchedTransactions, total } = await fetchBlockchainTransactions(currentPage, itemsPerPage, filters);
    setTransactions(fetchedTransactions);
    setTotalPages(Math.ceil(total / itemsPerPage));
    setIsLoading(false);
  }, [currentPage, searchTerm, selectedTypes, dateRange]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); 
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Copied to clipboard!", description: text });
    }).catch(err => {
      toast({ variant: "destructive", title: "Failed to copy", description: "Could not copy text to clipboard." });
    });
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Blocks className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">
                  Blockchain Transaction Log
                </CardTitle>
                <CardDescription>
                  An immutable, auditable, and comprehensive trail of all critical data transactions, system events, security alerts, and state changes across the platform.
                </CardDescription>
              </div>
            </div>
             <Button variant="outline" onClick={loadTransactions} disabled={isLoading}>
              <ArrowUpDown className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Log
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by ID, type, description, user..."
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
                            Transaction Types ({selectedTypes.length > 0 ? selectedTypes.length : 'All'})
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
                        <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {ALL_TRANSACTION_TYPES.map(type => (
                            <DropdownMenuCheckboxItem
                                key={type}
                                checked={selectedTypes.includes(type)}
                                onCheckedChange={() => handleTypeToggle(type)}
                                className="capitalize"
                            >
                                {type.replace('_', ' ')}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <DatePickerWithRange date={dateRange} setDate={(range) => { setDateRange(range); setCurrentPage(1); }} />
            </div>
          </div>

          {isLoading ? (
            Array.from({ length: itemsPerPage }).map((_, i) => (
              <Skeleton key={`skel-${i}`} className="h-16 w-full mb-2 rounded-md" />
            ))
          ) : transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Tx ID / Block</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="font-medium text-sm flex items-center">
                        {tx.id.substring(0, 12)}...
                        <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={() => handleCopyToClipboard(tx.id)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">Block: {tx.blockNumber} ({tx.confirmations} confs)</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                       tx.data.type === 'revenue' ? 'default' : 
                       tx.data.type === 'expense' ? 'destructive' : 
                       tx.data.type === 'system_update' || tx.data.type === 'config_change' ? 'secondary' :
                       tx.data.type === 'user_auth' || tx.data.type === 'api_call' || tx.data.type === 'security_event' || tx.data.type === 'audit_log' ? 'outline' : 
                       'outline' 
                      } className="capitalize text-xs py-0.5 px-1.5"> 
                       {tx.data.type?.replace('_', ' ') || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      <p className="truncate max-w-md" title={tx.data.description}>{tx.data.description}</p>
                      {tx.data.amount && <p className="text-muted-foreground">Amount: {tx.data.currency} {tx.data.amount.toFixed(2)}</p>}
                      {tx.data.user && <p className="text-muted-foreground">User: {tx.data.user}</p>}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
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
              <Blocks className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions found matching your criteria.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
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
