
"use client"

import React, { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserForm } from '@/components/users/UserForm'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import Link from 'next/link'
import { MOCK_USERS } from '@/lib/mock-data'
import { User } from '@/lib/types'
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/layout/Sidebar';

export default function EditAccountPage({ params }: { params: Promise<{ id: string }> }) {
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

  const handleSave = (data: Partial<User>) => {
    toast({
      title: "Profile Updated",
      description: `${data.name}'s profile has been updated successfully.`,
      className: "bg-primary text-background border-primary",
    });
    
    setTimeout(() => {
      router.push('/accounts');
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
        <h2 className="text-2xl font-bold mb-4">Account Not Found</h2>
        <p className="text-muted-foreground mb-6">The account ID you are looking for does not exist.</p>
        <Link href="/accounts">
          <Button variant="default">Back to Directory</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar activePage="accounts" />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="mb-10 animate-in fade-in slide-in-from-left duration-500">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4 uppercase tracking-widest font-medium">
            Admin Console <ChevronRight size={14} /> Account <ChevronRight size={14} /> Management
          </div>
          
          <Link href="/accounts" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 font-semibold group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Directory
          </Link>
          
          <h2 className="text-4xl font-headline font-bold text-foreground">Edit Profile</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
            Modify account configuration, project associations, and platform settings for <strong>{user.name}</strong>.
          </p>
        </header>

        <section className="bg-card border border-border rounded-2xl p-10 shadow-2xl max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <UserForm 
            initialUser={user} 
            onSave={handleSave} 
            onCancel={() => router.push('/accounts')} 
          />
        </section>
        
        <Toaster />
      </main>
    </div>
  )
}
