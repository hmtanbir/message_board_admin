"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { AccountOnboardingForm } from '@/components/users/AccountOnboardingForm'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { Users, LayoutDashboard, LogOut, ChevronLeft, ChevronRight } from "lucide-react"
import Link from 'next/link'

export default function NewAccountPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSave = (data: any) => {
    // Colorful success toast
    toast({
      title: "🚀 Account Provisioned Successfully!",
      description: `${data.name} has been added to ${data.project.name}. Redirecting to directory...`,
      className: "bg-secondary text-background border-secondary",
    });
    
    setTimeout(() => {
      router.push('/');
    }, 2000);
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
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavItem icon={<Users size={20} />} label="Account" active />
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
        <header className="mb-10 animate-in fade-in slide-in-from-left duration-500">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4 uppercase tracking-widest font-medium">
            Admin Console <ChevronRight size={14} /> Account <ChevronRight size={14} /> Onboarding
          </div>
          
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 font-semibold group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Exit Onboarding
          </Link>
          
          <h2 className="text-4xl font-headline font-bold text-foreground">Account Setup</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
            Complete the multi-step process to provision a new organization account and associated project resources.
          </p>
        </header>

        <section className="bg-card border border-border rounded-2xl p-10 shadow-2xl max-w-4xl animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <AccountOnboardingForm 
            onSave={handleSave} 
            onCancel={() => router.push('/')} 
          />
        </section>
        
        <Toaster />
      </main>
    </div>
  )
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-all duration-200 group ${
      active ? 'bg-primary text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    }`}>
      <span className={`${active ? 'text-background' : 'text-muted-foreground group-hover:text-primary'}`}>
        {icon}
      </span>
      <span className="font-semibold">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 bg-background rounded-full" />}
    </button>
  );
}
