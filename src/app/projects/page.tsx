"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { ChevronRight } from "lucide-react";

import { Sidebar } from "@/components/layout/Sidebar";
import { ProjectList } from "@/components/projects/ProjectList";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { MOCK_USERS } from "@/lib/mock-data";
import { type User } from "@/lib/types";

export default function ProjectsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  const handleAdd = () => {
    router.push("/projects/new");
  };

  const handleEdit = (user: User) => {
    router.push(`/projects/${user.id}/edit`);
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
    toast({
      title: "Project Removed",
      description: "The project has been successfully removed from inventory.",
    });
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
            users={users}
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
