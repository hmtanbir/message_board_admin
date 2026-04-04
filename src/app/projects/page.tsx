
"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectList } from '@/components/projects/ProjectList'
import { Project, ApiResponse } from '@/lib/types'
import { api } from '@/lib/api'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { ChevronRight } from "lucide-react"
import { Sidebar } from '@/components/layout/Sidebar'

export default function ProjectsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res: ApiResponse<Project[]> = await api.get('/projects');
      setProjects(res.data || []);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    router.push('/projects/new');
  };

  const handleEdit = (project: Project) => {
    router.push(`/projects/${project.id}/edit`);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
      toast({
        title: "Project Removed",
        description: "The project has been successfully removed from inventory.",
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar activePage="projects" />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12">
        <header className="mb-10 animate-in fade-in slide-in-from-left duration-500">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2 uppercase tracking-widest font-medium">
            Admin Console <ChevronRight size={14} /> Projects
          </div>
          <h2 className="text-4xl font-headline font-bold text-foreground">Project Inventory</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
            Monitor and manage all active projects, associated platforms, and provisioning status across your organization.
          </p>
        </header>

        <section className="animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <ProjectList 
            projects={projects} 
            loading={loading}
            onAdd={handleAdd} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
        
        <Toaster />
      </main>
    </div>
  )
}
