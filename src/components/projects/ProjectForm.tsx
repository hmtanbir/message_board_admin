
"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, CheckCircle2 } from "lucide-react"

const projectSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  package_name: z.string().min(2, "Package name is required"),
  platform_type: z.array(z.string()).min(1, "Select at least one platform")
})

type ProjectFormValues = z.infer<typeof projectSchema>

interface ProjectFormProps {
  onSave: (data: ProjectFormValues) => void;
  onCancel: () => void;
}

export function ProjectForm({ onSave, onCancel }: ProjectFormProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      package_name: '',
      platform_type: []
    }
  });

  const onSubmit = (data: ProjectFormValues) => {
    onSave(data);
  };

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
            <div className="grid grid-cols-1 gap-5">
              <FormField
                control={form.control}
                name="name"
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
                name="package_name"
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
                name="platform_type"
                render={() => (
                  <FormItem>
                    <div className="mb-3">
                      <FormLabel className="text-sm font-semibold">Deployment Environments</FormLabel>
                      <FormDescription className="text-[10px]">Select target platforms for this project resource.</FormDescription>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
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
          <Button type="button" variant="ghost" onClick={onCancel} className="px-6 h-10 text-sm">
            Cancel
          </Button>
          <Button type="submit" className="bg-primary text-background hover:bg-primary/90 font-bold px-10 h-10">
            <CheckCircle2 className="mr-2 h-4 w-4" /> Initialize Project
          </Button>
        </div>
      </form>
    </Form>
  )
}
