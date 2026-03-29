"use client"

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Users, LayoutDashboard, LogOut, Briefcase } from "lucide-react"

interface SidebarProps {
  activePage: 'dashboard' | 'accounts' | 'projects';
}

export function Sidebar({ activePage }: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Simulated session clearance
    router.push('/login');
  };

  return (
    <aside className="w-64 border-r border-border bg-card/30 flex flex-col hidden lg:flex">
      <div className="p-8">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-background font-black text-xl">M</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-primary">Message<span className="text-foreground">Admin</span></h1>
        </div>
        
        <nav className="space-y-2">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            href="/" 
            active={activePage === 'dashboard'} 
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="Accounts" 
            href="/accounts" 
            active={activePage === 'accounts'} 
          />
          <NavItem 
            icon={<Briefcase size={20} />} 
            label="Projects" 
            href="/projects" 
            active={activePage === 'projects'} 
          />
        </nav>
      </div>
      
      <div className="mt-auto p-8">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 text-muted-foreground hover:text-destructive transition-colors w-full px-4 py-3 rounded-lg hover:bg-destructive/5 group"
        >
          <LogOut size={20} className="group-hover:scale-110 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, href, active = false }: { icon: React.ReactNode, label: string, href: string, active?: boolean }) {
  const Comp = active ? 'div' : Link;
  
  return (
    <Link href={href} className={`flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-all duration-200 group ${
      active ? 'bg-primary text-background shadow-md' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    }`}>
      <span className={`${active ? 'text-background' : 'text-muted-foreground group-hover:text-primary'}`}>
        {icon}
      </span>
      <span className="font-semibold">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 bg-background rounded-full" />}
    </Link>
  );
}
