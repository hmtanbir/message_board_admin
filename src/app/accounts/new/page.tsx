"use client";

import React, { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { AccountOnboardingForm } from "@/components/users/AccountOnboardingForm";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

// Map display values to API-expected lowercase values
const LANGUAGE_MAP: Record<string, string> = {
  English: "en",
  French: "fr",
  Spanish: "es",
  Chinese: "zh",
  Japanese: "ja",
};

const THEME_MAP: Record<string, string> = {
  Light: "light",
  Dark: "dark",
};

export default function NewAccountPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    status: string;
    preferences: { theme: string; language: string };
    project: { name: string };
    platform: { package_name: string; platform_type: string[] };
  }) => {
    setIsSubmitting(true);

    try {
      const payload = {
        account: {
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
          status: data.status.toLowerCase(),
          subscription: data.subscription.toLowerCase(),
          project: {
            name: data.project.name,
            package_name: data.platform.package_name,
            android: data.platform.platform_type.includes("android"),
            apple: data.platform.platform_type.includes("apple"),
          },
          preferences: {
            theme: THEME_MAP[data.preferences.theme] || "light",
            language: LANGUAGE_MAP[data.preferences.language] || "en",
          },
        },
      };

      await api.post("/accounts", payload);

      toast({
        title: "🚀 Account Provisioned Successfully!",
        description: `${data.name} has been onboarded with project "${data.project.name}". Redirecting to directory…`,
        className: "bg-secondary text-background border-secondary",
      });

      setTimeout(() => {
        router.push("/accounts");
      }, 1500);
    } catch (error: unknown) {
      setIsSubmitting(false);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create account";
      toast({
        title: "Account Provisioning Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar activePage="accounts" />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="mb-10 animate-in fade-in slide-in-from-left duration-500">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4 uppercase tracking-widest font-medium">
            Admin Console <ChevronRight size={14} /> Account{" "}
            <ChevronRight size={14} /> Onboarding
          </div>

          <Link
            href="/accounts"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 font-semibold group"
          >
            <ChevronLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Exit Onboarding
          </Link>

          <h2 className="text-4xl font-headline font-bold text-foreground">
            Account Setup
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
            Complete the process to provision a new organization account and
            associated project resources.
          </p>
        </header>

        <section className="bg-card border border-border rounded-2xl p-10 shadow-2xl max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <AccountOnboardingForm
            onSave={handleSave}
            onCancel={() => router.push("/accounts")}
            isSubmitting={isSubmitting}
          />
        </section>

        <Toaster />
      </main>
    </div>
  );
}
