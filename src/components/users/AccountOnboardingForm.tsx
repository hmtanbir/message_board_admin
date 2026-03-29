"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, ChevronLeft, CheckCircle2, User as UserIcon, Briefcase, Smartphone, Key, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

const onboardingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  status: z.enum(['Active', 'Inactive']),
  preferences: z.object({
    darkTheme: z.boolean().default(false)
  }),
  project: z.object({
    name: z.string().min(2, "Project name is required")
  }),
  platform: z.object({
    name: z.string().min(2, "Platform name is required"),
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
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      status: 'Active',
      preferences: { darkTheme: false },
      project: { name: '' },
      platform: {
        name: '',
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

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ['name', 'email', 'password', 'phone', 'status'];
    if (step === 2) fieldsToValidate = ['project.name'];
    
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const onSubmit = (data: OnboardingValues) => {
    onSave(data);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
        </div>
        <Progress value={(step / totalSteps) * 100} className="h-2 bg-muted transition-all" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* STEP 1: ACCOUNT DETAILS */}
          {step === 1 && (
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <UserIcon size={20} />
                  </div>
                  <h3 className="text-2xl font-bold">Account Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} className="h-11" /></FormControl>
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
                        <FormControl><Input placeholder="john@example.com" type="email" {...field} className="h-11" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input placeholder="••••••••" {...field} className="h-11" />
                          </FormControl>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon" 
                            onClick={generatePassword}
                            className="h-11 w-11 shrink-0 border-primary/30 text-primary hover:bg-primary/10"
                            title="Generate Password"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormDescription>Min. 8 chars with letters, numbers and symbols.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl><Input placeholder="+1 (555) 000-0000" {...field} className="h-11" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select status" />
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
                  <FormField
                    control={form.control}
                    name="preferences.darkTheme"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-card/50 mt-8">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Enable Dark Theme</FormLabel>
                          <FormDescription>Set dark mode as the default experience for this account.</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: PROJECT */}
          {step === 2 && (
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                    <Briefcase size={20} />
                  </div>
                  <h3 className="text-2xl font-bold">Project Information</h3>
                </div>
                
                <FormField
                  control={form.control}
                  name="project.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl><Input placeholder="Internal CRM" {...field} className="h-11" /></FormControl>
                      <FormDescription>The main project this account will be associated with.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* STEP 3: PLATFORM */}
          {step === 3 && (
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <Smartphone size={20} />
                  </div>
                  <h3 className="text-2xl font-bold">Platform Configuration</h3>
                </div>
                
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="platform.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform Application Name</FormLabel>
                        <FormControl><Input placeholder="Customer Mobile App" {...field} className="h-11" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="platform.package_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Package Name / Bundle ID</FormLabel>
                        <FormControl><Input placeholder="com.company.app" {...field} className="h-11" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="platform.platform_type"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Supported Platforms</FormLabel>
                          <FormDescription>Select the target environments for this application.</FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {['android', 'apple'].map((type) => (
                            <FormField
                              key={type}
                              control={form.control}
                              name="platform.platform_type"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={type}
                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(type)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, type])
                                            : field.onChange(field.value?.filter((value) => value !== type))
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal capitalize cursor-pointer flex-1">
                                      {type}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
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
          )}

          <div className="flex items-center justify-between pt-8 border-t">
            <Button type="button" variant="ghost" onClick={step === 1 ? onCancel : prevStep} className="px-6">
              {step === 1 ? "Cancel" : <><ChevronLeft className="mr-2 h-4 w-4" /> Back</>}
            </Button>
            
            <div className="flex gap-3">
              {step < totalSteps ? (
                <Button type="button" onClick={nextStep} className="bg-primary text-background hover:bg-primary/90 font-bold px-8 h-11">
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="bg-secondary text-background hover:bg-secondary/90 font-bold px-10 h-11">
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Create Account
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
