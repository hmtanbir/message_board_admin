"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, UserRole } from '@/lib/types'
import { SmartRoleTool } from './SmartRoleTool'
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<User>) => void;
  initialUser?: User | null;
}

export function UserDialog({ isOpen, onClose, onSave, initialUser }: UserDialogProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    jobTitle: '',
    department: '',
    roles: [],
    permissions: [],
    status: 'Pending'
  });

  useEffect(() => {
    if (initialUser) {
      setFormData(initialUser);
    } else {
      setFormData({
        name: '',
        email: '',
        jobTitle: '',
        department: '',
        roles: [],
        permissions: [],
        status: 'Pending'
      });
    }
  }, [initialUser, isOpen]);

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border sm:rounded-xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-primary font-headline text-2xl">
            {initialUser ? 'Edit User Profile' : 'Add New User'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Complete the form below to manage user access and profile details.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs uppercase tracking-widest text-muted-foreground">Full Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                className="bg-background border-muted focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email} 
                onChange={e => setFormData({ ...formData, email: e.target.value })} 
                className="bg-background border-muted focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-xs uppercase tracking-widest text-muted-foreground">Job Title</Label>
              <Input 
                id="jobTitle" 
                value={formData.jobTitle} 
                onChange={e => setFormData({ ...formData, jobTitle: e.target.value })} 
                placeholder="e.g. Senior Developer"
                className="bg-background border-muted focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department" className="text-xs uppercase tracking-widest text-muted-foreground">Department</Label>
              <Input 
                id="department" 
                value={formData.department} 
                onChange={e => setFormData({ ...formData, department: e.target.value })} 
                placeholder="e.g. Engineering"
                className="bg-background border-muted focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-xs uppercase tracking-widest text-muted-foreground">Account Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(v: any) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger className="bg-background border-muted">
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

          <div className="space-y-6">
            <SmartRoleTool 
              jobTitle={formData.jobTitle || ''} 
              department={formData.department || ''} 
              onApply={handleApplyAI} 
            />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Assigned Roles</Label>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-background/50 rounded-md border border-dashed border-muted">
                  {formData.roles?.length ? formData.roles.map(role => (
                    <Badge key={role} variant="secondary" className="gap-1 bg-primary/20 text-primary border-primary/20">
                      {role}
                      <X className="h-3 w-3 cursor-pointer hover:text-foreground" onClick={() => removeRole(role)} />
                    </Badge>
                  )) : <span className="text-xs text-muted-foreground italic">No roles assigned</span>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Permissions</Label>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-background/50 rounded-md border border-dashed border-muted">
                  {formData.permissions?.length ? formData.permissions.map(perm => (
                    <Badge key={perm} variant="outline" className="gap-1 border-secondary/40 text-secondary text-[10px]">
                      {perm}
                      <X className="h-2 w-2 cursor-pointer hover:text-foreground" onClick={() => removePermission(perm)} />
                    </Badge>
                  )) : <span className="text-xs text-muted-foreground italic">No specific permissions</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-muted/50 -mx-6 -mb-6 p-6 gap-2">
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:bg-muted">Cancel</Button>
          <Button onClick={() => onSave(formData)} className="bg-primary text-background hover:bg-primary/90 font-bold px-8">
            {initialUser ? 'Update Profile' : 'Create User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}