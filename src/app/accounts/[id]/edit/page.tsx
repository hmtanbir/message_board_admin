"use client";

import React, { use, useState, useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { UserForm } from "@/components/users/UserForm";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { type User } from "@/lib/types";

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

export default function EditAccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = (await api.get(`/accounts/${id}`)) as
          | {
              data?: User;
            }
          | User
          | null;

        if (response && "data" in response && response.data) {
          setUser(response.data);
        } else if (response && "name" in response) {
          setUser(response as User);
        } else {
          setUser(null);
        }
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to load account details",
          variant: "destructive",
        });
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, toast]);

  const handleSave = async (data: {
    name?: string;
    phone?: string;
    password?: string;
    status?: string;
    subscription?: string;
    preferences?: { theme?: string; language?: string };
  }) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      // Build payload with only editable fields
      const payload: Record<string, unknown> = {};

      if (data.name) payload.name = data.name;
      if (data.phone) payload.phone = data.phone;
      if (data.password) payload.password = data.password;
      if (data.status) payload.status = data.status.toLowerCase();
      if (data.subscription) {
        payload.subscription = data.subscription.toLowerCase();
      }

      if (data.preferences) {
        payload.preferences = {
          theme:
            THEME_MAP[data.preferences.theme || ""] || data.preferences.theme,
          language:
            LANGUAGE_MAP[data.preferences.language || ""] ||
            data.preferences.language,
        };
      }

      await api.patch(`/accounts/${user.appwrite_user_id}`, {
        account: payload,
      });

      toast({
        title: "✅ Profile Updated Successfully!",
        description: `${data.name}'s account has been updated. Redirecting to directory…`,
        className: "bg-secondary text-background border-secondary",
      });

      setTimeout(() => {
        router.push("/accounts");
      }, 1500);
    } catch (error: unknown) {
      setIsSubmitting(false);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update account";
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
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
        <p className="text-muted-foreground mb-6">
          The account ID you are looking for does not exist.
        </p>
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
            Admin Console <ChevronRight size={14} /> Account{" "}
            <ChevronRight size={14} /> Management
          </div>

          <Link
            href="/accounts"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 font-semibold group"
          >
            <ChevronLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Directory
          </Link>

          <h2 className="text-4xl font-headline font-bold text-foreground">
            Edit Profile
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
            Modify account configuration, project associations, and platform
            settings for <strong>{user.name}</strong>.
          </p>
        </header>

        <section className="bg-card border border-border rounded-2xl p-10 shadow-2xl max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <UserForm
            initialUser={user}
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
