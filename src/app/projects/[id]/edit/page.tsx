"use client";

import React, { use, useState, useEffect, useCallback, useMemo } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { Sidebar } from "@/components/layout/Sidebar";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { type Project } from "@/lib/types";

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const initialProjectData = useMemo(() => {
    if (!project) return undefined;
    const platform_type: string[] = [];
    if (project.android) platform_type.push("android");
    if (project.apple) platform_type.push("apple");

    return {
      name: project.name || "",
      package_name: project.package_name || "",
      platform_type,
      userId: String(project.user_id),
    };
  }, [project]);


  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const response = (await api.get(`/projects/${id}`)) as
        | { data?: Project }
        | Project
        | null;

      if (response && "data" in response && response.data) {
        setProject(response.data as Project);
      } else if (response && "name" in (response as Project)) {
        setProject(response as Project);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to load project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleSave = async (data: {
    name: string;
    package_name: string;
    platform_type: string[];
    userId: string;
  }) => {
    try {
      setIsSaving(true);

      const payload = {
        project: {
          user_id: data.userId,
          name: data.name,
          package_name: data.package_name,
          android: data.platform_type.includes("android"),
          apple: data.platform_type.includes("apple"),
        },
      };

      const response = (await api.patch(`/projects/${id}`, payload)) as
        | { data?: Project }
        | Project
        | null;

      if (response && "data" in response && response.data) {
        setProject(response.data as Project);
      } else if (response && "name" in (response as Project)) {
        setProject(response as Project);
      }


      toast({
        title: "🛠️ Project Updated",
        description: `${data.name} has been modified successfully.`,
        className: "bg-secondary text-background border-secondary",
      });

      setTimeout(() => {
        router.push("/projects");
      }, 1500);
    } catch (error) {
      toast({
        title: "Update Failed",
        description:
          error instanceof Error ? error.message : "Failed to update project",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The project ID you are looking for does not exist.
        </p>
        <Link href="/projects">
          <Button variant="default">Back to Inventory</Button>
        </Link>
      </div>
    );
  }



  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar activePage="projects" />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="mb-10 animate-in fade-in slide-in-from-left duration-500 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4 uppercase tracking-widest font-medium">
            Admin Console <ChevronRight size={14} /> Project{" "}
            <ChevronRight size={14} /> Modification
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 font-semibold group"
          >
            <ChevronLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Inventory
          </Link>

          <h2 className="text-4xl font-headline font-bold text-foreground">
            Edit Project
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Update parameters and target platforms for{" "}
            <strong>{project.name}</strong>.
          </p>
        </header>

        <section className="animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <ProjectForm
            initialData={initialProjectData}
            onSave={handleSave}
            onCancel={() => router.push("/projects")}
            isSaving={isSaving}
          />
        </section>

        <Toaster />
      </main>
    </div>
  );
}
