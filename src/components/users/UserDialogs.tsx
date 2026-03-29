"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { User } from '@/lib/types'
import { UserForm } from './UserForm'

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
    status: 'Active'
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
        status: 'Active'
      });
    }
  }, [initialUser, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-card border-border sm:rounded-xl overflow-hidden p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-primary font-headline text-3xl">
            Edit Account Profile
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-lg">
            Update account access and profile details.
          </DialogDescription>
        </DialogHeader>

        <UserForm 
          formData={formData} 
          setFormData={setFormData} 
          onSave={onSave} 
          onCancel={onClose} 
          submitLabel="Update Account" 
        />
      </DialogContent>
    </Dialog>
  );
}
