"use client"

import React, { useMemo, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { User } from '@/lib/types'
import { Briefcase, Smartphone, Search, Apple } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ProjectListProps {
  users: User[];
}

// Custom Android SVG Icon
function AndroidIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M17.5 12a5.5 5.5 0 1 0-11 0V17h11v-5z" />
      <path d="M6 17v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2" />
      <path d="M9 8l-1.5-2.5" />
      <path d="M15 8l1.5-2.5" />
      <circle cx="9" cy="13" r=".5" fill="currentColor" />
      <circle cx="15" cy="13" r=".5" fill="currentColor" />
    </svg>
  );
}

export function ProjectList({ users }: ProjectListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = useMemo(() => {
    return users.filter(user => {
      const projectName = user.project?.name || 'N/A';
      const platformName = user.platform?.name || 'N/A';
      const userId = user.id;
      
      return projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             platformName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             userId.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [users, searchTerm]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return <Badge className="bg-secondary/20 text-secondary border-none">{status}</Badge>;
      case 'Inactive': return <Badge variant="outline" className="border-muted-foreground text-muted-foreground">{status}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by project, platform or User ID..." 
            className="pl-10 bg-card border-muted focus:ring-primary h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-widest font-semibold py-4">Project Name</TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-semibold">User ID</TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-semibold">Platform Name</TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-semibold text-center">Type</TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length > 0 ? filteredProjects.map((user) => (
              <TableRow key={user.id} className="border-border hover:bg-muted/20 transition-colors group">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {user.project?.name || 'Unassigned'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-[10px] font-mono bg-muted/50 px-2 py-1 rounded text-muted-foreground group-hover:text-foreground transition-colors">
                    {user.id}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.platform?.name || 'N/A'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-3">
                    {user.platform?.platform_type.includes('android') && (
                      <AndroidIcon className="h-5 w-5 text-secondary" />
                    )}
                    {user.platform?.platform_type.includes('apple') && (
                      <Apple className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(user.status)}
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <p className="text-muted-foreground">No projects found matching your search.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
