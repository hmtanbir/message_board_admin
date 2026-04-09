"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";

import {
  Users,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  ChevronRight,
  PieChart as PieChartIcon,
  Activity,
} from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";

import { Sidebar } from "@/components/layout/Sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { type DashboardData } from "@/lib/types";

// Suppress Recharts React 19 defaultProps warning in terminal / console
if (typeof console !== "undefined") {
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes(
        "Support for defaultProps will be removed from function components",
      )
    ) {
      return;
    }
    originalConsoleError(...args);
  };

  const originalConsoleWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("The width") &&
      args[0].includes("should be greater than 0")
    ) {
      return;
    }
    originalConsoleWarn(...args);
  };
}

export default function DashboardPage() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/dashboard") as { data: DashboardData };
      setData(response.data);
    } catch (error) {
      toast({
        title: "Analytics Failure",
        description: error instanceof Error ? error.message : "Failed to load dashboard metrics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Derived data for charts
  const subData = useMemo(() => {
    if (!data) return [];
    return [
      { name: "Basic", value: data.basic_users },
      { name: "Standard", value: data.standard_users },
      { name: "Premium", value: data.premium_users },
    ].filter((item) => item.value > 0);
  }, [data]);

  const statusData = useMemo(() => {
    if (!data) return [];
    return [
      { name: "Active", value: data.active_users },
      { name: "Inactive", value: data.inactive_users },
    ].filter((item) => item.value > 0);
  }, [data]);

  const SUB_COLORS = [
    "var(--color-primary)",
    "var(--color-secondary)",
    "var(--color-chart-3)",
  ];
  const STATUS_COLORS = ["var(--color-secondary)", "var(--color-muted)"];

  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar activePage="dashboard" />
        <main className="flex-1 p-6 md:p-12">
          <div className="animate-pulse space-y-8">
            <div className="h-20 bg-muted/20 rounded-lg w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-muted/20 rounded-xl" />
              ))}
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
          <h2 className="text-4xl font-headline font-bold text-foreground">
            Dashboard
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
            Real-time insights into your organization&apos;s user ecosystem and
            project health.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
          <StatCard
            title="Total Accounts"
            value={data?.total_accounts ?? 0}
            icon={<Users className="h-5 w-5 text-primary" />}
            description="Across all departments"
            loading={loading}
          />
          <StatCard
            title="Active Users"
            value={data?.active_users ?? 0}
            icon={<TrendingUp className="h-5 w-5 text-secondary" />}
            description={
              data
                ? `${((data.active_users / data.total_accounts) * 100).toFixed(0)}% engagement rate`
                : "Calculating..."
            }
            loading={loading}
          />
          <StatCard
            title="Premium Tier"
            value={data?.premium_users ?? 0}
            icon={<ShieldCheck className="h-5 w-5 text-primary" />}
            description="High-value subscribers"
            loading={loading}
          />
          <StatCard
            title="Live Projects"
            value={data?.live_projects ?? 0}
            icon={<Briefcase className="h-5 w-5 text-secondary" />}
            description="Active provisioning"
            loading={loading}
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
              <CardDescription>
                Breakdown of account licensing levels
              </CardDescription>
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
                      nameKey="name"
                    >
                      {subData.map(
                        (
                          entry: { name: string; value: number },
                          index: number,
                        ) => (
                          <Cell
                            key={`cell-sub-${entry.name}`}
                            fill={SUB_COLORS[index % SUB_COLORS.length]}
                          />
                        ),
                      )}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend
                      content={<ChartLegendContent payload={[]} />}
                    />
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
              <CardDescription>
                Ratio of active vs. inactive accounts
              </CardDescription>
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
                      nameKey="name"
                    >
                      {statusData.map(
                        (
                          entry: { name: string; value: number },
                          index: number,
                        ) => (
                          <Cell
                            key={`cell-status-${entry.name}`}
                            fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                          />
                        ),
                      )}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend
                      content={<ChartLegendContent payload={[]} />}
                    />
                  </PieChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  description,
  loading = false,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  loading?: boolean;
}) {
  return (
    <Card className="border-border bg-card/50 shadow-sm hover:border-primary/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-9 w-16 bg-muted/20 animate-pulse rounded mb-1" />
        ) : (
          <div className="text-3xl font-bold mb-1">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
