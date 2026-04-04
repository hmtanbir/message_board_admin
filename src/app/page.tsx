"use client"

import React from 'react'

import { Users, Briefcase, ShieldCheck, TrendingUp, ChevronRight, PieChart as PieChartIcon, Activity } from "lucide-react"
import { PieChart, Pie, Cell } from "recharts"

import { Sidebar } from '@/components/layout/Sidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  ChartLegend, 
  ChartLegendContent 
} from "@/components/ui/chart"
import { MOCK_USERS } from '@/lib/mock-data'


export default function DashboardPage() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const totalUsers = MOCK_USERS.length;
  const activeUsers = MOCK_USERS.filter(u => u.status === 'Active').length;
  const premiumUsers = MOCK_USERS.filter(u => u.subscription === 'Premium').length;
  const totalProjects = MOCK_USERS.filter(u => u.project).length;

  // Data for Subscription Pie Chart
  const subData = MOCK_USERS.reduce((acc: { name: string; value: number }[], user) => {
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

  const SUB_COLORS = ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-chart-3)'];
  const STATUS_COLORS = ['var(--color-secondary)', 'var(--color-muted)'];

  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar activePage="dashboard" />
        <main className="flex-1 p-6 md:p-12">
          <div className="animate-pulse space-y-8">
            <div className="h-20 bg-muted/20 rounded-lg w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted/20 rounded-xl" />)}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar activePage="dashboard" />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="mb-10 animate-in fade-in slide-in-from-left duration-500">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2 uppercase tracking-widest font-medium">
            Admin Console <ChevronRight size={14} /> Analytics
          </div>
          <h2 className="text-4xl font-headline font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
            Real-time insights into your organization&apos;s user ecosystem and project health.
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subscription Chart */}
          <Card className="border-border bg-card/50 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <PieChartIcon className="h-5 w-5 text-primary" />
                Subscription Tiers
              </CardTitle>
              <CardDescription>Breakdown of account licensing levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ChartContainer config={{}} className="h-full w-full">
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
                      {subData.map((entry: { name: string; value: number }, index: number) => (
                        <Cell key={`cell-sub-${entry.name}`} fill={SUB_COLORS[index % SUB_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent payload={[]} />} />
                  </PieChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* User Status Chart */}
          <Card className="border-border bg-card/50 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Activity className="h-5 w-5 text-secondary" />
                Account Status
              </CardTitle>
              <CardDescription>Ratio of active vs. inactive accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ChartContainer config={{}} className="h-full w-full">
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
                      {statusData.map((entry: { name: string; value: number }, index: number) => (
                        <Cell key={`cell-status-${entry.name}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent payload={[]} />} />
                  </PieChart>
                </ChartContainer>
              </div>
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
