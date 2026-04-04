"use client";

import React, { useState } from "react";

import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";

import {
  smartRoleAssignmentTool,
  type SmartRoleAssignmentToolOutput,
} from "@/ai/flows/smart-role-assignment-tool-flow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SmartRoleToolProps {
  jobTitle: string;
  department: string;
  onApply: (roles: string[], permissions: string[]) => void;
}

export function SmartRoleTool({
  jobTitle,
  department,
  onApply,
}: SmartRoleToolProps) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] =
    useState<SmartRoleAssignmentToolOutput | null>(null);

  const handleSuggest = async () => {
    if (!jobTitle && !department) return;
    setLoading(true);
    try {
      const result = await smartRoleAssignmentTool({
        jobTitle,
        departmentDescription: department,
      });
      setSuggestion(result);
    } catch (error) {
      console.error("AI Suggestion failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border border-secondary/20 rounded-lg bg-secondary/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold text-primary">
            AI Role Assistant
          </h4>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSuggest}
          disabled={loading || (!jobTitle && !department)}
          className="border-primary text-primary hover:bg-primary hover:text-background"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Suggest Roles"
          )}
        </Button>
      </div>

      {suggestion ? (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
          <Alert className="bg-background/50 border-primary/20">
            <AlertTitle className="text-primary text-xs uppercase tracking-wider">
              Reasoning
            </AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground italic">
              &quot;{suggestion.reasoning}&quot;
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Suggested Roles
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestion.suggestedRoles.map((role) => (
                <Badge
                  key={role}
                  variant="secondary"
                  className="bg-primary text-background border-none"
                >
                  {role}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Suggested Permissions
            </p>
            <div className="flex flex-wrap gap-1">
              {suggestion.suggestedPermissions.map((perm) => (
                <Badge
                  key={perm}
                  variant="outline"
                  className="text-secondary border-secondary/30 text-[10px]"
                >
                  {perm}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            className="w-full bg-secondary text-background hover:bg-secondary/80 font-semibold"
            onClick={() =>
              onApply(
                suggestion.suggestedRoles,
                suggestion.suggestedPermissions,
              )
            }
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Apply AI Suggestions
          </Button>
        </div>
      ) : null}
    </div>
  );
}
