"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, UserRole } from '@/lib/types'
import { SmartRoleTool } from './SmartRoleTool'
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface UserFormProps {
  formData: Partial<User>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<User>>>;
  onSave: (user: Partial<User>) => void;
  onCancel: () => void;
  submitLabel: string;
}

export function UserForm({ formData, setFormData, onSave, onCancel, submitLabel }: UserFormProps) {
  const handleApplyAI = (roles: string[], permissions: string[]) => {
    setFormData(prev => ({
      ...prev,
      roles: Array.from(new Set([...(prev.roles || []), ...roles])) as UserRole[],
      permissions: Array.from(new Set([...(prev.permissions || []), ...permissions]))
    }));
  };

  const removeRole = (roleToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      roles: (prev.roles || []).filter(r => r !== roleToRemove)
    }));
  };

  const removePermission = (permToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: (prev.permissions || []).filter(p => p !== permToRemove)
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs uppercase tracking-widest text-muted-foreground">Full Name</Label>
            <Input 
              id="name" 
              value={formData.name || ''} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              className="bg-background border-muted focus:ring-primary h-11"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              value={formData.email || ''} 
              onChange={e => setFormData({ ...formData, email: e.target.value })} 
              className="bg-background border-muted focus:ring-primary h-11"
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="text-xs uppercase tracking-widest text-muted-foreground">Job Title</Label>
            <Input 
              id="jobTitle" 
              value={formData.jobTitle || ''} 
              onChange={e => setFormData({ ...formData, jobTitle: e.target.value })} 
              placeholder="e.g. Senior Developer"
              className="bg-background border-muted focus:ring-primary h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department" className="text-xs uppercase tracking-widest text-muted-foreground">Department</Label>
            <Input 
              id="department" 
              value={formData.department || ''} 
              onChange={e => setFormData({ ...formData, department: e.target.value })} 
              placeholder="e.g. Engineering"
              className="bg-background border-muted focus:ring-primary h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status" className="text-xs uppercase tracking-widest text-muted-foreground">Account Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(v: any) => setFormData({ ...formData, status: v })}
            >
              <SelectTrigger className="bg-background border-muted h-11">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <Button variant="ghost" onClick={onCancel} className="text-muted-foreground hover:bg-muted px-6">Cancel</Button>
          <Button onClick={() => onSave(formData)} className="bg-primary text-background hover:bg-primary/90 font-bold px-8 h-11">
            {submitLabel}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <SmartRoleTool 
          jobTitle={formData.jobTitle || ''} 
          department={formData.department || ''} 
          onApply={handleApplyAI} 
        />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Assigned Roles</Label>
            <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-background/50 rounded-lg border border-dashed border-muted">
              {formData.roles?.length ? formData.roles.map(role => (
                <Badge key={role} variant="secondary" className="gap-1 bg-primary/20 text-primary border-primary/20 py-1.5 px-3">
                  {role}
                  <X className="h-3 w-3 cursor-pointer hover:text-foreground" onClick={() => removeRole(role)} />
                </Badge>
              )) : <span className="text-sm text-muted-foreground italic">No roles assigned</span>}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Permissions</Label>
            <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-background/50 rounded-lg border border-dashed border-muted">
              {formData.permissions?.length ? formData.permissions.map(perm => (
                <Badge key={perm} variant="outline" className="gap-1 border-secondary/40 text-secondary py-1 px-2 text-[10px]">
                  {perm}
                  <X className="h-2 w-2 cursor-pointer hover:text-foreground" onClick={() => removePermission(perm)} />
                </Badge>
              )) : <span className="text-sm text-muted-foreground italic">No specific permissions</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
