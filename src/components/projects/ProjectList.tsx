"use client"

import React, { useMemo, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { User } from '@/lib/types'
import { Briefcase, Smartphone, Search, MonitorSmartphone } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ProjectListProps {
  users: User[];
}

/**
 * Custom High-Quality Android SVG Icon
 */
function AndroidIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M17.523 15.3414C17.067 15.3414 16.697 14.9714 16.697 14.5154C16.697 14.0594 17.067 13.6894 17.523 13.6894C17.979 13.6894 18.349 14.0594 18.349 14.5154C18.349 14.9714 17.979 15.3414 17.523 15.3414ZM6.477 15.3414C6.021 15.3414 5.651 14.9714 5.651 14.5154C5.651 14.0594 6.021 13.6894 6.477 13.6894C6.933 13.6894 7.303 14.0594 7.303 14.5154C7.303 14.9714 6.933 15.3414 6.477 15.3414ZM17.885 10.5824L19.862 7.15836C19.991 6.93336 19.914 6.64536 19.689 6.51636C19.464 6.38736 19.176 6.46436 19.047 6.68936L17.03 10.1834C15.542 9.50236 13.848 9.12436 12 9.12436C10.152 9.12436 8.458 9.50236 6.97 10.1834L4.953 6.68936C4.824 6.46436 4.536 6.38736 4.311 6.51636C4.086 6.64536 4.009 6.93336 4.138 7.15836L6.115 10.5824C2.618 12.4744 0.267 16.1424 0 20.3884H24C23.733 16.1424 21.382 12.4744 17.885 10.5824Z" />
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
              <TableHead className="text-xs uppercase tracking-widest font-semibold text-center">Environment</TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length > 0 ? filteredProjects.map((user) => (
              <TableRow key={user.id} className="border-border hover:bg-muted/20 transition-colors group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Briefcase className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-bold text-foreground group-hover:text-primary transition-colors text-base">
                      {user.project?.name || 'Unassigned'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-[10px] font-mono bg-muted/50 px-2 py-1 rounded text-muted-foreground group-hover:text-foreground transition-colors border border-border/50">
                    {user.id}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MonitorSmartphone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{user.platform?.name || 'N/A'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-4">
                    {user.platform?.platform_type.includes('android') && (
                      <div className="p-1.5 bg-secondary/10 rounded-md" title="Android">
                        <AndroidIcon className="h-5 w-5 text-secondary" />
                      </div>
                    )}
                    {user.platform?.platform_type.includes('apple') && (
                      <div className="p-1.5 bg-primary/10 rounded-md" title="iPhone">
                        <Smartphone className="h-5 w-5 text-primary" />
                      </div>
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
