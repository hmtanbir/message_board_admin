"use client";

import React, { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  User as UserIcon,
  RefreshCw,
  CheckCircle2,
  Globe,
  Loader2,
  Phone,
  Lock,
} from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type User } from "@/lib/types";

// Maps for converting between display values and API values
const LANGUAGE_TO_DISPLAY: Record<string, string> = {
  en: "English",
  fr: "French",
  es: "Spanish",
  zh: "Chinese",
  ja: "Japanese",
};

const THEME_TO_DISPLAY: Record<string, string> = {
  light: "Light",
  dark: "Dark",
  Light: "Light",
  Dark: "Dark",
};

const SUBSCRIPTION_TO_DISPLAY: Record<string, string> = {
  basic: "Basic",
  standard: "Standard",
  premium: "Premium",
};

const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .refine((val) => val === "" || (val.length >= 10 && /^\+/.test(val)), {
      message: "Phone must be 10+ chars starting with '+' (e.g. +1...)",
    }),
  status: z.enum(["Active", "Inactive"]),
  subscription: z.enum(["Basic", "Standard", "Premium"]),
  preferences: z.object({
    theme: z.enum(["Light", "Dark"]),
    language: z.enum(["English", "French", "Spanish", "Chinese", "Japanese"]),
  }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  initialUser?: User | null;
  onSave: (data: Partial<User>) => void | Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

function deriveStatusDisplay(status: string): "Active" | "Inactive" {
  return status?.toLowerCase() === "active" ? "Active" : "Inactive";
}

function deriveLanguageDisplay(
  lang: string,
): "English" | "French" | "Spanish" | "Chinese" | "Japanese" {
  return (LANGUAGE_TO_DISPLAY[lang] || "English") as
    | "English"
    | "French"
    | "Spanish"
    | "Chinese"
    | "Japanese";
}

function deriveThemeDisplay(theme: string): "Light" | "Dark" {
  return (THEME_TO_DISPLAY[theme] || "Light") as "Light" | "Dark";
}

function deriveSubscriptionDisplay(
  sub: string,
): "Basic" | "Standard" | "Premium" {
  return (SUBSCRIPTION_TO_DISPLAY[sub?.toLowerCase()] || "Basic") as
    | "Basic"
    | "Standard"
    | "Premium";
}

export function UserForm({
  initialUser,
  onSave,
  onCancel,
  isSubmitting = false,
}: UserFormProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: initialUser?.name || "",
      email: initialUser?.email || "",
      password: "",
      phone: initialUser?.phone || "",
      status: deriveStatusDisplay(initialUser?.status || "Active"),
      subscription: deriveSubscriptionDisplay(
        initialUser?.subscription || "Basic",
      ),
      preferences: {
        theme: deriveThemeDisplay(initialUser?.preferences?.theme || "Light"),
        language: deriveLanguageDisplay(
          initialUser?.preferences?.language || "en",
        ),
      },
    },
  });

  useEffect(() => {
    if (initialUser) {
      form.reset({
        name: initialUser.name,
        email: initialUser.email,
        password: "",
        phone: initialUser.phone || "",
        status: deriveStatusDisplay(initialUser.status),
        subscription: deriveSubscriptionDisplay(
          initialUser.subscription || "Basic",
        ),
        preferences: {
          theme: deriveThemeDisplay(initialUser.preferences?.theme || "Light"),
          language: deriveLanguageDisplay(
            initialUser.preferences?.language || "en",
          ),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUser?.appwrite_user_id, form]);

  const generatePassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    const length = 14;
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    form.setValue("password", password, { shouldValidate: true });
  };

  const onSubmit = (data: UserFormValues) => {
    onSave(data as unknown as Partial<User>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 items-start">
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
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="h-10"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        Email Address
                        {!!initialUser && (
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john@example.com"
                          type="email"
                          {...field}
                          className="h-10"
                          readOnly={!!initialUser}
                          disabled={!!initialUser}
                        />
                      </FormControl>
                      {!!initialUser && (
                        <FormDescription className="text-[10px]">
                          Email cannot be changed after account creation.
                        </FormDescription>
                      )}
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
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input
                            placeholder="+1234567890"
                            type="tel"
                            {...field}
                            className="h-10 pl-10"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                      </div>
                      <FormDescription className="text-[10px]">
                        Optional. Must start with &apos;+&apos; followed by
                        country code.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {initialUser
                          ? "Update Password (Optional)"
                          : "Password"}
                      </FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder={
                              initialUser
                                ? "Leave blank to keep current"
                                : "••••••••"
                            }
                            {...field}
                            className="h-10"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={generatePassword}
                          disabled={isSubmitting}
                          className="h-10 w-10 shrink-0 border-primary/30 text-primary hover:bg-primary/10"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
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
                        <FormLabel>Plan</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Basic">Basic</SelectItem>
                            <SelectItem value="Standard">Standard</SelectItem>
                            <SelectItem value="Premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
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
                          <FormLabel className="text-[10px]">
                            Language
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isSubmitting}
                          >
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
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isSubmitting}
                          >
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
        </div>

        <div className="flex items-center justify-end gap-4 pt-8 border-t">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="px-6 h-10 text-sm"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary text-background hover:bg-primary/90 font-bold px-10 h-10"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes…
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
