
"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserList } from '@/components/users/UserList'
import { Account, ApiResponse } from '@/lib/types'
import { api } from '@/lib/api'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { ChevronRight } from "lucide-react"
import { Sidebar } from '@/components/layout/Sidebar'

export default function AccountsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res: ApiResponse<Account[]> = await api.get('/accounts');
      setAccounts(res.data || []);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    router.push('/accounts/new');
  };

  const handleEdit = (account: Account) => {
    router.push(`/accounts/${account.id}/edit`);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/accounts/${id}`);
      setAccounts(accounts.filter(a => a.id !== id));
      toast({
        title: "Account Removed",
        description: "The account has been successfully deleted.",
        variant: "default",
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
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
          <h2 className="text-4xl font-headline font-bold text-foreground">Account Directory</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
            Manage your organization's user accounts, roles, and access permissions with streamlined administrative controls.
          </p>
        </header>

        <section className="animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <UserList 
            accounts={accounts} 
            loading={loading}
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
