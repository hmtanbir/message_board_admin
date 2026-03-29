
"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserList } from '@/components/users/UserList'
import { MOCK_USERS } from '@/lib/mock-data'
import { User } from '@/lib/types'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { Users, LayoutDashboard, LogOut, ChevronRight, Briefcase } from "lucide-react"
import Link from 'next/link'

export default function UserFlowAdmin() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const { toast } = useToast();

  const handleAdd = () => {
    router.push('/accounts/new');
  };

  const handleEdit = (user: User) => {
    router.push(`/accounts/${user.id}/edit`);
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast({
      title: "Account Removed",
      description: "The account has been successfully deleted.",
      variant: "default",
    });
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
            <NavItem icon={<Users size={20} />} label="Accounts" href="/" active />
            <NavItem icon={<Briefcase size={20} />} label="Projects" href="/projects" />
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
      <main className="flex-1 p-6 md:p-12">
        <header className="mb-10 animate-in fade-in slide-in-from-left duration-500">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2 uppercase tracking-widest font-medium">
            Admin Console <ChevronRight size={14} /> Account
          </div>
          <h2 className="text-4xl font-headline font-bold text-foreground">Team Directory</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
            Manage your organization's user accounts, roles, and access permissions. Utilize the AI-powered smart tool to maintain security best practices.
          </p>
        </header>

        <section className="animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <UserList 
            users={users} 
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
