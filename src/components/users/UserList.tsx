"use client"

import React, { useState, useMemo, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Account } from '@/lib/types'
import { Search, UserPlus, MoreHorizontal, Edit2, Trash2, Filter, Mail, AlertTriangle, Calendar, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UserListProps {
  accounts: Account[];
  loading?: boolean;
  onAdd: () => void;
  onEdit: (account: Account) => void;
  onDelete: (id: number) => void;
}

export function UserList({ accounts, loading, onAdd, onEdit, onDelete }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredAccounts = useMemo(() => {
    return accounts.filter(account => {
      const name = account.name || '';
      const email = account.email || '';
      const idStr = String(account.id);
      const appwriteId = account.appwrite_user_id || '';

      const matchesSearch = 
        name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idStr.includes(searchTerm.toLowerCase()) || 
        appwriteId.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [accounts, searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return <Badge className="bg-secondary/20 text-secondary border-none">Active</Badge>;
      case 'inactive': return <Badge variant="outline" className="border-muted-foreground text-muted-foreground">Inactive</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!isMounted || !dateString) return dateString;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-card rounded-xl border border-border shadow-2xl">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground font-medium">Loading accounts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search accounts by name, email or Appwrite ID..." 
            className="pl-10 bg-card border-muted focus:ring-primary h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-card border-muted h-11">
                <div className="flex items-center gap-2 text-xs">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={onAdd} className="bg-primary text-background hover:bg-primary/90 font-bold shrink-0 h-11 px-6">
            <UserPlus className="mr-2 h-4 w-4" />
            New Account
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[280px] text-xs uppercase tracking-widest font-semibold py-4">Account</TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-semibold">User ID</TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-semibold">Role</TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-semibold">Phone</TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-semibold">Joined</TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-semibold">Status</TableHead>
              <TableHead className="text-right text-xs uppercase tracking-widest font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccounts.length > 0 ? filteredAccounts.map((account) => (
              <TableRow key={account.id} className="border-border hover:bg-muted/20 transition-colors group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-primary/20">
                      <AvatarFallback className="bg-primary text-background font-bold text-xs">
                        {account.name ? account.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm group-hover:text-primary transition-colors">{account.name || 'Unknown'}</span>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {account.email || 'N/A'}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-[10px] font-mono bg-muted/50 px-2 py-1 rounded text-muted-foreground group-hover:text-foreground transition-colors border border-border/50">
                    {account.appwrite_user_id || `DB-${account.id}`}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] px-1.5 py-0 capitalize">
                    {account.role || 'User'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-xs">{account.phone || '-'}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(account.created_at)}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(account.status)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem onClick={() => onEdit(account)} className="cursor-pointer hover:bg-primary/10">
                        <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeleteId(account.id)} 
                        className="cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Remove Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    {accounts.length === 0 && !searchTerm ? (
                      <>
                        <div className="bg-muted p-4 rounded-full mb-2">
                          <UserPlus className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                        <p className="text-muted-foreground font-semibold">No data found in the table.</p>
                        <p className="text-sm text-muted-foreground/70">Create a new account to get started.</p>
                        <Button variant="outline" className="mt-2" onClick={onAdd}>
                          Add Account
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="bg-muted p-4 rounded-full">
                          <Search className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                        <p className="text-muted-foreground font-semibold">No accounts found matching your criteria.</p>
                        <Button variant="outline" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}>
                          Reset Filters
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-destructive/10 rounded-full">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <AlertDialogTitle className="text-xl font-bold">Confirm Account Deletion</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to remove this account? This action is irreversible and will immediately revoke all platform access and project associations for the user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="border-border hover:bg-muted hover:text-foreground">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold"
            >
              Confirm Deletion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
