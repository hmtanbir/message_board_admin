
"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Briefcase, ShieldCheck, TrendingUp, LayoutDashboard, LogOut, ChevronRight, PieChart as PieChartIcon, Activity } from "lucide-react"
import Link from 'next/link'
import { MOCK_USERS } from '@/lib/mock-data'
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  ChartLegend, 
  ChartLegendContent 
} from "@/components/ui/chart"
import { ResponsiveContainer, Pie, PieChart, Cell } from "recharts"

export default function DashboardPage() {
  const totalUsers = MOCK_USERS.length;
  const activeUsers = MOCK_USERS.filter(u => u.status === 'Active').length;
  const premiumUsers = MOCK_USERS.filter(u => u.subscription === 'Premium').length;
  const totalProjects = MOCK_USERS.filter(u => u.project).length;

  // Data for Subscription Pie Chart
  const subData = MOCK_USERS.reduce((acc: any[], user) => {
    const existing = acc.find(s => s.name === user.subscription);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: user.subscription, value: 1 });
    }
    return acc;
  }, []);

  // Data for Status Pie Chart
  const statusData = [
    { name: 'Active', value: activeUsers },
    { name: 'Inactive', value: totalUsers - activeUsers },
  ];

  const SUB_COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--chart-3))'];
  const STATUS_COLORS = ['hsl(var(--secondary))', 'hsl(var(--muted))'];

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
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" href="/" active />
            <NavItem icon={<Users size={20} />} label="Accounts" href="/accounts" />
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
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="mb-10 animate-in fade-in slide-in-from-left duration-500">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2 uppercase tracking-widest font-medium">
            Admin Console <ChevronRight size={14} /> Analytics
          </div>
          <h2 className="text-4xl font-headline font-bold text-foreground">Command Center</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
            Real-time insights into your organization's user ecosystem and project health.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
          <StatCard 
            title="Total Accounts" 
            value={totalUsers} 
            icon={<Users className="h-5 w-5 text-primary" />} 
            description="Across all departments"
          />
          <StatCard 
            title="Active Users" 
            value={activeUsers} 
            icon={<TrendingUp className="h-5 w-5 text-secondary" />} 
            description={`${((activeUsers/totalUsers)*100).toFixed(0)}% engagement rate`}
          />
          <StatCard 
            title="Premium Tier" 
            value={premiumUsers} 
            icon={<ShieldCheck className="h-5 w-5 text-primary" />} 
            description="High-value subscribers"
          />
          <StatCard 
            title="Live Projects" 
            value={totalProjects} 
            icon={<Briefcase className="h-5 w-5 text-secondary" />} 
            description="Active provisioning"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
          {/* Subscription Chart */}
          <Card className="border-border bg-card/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <PieChartIcon className="h-5 w-5 text-primary" />
                Subscription Tiers
              </CardTitle>
              <CardDescription>Breakdown of account licensing levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px] w-full">
                <PieChart>
                  <Pie
                    data={subData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subData.map((entry, index) => (
                      <Cell key={`cell-sub-${index}`} fill={SUB_COLORS[index % SUB_COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* User Status Chart */}
          <Card className="border-border bg-card/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Activity className="h-5 w-5 text-secondary" />
                Account Status
              </CardTitle>
              <CardDescription>Ratio of active vs. inactive accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px] w-full">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-status-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function StatCard({ title, value, icon, description }: { title: string, value: number, icon: React.ReactNode, description: string }) {
  return (
    <Card className="border-border bg-card/50 shadow-sm hover:border-primary/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
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
