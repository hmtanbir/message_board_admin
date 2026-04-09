"use client";

import React, { useState, useCallback, useEffect } from "react";

import { useRouter } from "next/navigation";

import { ChevronRight } from "lucide-react";

import { Sidebar } from "@/components/layout/Sidebar";
import { ProjectList } from "@/components/projects/ProjectList";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { type Project } from "@/lib/types";

export default function ProjectsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = (await api.get("/projects")) as
        | { data?: Project[] }
        | Project[]
        | null;

      if (response && "data" in response && Array.isArray(response.data)) {
        setProjects(response.data);
      } else if (Array.isArray(response)) {
        setProjects(response);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleAdd = () => {
    router.push("/projects/new");
  };

  const handleEdit = (project: Project) => {
    router.push(`/projects/${project.appwrite_project_id}/edit`);
  };

  const handleDelete = async (appwriteProjectId: string) => {
    try {
      await api.delete(`/projects/${appwriteProjectId}`);

      setProjects(
        projects.filter((p) => p.appwrite_project_id !== appwriteProjectId),
      );
      toast({
        title: "Project Removed",
        description:
          "The project has been successfully removed from inventory.",
      });
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description:
          error instanceof Error ? error.message : "Failed to delete project",
        variant: "destructive",
      });
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
          <h2 className="text-4xl font-headline font-bold text-foreground">
            Project Inventory
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
            Monitor and manage all active projects, associated platforms, and
            provisioning status across your organization.
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
  );
}
