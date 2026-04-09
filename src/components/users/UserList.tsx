"use client";

import React, { useState, useMemo, useEffect } from "react";

import {
  Search,
  UserPlus,
  MoreHorizontal,
  Edit2,
  Trash2,
  Filter,
  Mail,
  CreditCard,
  AlertTriangle,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type User, type SubscriptionTier } from "@/lib/types";

interface UserListProps {
  users: User[];
  currentPage?: number;
  totalPages?: number;
  perPage?: number;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  onAdd: () => void;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void | Promise<void>;
}

export function UserList({ users, currentPage = 1, totalPages = 1, perPage = 10, onPageChange, onPerPageChange, onAdd, onEdit, onDelete }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(user.appwrite_user_id || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || (user.status || "").toLowerCase() === statusFilter.toLowerCase();
      const matchesSubscription =
        subscriptionFilter === "all" ||
        user.subscription === subscriptionFilter;
      return matchesSearch && matchesStatus && matchesSubscription;
    });
  }, [users, searchTerm, statusFilter, subscriptionFilter]);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-secondary/20 text-secondary border-none">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge
            variant="outline"
            className="border-muted-foreground text-muted-foreground"
          >
            Inactive
          </Badge>
        );
      default:
        return <Badge>{status || "Unknown"}</Badge>;
    }
  };

  const getSubscriptionBadge = (tier: SubscriptionTier) => {
    switch (tier) {
      case "Premium":
        return (
          <Badge className="bg-primary text-background border-none font-bold">
            Premium
          </Badge>
        );
      case "Standard":
        return (
          <Badge
            variant="secondary"
            className="bg-secondary/40 text-foreground border-none"
          >
            Standard
          </Badge>
        );
      case "Basic":
        return (
          <Badge
            variant="outline"
            className="border-muted-foreground/30 text-muted-foreground"
          >
            Basic
          </Badge>
        );
      default:
        return <Badge>{tier}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!isMounted) return dateString;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      setIsDeleting(true);
      try {
        await onDelete(deleteId);
      } finally {
        setIsDeleting(false);
        setDeleteId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts by name, email or ID..."
            className="pl-10 bg-card border-muted focus:ring-primary h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="w-40">
            <Select
              value={subscriptionFilter}
              onValueChange={setSubscriptionFilter}
            >
              <SelectTrigger className="bg-card border-muted h-11">
                <div className="flex items-center gap-2 text-xs">
                  <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Plan" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={onAdd}
            className="bg-primary text-background hover:bg-primary/90 font-bold shrink-0 h-11 px-6"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            New Account
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[280px] text-xs uppercase tracking-widest font-semibold py-4">
                Account
              </TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-semibold">
                User ID
              </TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-semibold">
                Roles
              </TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-semibold">
                Subscription
              </TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-semibold">
                Joined
              </TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-semibold">
                Status
              </TableHead>
              <TableHead className="text-right text-xs uppercase tracking-widest font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.appwrite_user_id}
                  className="border-border hover:bg-muted/20 transition-colors group"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-primary/20">
                        <AvatarFallback className="bg-primary text-background font-bold text-xs">
                          {(user.name || "U")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                          {user.name || "Unknown User"}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {user.email || "No email"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-[10px] font-mono bg-muted/50 px-2 py-1 rounded text-muted-foreground group-hover:text-foreground transition-colors">
                      {user.appwrite_user_id || "N/A"}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Badge
                        key={user.role}
                        variant="secondary"
                        className="bg-primary/10 text-primary border-none text-[10px] px-1.5 py-0"
                      >
                        {user.role}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getSubscriptionBadge(user.subscription)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(user.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-right">
                    {user.role?.toLowerCase() !== "admin" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-primary/10 hover:text-primary"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-card border-border"
                        >
                          <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-border" />
                          <DropdownMenuItem
                            onClick={() => onEdit(user)}
                            className="cursor-pointer hover:bg-primary/10"
                          >
                            <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteId(String(user.appwrite_user_id))}
                            className="cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Remove Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="bg-muted p-4 rounded-full">
                      <Search className="h-8 w-8 text-muted-foreground opacity-50" />
                    </div>
                    <p className="text-muted-foreground">
                      No accounts found matching your criteria.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                        setSubscriptionFilter("all");
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border pt-4 gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Rows per page:</span>
          <Select
            value={String(perPage)}
            onValueChange={(value) => onPerPageChange && onPerPageChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={String(perPage)} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Page:</span>
            <Select
              value={String(currentPage)}
              onValueChange={(value) => onPageChange && onPageChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={String(currentPage)} />
              </SelectTrigger>
              <SelectContent side="top">
                {Array.from({ length: Math.max(1, totalPages) }).map((_, i) => (
                  <SelectItem key={`user-page-${Math.random()}`} value={String(i + 1)}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>of {Math.max(1, totalPages)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange && onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange && onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-destructive/10 rounded-full">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <AlertDialogTitle className="text-xl font-bold">
                Confirm Account Deletion
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to remove this account? This action is
              irreversible and will immediately revoke all platform access and
              project associations for the user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="border-border hover:bg-muted hover:text-foreground">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Confirm Deletion"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
