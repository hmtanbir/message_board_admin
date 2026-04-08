"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { ChevronRight } from "lucide-react";

import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { UserList } from "@/components/users/UserList";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { type User } from "@/lib/types";

export default function AccountsPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/accounts") as { data?: User[] } | User[] | null;
        if (response && "data" in response && Array.isArray(response.data)) {
          setUsers(response.data);
        } else if (Array.isArray(response)) {
          setUsers(response);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load accounts",
          variant: "destructive"
        });
      }
    };
    fetchUsers();
  }, [toast]);

  const handleAdd = () => {
    router.push("/accounts/new");
  };

  const handleEdit = (user: User) => {
    router.push(`/accounts/${user.appwrite_user_id}/edit`);
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
    toast({
      title: "Account Removed",
      description: "The account has been successfully deleted.",
      variant: "default",
    });
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar activePage="accounts" />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12">
        <header className="mb-10 animate-in fade-in slide-in-from-left duration-500">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2 uppercase tracking-widest font-medium">
            Admin Console <ChevronRight size={14} /> Account
          </div>
          <h2 className="text-4xl font-headline font-bold text-foreground">
            Account Directory
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
            Manage your organization&apos;s user accounts, roles, and access
            permissions with streamlined administrative controls.
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
  );
}
