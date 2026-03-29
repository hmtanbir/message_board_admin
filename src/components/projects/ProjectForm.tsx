
"use client"

import React, { useEffect, useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Briefcase, CheckCircle2, Search, ChevronsUpDown, Check, User as UserIcon } from "lucide-react"
import { MOCK_USERS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const projectSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  package_name: z.string().min(2, "Package name is required"),
  platform_type: z.array(z.string()).min(1, "Select at least one platform"),
  userId: z.string().min(1, "User association is required")
})

type ProjectFormValues = z.infer<typeof projectSchema>

interface ProjectFormProps {
  initialData?: ProjectFormValues;
  onSave: (data: ProjectFormValues) => void;
  onCancel: () => void;
}

export function ProjectForm({ initialData, onSave, onCancel }: ProjectFormProps) {
  const [userSearch, setUserSearch] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      name: '',
      package_name: '',
      platform_type: [],
      userId: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const filteredUsers = useMemo(() => {
    if (!userSearch) return MOCK_USERS;
    return MOCK_USERS.filter(user => 
      user.name.toLowerCase().includes(userSearch.toLowerCase()) || 
      user.email.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [userSearch]);

  const onSubmit = (data: ProjectFormValues) => {
    onSave(data);
  };

  const selectedUser = MOCK_USERS.find(u => u.id === form.watch("userId"));

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
                    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between h-11 bg-background border-muted font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2 truncate">
                              {selectedUser ? (
                                <>
                                  <UserIcon className="h-4 w-4 text-primary" />
                                  <span className="font-medium text-foreground">{selectedUser.name}</span>
                                  <span className="text-muted-foreground text-xs">({selectedUser.email})</span>
                                </>
                              ) : (
                                "Assign project to a user..."
                              )}
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
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
                              <div className="py-6 text-center text-sm text-muted-foreground italic">No results found for "{userSearch}"</div>
                            ) : (
                              filteredUsers.map((user) => (
                                <div
                                  key={user.id}
                                  className={cn(
                                    "flex items-center justify-between px-3 py-2.5 text-sm rounded-md cursor-pointer hover:bg-primary/10 transition-colors group",
                                    field.value === user.id && "bg-primary/5"
                                  )}
                                  onClick={() => {
                                    form.setValue("userId", user.id);
                                    setIsPopoverOpen(false);
                                  }}
                                >
                                  <div className="flex flex-col min-w-0">
                                    <span className={cn(
                                      "font-medium group-hover:text-primary transition-colors",
                                      field.value === user.id ? "text-primary" : "text-foreground"
                                    )}>
                                      {user.name}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
                                  </div>
                                  {field.value === user.id && (
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
                      Search and select the account that will own this project resource.
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
                    <FormControl><Input placeholder="Titan Pro" {...field} className="h-11 bg-background" /></FormControl>
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
                    <FormControl><Input placeholder="com.company.app" {...field} className="h-11 font-mono text-xs bg-background" /></FormControl>
                    <FormDescription className="text-[10px]">Unique identifier for application distribution.</FormDescription>
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
                      <FormLabel className="text-sm font-semibold">Deployment Environments</FormLabel>
                      <FormDescription className="text-[10px]">Select target platforms for this project resource.</FormDescription>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['android', 'apple'].map((type) => (
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
                                      : field.value?.filter((value: string) => value !== type);
                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-medium capitalize cursor-pointer flex-1 text-sm group-hover:text-primary transition-colors">
                                {type === 'apple' ? 'Apple (iOS/macOS)' : 'Android (Mobile/TV)'}
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
          <Button type="button" variant="ghost" onClick={onCancel} className="px-6 h-11 text-sm">
            Cancel
          </Button>
          <Button type="submit" className="bg-primary text-background hover:bg-primary/90 font-bold px-10 h-11 shadow-lg shadow-primary/20">
            <CheckCircle2 className="mr-2 h-4 w-4" /> {initialData ? 'Update Project' : 'Initialize Project'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
