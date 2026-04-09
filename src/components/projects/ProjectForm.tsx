"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Briefcase,
  CheckCircle2,
  Search,
  ChevronsUpDown,
  Check,
  User as UserIcon,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import { type Account } from "@/lib/types";
import { cn } from "@/lib/utils";

const projectSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  package_name: z.string().min(2, "Package name is required"),
  platform_type: z.array(z.string()).min(1, "Select at least one platform"),
  userId: z.string().min(1, "User association is required"),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  initialData?: ProjectFormValues;
  onSave: (data: ProjectFormValues) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export function ProjectForm({
  initialData,
  onSave,
  onCancel,
  isSaving = false,
}: ProjectFormProps) {
  const [userSearch, setUserSearch] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      name: "",
      package_name: "",
      platform_type: [],
      userId: "",
    },
  });

  const fetchAccounts = useCallback(async () => {
    try {
      setLoadingAccounts(true);
      const response = (await api.get("/accounts?role=user")) as
        | { data?: Account[] }
        | Account[]
        | null;

      if (response && "data" in response && Array.isArray(response.data)) {
        setAccounts(response.data);
      } else if (Array.isArray(response)) {
        setAccounts(response);
      }
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    } finally {
      setLoadingAccounts(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const filteredUsers = useMemo(() => {
    if (!userSearch) return accounts;
    return accounts.filter(
      (account) =>
        account.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        account.email.toLowerCase().includes(userSearch.toLowerCase()),
    );
  }, [userSearch, accounts]);

  const onSubmit = (data: ProjectFormValues) => {
    onSave(data);
  };

  const selectedUser = accounts.find(
    (u) => String(u.id) === form.watch("userId"),
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border-border bg-card/50 shadow-sm max-w-2xl mx-auto">
          <CardHeader className="border-b bg-muted/20 py-4">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Briefcase className="h-5 w-5 text-secondary" />
              Project Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Associated Account Owner</FormLabel>
                    <Popover
                      open={isPopoverOpen}
                      onOpenChange={setIsPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            disabled={loadingAccounts || !!initialData}
                            className={cn(
                              "w-full justify-between h-11 bg-background border-muted font-normal",
                              !field.value && "text-muted-foreground",
                              !!initialData && "bg-muted cursor-not-allowed opacity-100 disabled:opacity-100",
                            )}
                          >
                            <div className="flex items-center gap-2 truncate">
                              {(() => {
                                if (loadingAccounts) {
                                  return (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                      <span>Loading accounts...</span>
                                    </>
                                  );
                                }
                                if (selectedUser) {
                                  return (
                                    <>
                                      <UserIcon className="h-4 w-4 text-primary" />
                                      <span className="font-medium text-foreground">
                                        {selectedUser.name}
                                      </span>
                                      <span className="text-muted-foreground text-xs">
                                        ({selectedUser.email})
                                      </span>
                                    </>
                                  );
                                }
                                return "Assign project to a user...";
                              })()}
                            </div>
                            {!initialData && <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[var(--radix-popover-trigger-width)] p-0"
                        align="start"
                      >
                        <div className="flex items-center border-b px-3 bg-muted/10">
                          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                          <Input
                            placeholder="Search accounts by name or email..."
                            className="h-10 border-0 focus-visible:ring-0 bg-transparent text-sm"
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                          />
                        </div>
                        <ScrollArea className="h-64">
                          <div className="p-1">
                            {filteredUsers.length === 0 ? (
                              <div className="py-6 text-center text-sm text-muted-foreground italic">
                                {loadingAccounts
                                  ? "Loading accounts..."
                                  : `No results found for "${userSearch}"`}
                              </div>
                            ) : (
                              filteredUsers.map((account) => (
                                <div
                                  key={account.id}
                                  role="option"
                                  aria-selected={
                                    field.value === String(account.id)
                                  }
                                  tabIndex={0}
                                  className={cn(
                                    "flex items-center justify-between px-3 py-2.5 text-sm rounded-md cursor-pointer hover:bg-primary/10 transition-colors group",
                                    field.value === String(account.id) &&
                                      "bg-primary/5",
                                  )}
                                  onClick={() => {
                                    form.setValue("userId", String(account.id));
                                    setIsPopoverOpen(false);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      form.setValue(
                                        "userId",
                                        String(account.id),
                                      );
                                      setIsPopoverOpen(false);
                                    }
                                  }}
                                >
                                  <div className="flex flex-col min-w-0">
                                    <span
                                      className={cn(
                                        "font-medium group-hover:text-primary transition-colors",
                                        field.value === String(account.id)
                                          ? "text-primary"
                                          : "text-foreground",
                                      )}
                                    >
                                      {account.name}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground truncate">
                                      {account.email}
                                    </span>
                                  </div>
                                  {field.value === String(account.id) && (
                                    <Check className="h-4 w-4 text-primary shrink-0" />
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </ScrollArea>
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="text-[10px]">
                      {initialData
                        ? "The project owner is locked and cannot be changed after creation."
                        : "Search and select the account that will own this project resource."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Titan Pro"
                        {...field}
                        className="h-11 bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="package_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Package ID (Bundle ID)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="com.company.app"
                        {...field}
                        readOnly={!!initialData}
                        className={cn(
                          "h-11 font-mono text-xs bg-background",
                          !!initialData && "bg-muted cursor-not-allowed",
                        )}
                      />
                    </FormControl>
                    <FormDescription className="text-[10px]">
                      Unique identifier for application distribution.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="platform_type"
                render={() => (
                  <FormItem>
                    <div className="mb-3">
                      <FormLabel className="text-sm font-semibold">
                        Deployment Environments
                      </FormLabel>
                      <FormDescription className="text-[10px]">
                        Select target platforms for this project resource.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {["android", "apple"].map((type) => (
                        <FormField
                          key={type}
                          control={form.control}
                          name="platform_type"
                          render={({ field }) => (
                            <FormItem
                              key={type}
                              className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-muted/50 transition-all cursor-pointer group"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(type)}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...field.value, type]
                                      : field.value?.filter(
                                          (value: string) => value !== type,
                                        );
                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-medium capitalize cursor-pointer flex-1 text-sm group-hover:text-primary transition-colors">
                                {type === "apple"
                                  ? "Apple (iOS/macOS)"
                                  : "Android (Mobile/TV)"}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-4 pt-8 border-t max-w-2xl mx-auto">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSaving}
            className="px-6 h-11 text-sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-primary text-background hover:bg-primary/90 font-bold px-10 h-11 shadow-lg shadow-primary/20"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />{" "}
                {initialData ? "Update Project" : "Initialize Project"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
