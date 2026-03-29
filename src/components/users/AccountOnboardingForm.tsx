
"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User as UserIcon, Briefcase, RefreshCw, CheckCircle2, Globe, Palette } from "lucide-react"

const onboardingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 characters")
    .regex(/^\+/, "Phone number must start with '+' (e.g. +1...)"),
  status: z.enum(['Active', 'Inactive']),
  subscription: z.enum(['Basic', 'Standard', 'Premium']),
  jobTitle: z.string().min(2, "Job title is required"),
  department: z.string().min(2, "Department is required"),
  preferences: z.object({
    theme: z.enum(['Light', 'Dark']).default('Light'),
    language: z.enum(['English', 'French', 'Spanish', 'Chinese', 'Japanese']).default('English')
  }),
  project: z.object({
    name: z.string().min(2, "Project name is required")
  }),
  platform: z.object({
    package_name: z.string().min(2, "Package name is required"),
    platform_type: z.array(z.string()).min(1, "Select at least one platform")
  })
})

type OnboardingValues = z.infer<typeof onboardingSchema>

interface AccountOnboardingFormProps {
  onSave: (data: OnboardingValues) => void;
  onCancel: () => void;
}

export function AccountOnboardingForm({ onSave, onCancel }: AccountOnboardingFormProps) {
  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      status: 'Active',
      subscription: 'Basic',
      jobTitle: '',
      department: '',
      preferences: { theme: 'Light', language: 'English' },
      project: { name: '' },
      platform: {
        package_name: '',
        platform_type: []
      }
    }
  });

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    const length = 14;
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    form.setValue('password', password, { shouldValidate: true });
  };

  const onSubmit = (data: OnboardingValues) => {
    onSave(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 items-start">
          
          {/* Column 1: Account Details */}
          <Card className="border-border bg-card/50 shadow-sm h-full">
            <CardHeader className="border-b bg-muted/20 py-4">
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <UserIcon className="h-5 w-5 text-primary" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="John Doe" {...field} className="h-10" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input placeholder="john@example.com" type="email" {...field} className="h-10" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl><Input placeholder="Senior Analyst" {...field} className="h-10" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl><Input placeholder="Operations" {...field} className="h-10" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="••••••••" {...field} className="h-10" />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon" 
                          onClick={generatePassword}
                          className="h-10 w-10 shrink-0 border-primary/30 text-primary hover:bg-primary/10"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormDescription className="text-[10px]">Min. 8 chars.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="subscription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subscription Plan</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10 text-xs">
                              <SelectValue placeholder="Select plan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Basic">Basic</SelectItem>
                            <SelectItem value="Standard">Standard</SelectItem>
                            <SelectItem value="Premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10 text-xs">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="pt-4 border-t space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Globe className="h-3 w-3" /> Preferences
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="preferences.language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px]">Language</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-10 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="English">English</SelectItem>
                              <SelectItem value="French">French</SelectItem>
                              <SelectItem value="Spanish">Spanish</SelectItem>
                              <SelectItem value="Chinese">Chinese</SelectItem>
                              <SelectItem value="Japanese">Japanese</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="preferences.theme"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px]">Theme</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-10 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Light">Light</SelectItem>
                              <SelectItem value="Dark">Dark</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Column 2: Project Information */}
          <Card className="border-border bg-card/50 shadow-sm h-full">
            <CardHeader className="border-b bg-muted/20 py-4">
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <Briefcase className="h-5 w-5 text-secondary" />
                Project Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-5">
                <FormField
                  control={form.control}
                  name="project.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl><Input placeholder="Titan Pro" {...field} className="h-10" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="platform.package_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package ID (Bundle ID)</FormLabel>
                      <FormControl><Input placeholder="com.company.app" {...field} className="h-10 font-mono text-xs" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="platform.platform_type"
                  render={() => (
                    <FormItem>
                      <div className="mb-3">
                        <FormLabel className="text-sm font-semibold">Deployment Environments</FormLabel>
                        <FormDescription className="text-[10px]">Select all applicable target platforms.</FormDescription>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {['android', 'apple'].map((type) => (
                          <FormField
                            key={type}
                            control={form.control}
                            name="platform.platform_type"
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
        </div>

        <div className="flex items-center justify-end gap-4 pt-8 border-t">
          <Button type="button" variant="ghost" onClick={onCancel} className="px-6 h-10 text-sm">
            Cancel
          </Button>
          <Button type="submit" className="bg-primary text-background hover:bg-primary/90 font-bold px-10 h-10">
            <CheckCircle2 className="mr-2 h-4 w-4" /> Provision Account
          </Button>
        </div>
      </form>
    </Form>
  )
}
