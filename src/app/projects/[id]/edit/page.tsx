"use client"

import React, { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import Link from 'next/link'
import { MOCK_USERS } from '@/lib/mock-data'
import { User } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/layout/Sidebar'

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundUser = MOCK_USERS.find(u => u.id === id);
    if (foundUser) {
      setUser(foundUser);
    }
    setLoading(false);
  }, [id]);

  const handleSave = (data: any) => {
    toast({
      title: "🛠️ Project Updated",
      description: `${data.name} has been modified successfully.`,
      className: "bg-secondary text-background border-secondary",
    });
    
    setTimeout(() => {
      router.push('/projects');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <p className="text-muted-foreground mb-6">The project ID you are looking for does not exist.</p>
        <Link href="/projects">
          <Button variant="default">Back to Inventory</Button>
        </Link>
      </div>
    );
  }

  const initialProjectData = {
    name: user.project?.name || '',
    package_name: user.platform?.package_name || '',
    platform_type: user.platform?.platform_type || []
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar activePage="projects" />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="mb-10 animate-in fade-in slide-in-from-left duration-500 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4 uppercase tracking-widest font-medium">
            Admin Console <ChevronRight size={14} /> Project <ChevronRight size={14} /> Modification
          </div>
          
          <Link href="/projects" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 font-semibold group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Inventory
          </Link>
          
          <h2 className="text-4xl font-headline font-bold text-foreground">Edit Project</h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Update parameters and target platforms for <strong>{user.project?.name}</strong>.
          </p>
        </header>

        <section className="animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <ProjectForm 
            initialData={initialProjectData}
            onSave={handleSave} 
            onCancel={() => router.push('/projects')} 
          />
        </section>
        
        <Toaster />
      </main>
    </div>
  )
}
