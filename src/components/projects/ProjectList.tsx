"use client";

import React, { useMemo, useState, useEffect } from "react";

import {
  Briefcase,
  Search,
  Filter,
  FolderPlus,
  MoreHorizontal,
  Edit2,
  Trash2,
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
import { type Project } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProjectListProps {
  projects: Project[];
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  perPage?: number;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  onAdd: () => void;
  onEdit: (project: Project) => void;
  onDelete: (appwriteProjectId: string) => void;
}

/**
 * Custom High-Quality Android SVG Icon
 */
function AndroidIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.523 15.3414C17.067 15.3414 16.697 14.9714 16.697 14.5154C16.697 14.0594 17.067 13.6894 17.523 13.6894C17.979 13.6894 18.349 14.0594 18.349 14.5154C18.349 14.9714 17.979 15.3414 17.523 15.3414ZM6.477 15.3414C6.021 15.3414 5.651 14.9714 5.651 14.5154C5.651 14.0594 6.021 13.6894 6.477 13.6894C6.933 13.6894 7.303 14.0594 7.303 14.5154C7.303 14.9714 6.933 15.3414 6.477 15.3414ZM17.885 10.5824L19.862 7.15836C19.991 6.93336 19.914 6.64536 19.689 6.51636C19.464 6.38736 19.176 6.46436 19.047 6.68936L17.03 10.1834C15.542 9.50236 13.848 9.12436 12 9.12436C10.152 9.12436 8.458 9.50236 6.97 10.1834L4.953 6.68936C4.824 6.46436 4.536 6.38736 4.311 6.51636C4.086 6.64536 4.009 6.93336 4.138 7.15836L6.115 10.5824C2.618 12.4744 0.267 16.1424 0 20.3884H24C23.733 16.1424 21.382 12.4744 17.885 10.5824Z" />
    </svg>
  );
}

/**
 * Custom High-Quality Apple SVG Icon
 */
function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.073 11.233c.015-2.228 1.83-3.295 1.914-3.344-1.037-1.516-2.651-1.722-3.226-1.746-1.373-.14-2.68.808-3.377.808-.696 0-1.787-.79-2.937-.768-1.51.022-2.903.88-3.68 2.228-1.57 2.723-.402 6.758 1.127 8.966.748 1.082 1.637 2.296 2.808 2.253 1.13-.044 1.556-.728 2.922-.728 1.365 0 1.75.728 2.943.705 1.215-.022 1.986-1.097 2.73-2.187.858-1.253 1.212-2.466 1.233-2.532-.026-.011-2.373-.91-2.407-3.655M15.147 4.707c.616-.745 1.032-1.782.918-2.812-.885.035-1.956.59-2.59 1.334-.568.657-1.066 1.716-.933 2.723.985.076 1.988-.499 2.605-1.245" />
    </svg>
  );
}

export function ProjectList({
  projects,
  loading = false,
  currentPage = 1,
  totalPages = 1,
  perPage = 10,
  onPageChange,
  onPerPageChange,
  onAdd,
  onEdit,
  onDelete,
}: ProjectListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [envFilter, setEnvFilter] = useState("all");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = project.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesEnv =
        envFilter === "all" ||
        (envFilter === "android" && project.android) ||
        (envFilter === "apple" && project.apple);
      return matchesSearch && matchesEnv;
    });
  }, [projects, searchTerm, envFilter]);

  const formatDate = (dateString: string) => {
    if (!isMounted) return dateString;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by project name..."
            className="pl-10 bg-card border-muted focus:ring-primary h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="w-full md:w-40">
            <Select value={envFilter} onValueChange={setEnvFilter}>
              <SelectTrigger className="bg-card border-muted h-11">
                <div className="flex items-center gap-2 text-xs">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Environment" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Environments</SelectItem>
                <SelectItem value="android">Android Only</SelectItem>
                <SelectItem value="apple">Apple Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={onAdd}
            className="bg-primary text-background hover:bg-primary/90 font-bold shrink-0 h-11 px-6"
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-widest font-semibold py-4">
                Project ID
              </TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-semibold">
                Project Name
              </TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-semibold">
                Owner
              </TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-semibold text-center">
                Environment
              </TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-semibold">
                Provisioned
              </TableHead>
              <TableHead className="text-right text-xs uppercase tracking-widest font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(() => {
              if (loading) {
                return (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">
                          Loading projects...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              }

              if (filteredProjects.length > 0) {
                return filteredProjects.map((project) => (
                  <TableRow
                    key={project.appwrite_project_id}
                    className="border-border hover:bg-muted/20 transition-colors group"
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {project.appwrite_project_id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Briefcase className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors text-base truncate">
                            {project.name}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono truncate">
                            {project.package_name}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-foreground truncate">
                          {project.user_name || "N/A"}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground truncate">
                            {project.user_email || ""}
                          </span>
                          {!!project.status && (
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] px-1.5 py-0 h-3.5 uppercase tracking-tighter font-bold",
                                project.status === "active"
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : "bg-red-500/10 text-red-500 border-red-500/20",
                              )}
                            >
                              {project.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-4">
                        {project.android ? (
                          <div
                            className="p-1.5 bg-secondary/10 rounded-md"
                            title="Android"
                          >
                            <AndroidIcon className="h-5 w-5 text-secondary" />
                          </div>
                        ) : null}
                        {project.apple ? (
                          <div
                            className="p-1.5 bg-primary/10 rounded-md"
                            title="Apple"
                          >
                            <AppleIcon className="h-5 w-5 text-primary" />
                          </div>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(project.created_at)}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
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
                          <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-border" />
                          <DropdownMenuItem
                            onClick={() => onEdit(project)}
                            className="cursor-pointer hover:bg-primary/10"
                          >
                            <Edit2 className="mr-2 h-4 w-4" /> Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setDeleteId(project.appwrite_project_id)
                            }
                            className="cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Remove Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ));
              }

              return (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <p className="text-muted-foreground">
                        No projects found matching your filters.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchTerm("");
                          setEnvFilter("all");
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })()}
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
                  <SelectItem key={`page-${Math.random()}`} value={String(i + 1)}>
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
                Confirm Project Removal
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to remove this project from the inventory?
              This will terminate all active provisioning and archive the
              project configuration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="border-border hover:bg-muted hover:text-foreground">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold"
            >
              Confirm Removal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
