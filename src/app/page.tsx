"use client"

import React, { useState } from 'react'
import { UserList } from '@/components/users/UserList'
import { UserDialog } from '@/components/users/UserDialogs'
import { MOCK_USERS } from '@/lib/mock-data'
import { User } from '@/lib/types'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { Users, LayoutDashboard, LogOut, ChevronRight } from "lucide-react"

export default function UserFlowAdmin() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  const handleAdd = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast({
      title: "User Removed",
      description: "The user account has been successfully deleted.",
      variant: "default",
    });
  };

  const handleSave = (userData: Partial<User>) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userData } as User : u));
      toast({
        title: "Profile Updated",
        description: `${userData.name}'s profile has been updated.`,
      });
    } else {
      const newUser: User = {
        ...userData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString().split('T')[0],
      } as User;
      setUsers([newUser, ...users]);
      toast({
        title: "User Created",
        description: `${userData.name} has been added to the system.`,
      });
    }
    setIsDialogOpen(false);
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

        <UserDialog 
          isOpen={isDialogOpen} 
          onClose={() => setIsDialogOpen(false)} 
          onSave={handleSave} 
          initialUser={editingUser} 
        />
        
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
