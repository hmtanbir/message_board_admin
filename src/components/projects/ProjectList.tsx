"use client"

import React, { useMemo, useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Project } from '@/lib/types'
import { Briefcase, Search, FolderPlus, MoreHorizontal, Edit2, Trash2, AlertTriangle, Calendar, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

interface ProjectListProps {
  projects: Project[];
  loading?: boolean;
  onAdd: () => void;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
}

export function ProjectList({ projects, loading, onAdd, onEdit, onDelete }: ProjectListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const projectName = project.name || 'N/A';
      const projectId = project.appwrite_project_id || '';
      
      const matchesSearch = 
        projectName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        projectId.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [projects, searchTerm]);

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
        <span className="ml-3 text-muted-foreground font-medium">Loading projects...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by project name or ID..." 
            className="pl-10 bg-card border-muted focus:ring-primary h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Button onClick={onAdd} className="bg-primary text-background hover:bg-primary/90 font-bold shrink-0 h-11 px-6">
            <FolderPlus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-widest font-semibold py-4">Project Name</TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-semibold">Appwrite ID</TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-semibold">User Email</TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-semibold">Provisioned</TableHead>
              <TableHead className="text-right text-xs uppercase tracking-widest font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length > 0 ? filteredProjects.map((project) => (
              <TableRow key={project.id} className="border-border hover:bg-muted/20 transition-colors group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Briefcase className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-bold text-foreground group-hover:text-primary transition-colors text-base">
                      {project.name || 'Unassigned'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-[10px] font-mono bg-muted/50 px-2 py-1 rounded text-muted-foreground group-hover:text-foreground transition-colors border border-border/50">
                    {project.appwrite_project_id || '-'}
                  </code>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{project.user_email || 'N/A'}</span>
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
                      <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem onClick={() => onEdit(project)} className="cursor-pointer hover:bg-primary/10">
                        <Edit2 className="mr-2 h-4 w-4" /> Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeleteId(project.id)} 
                        className="cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Remove Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    {projects.length === 0 && !searchTerm ? (
                      <>
                        <div className="bg-muted p-4 rounded-full mb-2">
                          <FolderPlus className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                        <p className="text-muted-foreground font-semibold">No data found in the table.</p>
                        <p className="text-sm text-muted-foreground/70">Create a new project to get started.</p>
                        <Button variant="outline" className="mt-2" onClick={onAdd}>
                          Add Project
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="bg-muted p-4 rounded-full mb-2">
                          <Search className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                        <p className="text-muted-foreground font-semibold">No projects match your search.</p>
                        <Button variant="outline" className="mt-2" onClick={() => setSearchTerm('')}>
                          Clear Search
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
              <AlertDialogTitle className="text-xl font-bold">Confirm Project Removal</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to remove this project from the inventory? This will terminate all active provisioning and archive the project configuration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="border-border hover:bg-muted hover:text-foreground">Cancel</AlertDialogCancel>
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
  )
}
