
"use client"

import React, { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { Users, LayoutDashboard, LogOut, ChevronLeft, ChevronRight, Briefcase, Loader2 } from "lucide-react"
import Link from 'next/link'
import { MOCK_USERS } from '@/lib/mock-data'
import { User } from '@/lib/types'
import { Button } from '@/components/ui/button'

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
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/30 flex flex-col hidden lg:flex">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-background font-black text-xl">U</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-primary">UserFlow<span className="text-foreground">Admin</span></h1>
          </div>
          
          <nav className="space-y-2">
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" href="/" />
            <NavItem icon={<Users size={20} />} label="Accounts" href="/" />
            <NavItem icon={<Briefcase size={20} />} label="Projects" href="/projects" active />
          </nav>
        </div>
        
        <div className="mt-auto p-8">
          <button className="flex items-center gap-3 text-muted-foreground hover:text-destructive transition-colors w-full px-4 py-3 rounded-lg hover:bg-destructive/5 group">
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

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

function NavItem({ icon, label, href, active = false }: { icon: React.ReactNode, label: string, href: string, active?: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-all duration-200 group ${
      active ? 'bg-primary text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    }`}>
      <span className={`${active ? 'text-background' : 'text-muted-foreground group-hover:text-primary'}`}>
        {icon}
      </span>
      <span className="font-semibold">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 bg-background rounded-full" />}
    </Link>
  );
}
