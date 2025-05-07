"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Blocks, Search, Filter, ArrowUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge';
import type { Transaction } from '@/services/blockchain'; // Assuming type definition from service

// Mock blockchain data fetching function (replace with actual API call)
async function fetchBlockchainTransactions(page: number = 1, limit: number = 10, filters: any = {}): Promise<{transactions: Transaction[], total: number}> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const allTransactions: Transaction[] = Array.from({ length: 53 }, (_, i) => ({
    id: `tx-${1000 + i}-${Math.random().toString(36).substring(2, 8)}`,
    data: { 
      type: i % 3 === 0 ? 'revenue' : (i % 3 === 1 ? 'expense' : 'system_update'),
      amount: i % 3 !== 2 ? parseFloat((Math.random() * 10000).toFixed(2)) : undefined,
      currency: i % 3 !== 2 ? (['USD', 'EUR', 'GBP'][i % 3]) : undefined,
      description: i % 3 !== 2 ? `Transaction ${i+1}` : `System parameter change ${i+1}`,
      user: `user_${(i%5)+1}@example.com`
    },
    timestamp: Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30), // Random time in last 30 days
  })).sort((a, b) => b.timestamp - a.timestamp);

  let filtered = allTransactions;
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(tx => 
      tx.id.toLowerCase().includes(term) || 
      JSON.stringify(tx.data).toLowerCase().includes(term)
    );
  }
  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter(tx => tx.data.type === filters.type);
  }

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);
  
  return { transactions: paginated, total };
}


export default function BlockchainLogPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState<{column: keyof Transaction | 'data.type' | 'data.amount', direction: 'asc' | 'desc'}>({ column: 'timestamp', direction: 'desc'});

  const itemsPerPage = 10;

  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true);
      const { transactions: fetchedTransactions, total } = await fetchBlockchainTransactions(currentPage, itemsPerPage, { searchTerm, type: filterType });
      
      // Client-side sorting example if API doesn't support it
      let sortedTransactions = [...fetchedTransactions];
      if (sortOrder.column) {
        sortedTransactions.sort((a, b) => {
          let valA, valB;
          if (sortOrder.column === 'data.type') {
            valA = a.data.type;
            valB = b.data.type;
          } else if (sortOrder.column === 'data.amount') {
            valA = a.data.amount;
            valB = b.data.amount;
          } else {
            valA = a[sortOrder.column as keyof Transaction];
            valB = b[sortOrder.column as keyof Transaction];
          }

          if (valA === undefined && valB !== undefined) return sortOrder.direction === 'asc' ? -1 : 1;
          if (valA !== undefined && valB === undefined) return sortOrder.direction === 'asc' ? 1 : -1;
          if (valA === undefined && valB === undefined) return 0;


          if (typeof valA === 'string' && typeof valB === 'string') {
            return sortOrder.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
          }
          if (typeof valA === 'number' && typeof valB === 'number') {
            return sortOrder.direction === 'asc' ? valA - valB : valB - valA;
          }
          return 0;
        });
      }


      setTransactions(sortedTransactions);
      setTotalPages(Math.ceil(total / itemsPerPage));
      setIsLoading(false);
    };
    loadTransactions();
  }, [currentPage, searchTerm, filterType, sortOrder]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleFilterChange = (type: string) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  const handleSort = (column: keyof Transaction | 'data.type' | 'data.amount') => {
    setSortOrder(prev => ({
        column,
        direction: prev.column === column && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const renderSortIcon = (column: keyof Transaction | 'data.type' | 'data.amount') => {
    if (sortOrder.column !== column) return <ArrowUpDown className="h-3 w-3 opacity-30 group-hover:opacity-100" />;
    return sortOrder.direction === 'desc' ? '▼' : '▲';
  };


  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Blocks className="h-7 w-7 text-primary" />
                Blockchain Transaction Log
              </CardTitle>
              <CardDescription>
                An immutable and auditable trail of critical data transactions and state changes.
              </CardDescription>
            </div>
            {/* Placeholder for a "Create New Log / State Change" button if applicable */}
            {/* <Button><PlusCircle className="mr-2 h-4 w-4" /> New Entry</Button> */}
          </div>
           <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by ID, data content..." 
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange} 
              />
            </div>
            <div className="flex gap-2">
                {['all', 'revenue', 'expense', 'system_update'].map(type => (
                    <Button 
                        key={type}
                        variant={filterType === type ? "default" : "outline"}
                        onClick={() => handleFilterChange(type)}
                        className="capitalize"
                    >
                        {type.replace('_', ' ')}
                    </Button>
                ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px] cursor-pointer group" onClick={() => handleSort('id')}>
                  Transaction ID {renderSortIcon('id')}
                </TableHead>
                <TableHead className="cursor-pointer group" onClick={() => handleSort('data.type')}>
                  Type {renderSortIcon('data.type')}
                </TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right cursor-pointer group" onClick={() => handleSort('timestamp')}>
                  Timestamp {renderSortIcon('timestamp')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-32 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-mono text-xs break-all">{tx.id}</TableCell>
                    <TableCell>
                       <Badge variant={
                         tx.data.type === 'revenue' ? 'default' : 
                         tx.data.type === 'expense' ? 'destructive' : 
                         'secondary'
                       } className="capitalize">
                         {tx.data.type?.replace('_', ' ') || 'N/A'}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {tx.data.type !== 'system_update' && tx.data.amount !== undefined && (
                        <span className="font-semibold">
                          {tx.data.type === 'revenue' ? '+' : '-'}{tx.data.amount?.toLocaleString()} {tx.data.currency}
                        </span>
                      )}
                      <span className="ml-2 text-muted-foreground truncate">{tx.data.description}</span>
                      {tx.data.user && <div className="text-muted-foreground/70 text-[10px] pt-0.5">User: {tx.data.user}</div>}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {new Date(tx.timestamp).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                 <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                        No transactions found matching your criteria.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
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
                disabled={currentPage === totalPages}
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
