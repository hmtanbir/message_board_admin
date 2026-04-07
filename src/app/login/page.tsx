"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { LogIn, ShieldCheck, Mail, Lock, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = (await api.post("/sessions", {
        user: { email, password },
      })) as { data?: { token?: string }; message?: string };

      if (response && response.data) {
        localStorage.setItem(
          "auth_token",
          response.data.token || JSON.stringify(response.data),
        );
      }

      router.push("/");

      toast({
        title: "Authentication Successful",
        description:
          response.message || "Welcome to MessageAdmin. Redirecting...",
        variant: "success",
      });
    } catch (error: unknown) {
      setLoading(false);
      const errorMessage =
        error instanceof Error ? error.message : "Invalid credentials";
      toast({
        title: "Authentication Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700" />

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl mb-4 group hover:rotate-6 transition-transform">
            <ShieldCheck className="text-background h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-primary">
            Message<span className="text-foreground">Admin</span>
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Message Board Admin Console
          </p>
        </div>

        <Card className="border-border bg-card/50 shadow-2xl backdrop-blur-xl border-primary/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Authentication
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Provide your credentials to establish a secure session
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs uppercase tracking-widest text-muted-foreground font-bold"
                >
                  Email
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@message.internal"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-background/50 border-muted focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-xs uppercase tracking-widest text-muted-foreground font-bold"
                  >
                    Password
                  </Label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 bg-background/50 border-muted focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-6">
              <Button
                type="submit"
                className="w-full h-12 bg-primary text-background hover:bg-primary/90 font-black text-lg shadow-[0_0_20px_rgba(var(--primary),0.3)] group"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    Authorize Entry
                  </>
                )}
              </Button>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 uppercase tracking-widest justify-center">
                <div className="h-px w-8 bg-muted" />
                <span>Encrypted AES-256 Protocol</span>
                <div className="h-px w-8 bg-muted" />
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
