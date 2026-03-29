
"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { AccountOnboardingForm } from '@/components/users/AccountOnboardingForm'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from 'next/link'
import { Sidebar } from '@/components/layout/Sidebar'

export default function NewAccountPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSave = (data: any) => {
    toast({
      title: "🚀 Account Provisioned Successfully!",
      description: `${data.name} has been added to ${data.project.name}. Redirecting to directory...`,
      className: "bg-secondary text-background border-secondary",
    });
    
    setTimeout(() => {
      router.push('/accounts');
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar activePage="accounts" />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="mb-10 animate-in fade-in slide-in-from-left duration-500">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4 uppercase tracking-widest font-medium">
            Admin Console <ChevronRight size={14} /> Account <ChevronRight size={14} /> Onboarding
          </div>
          
          <Link href="/accounts" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 font-semibold group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Exit Onboarding
          </Link>
          
          <h2 className="text-4xl font-headline font-bold text-foreground">Account Setup</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
            Complete the process to provision a new organization account and associated project resources.
          </p>
        </header>

        <section className="bg-card border border-border rounded-2xl p-10 shadow-2xl max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <AccountOnboardingForm 
            onSave={handleSave} 
            onCancel={() => router.push('/accounts')} 
          />
        </section>
        
        <Toaster />
      </main>
    </div>
  )
}
