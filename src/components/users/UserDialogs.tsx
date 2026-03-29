"use client"

import React from 'react'
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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-card border-border sm:rounded-2xl overflow-hidden p-0">
        <div className="p-8 border-b bg-muted/20">
          <DialogHeader>
            <DialogTitle className="text-primary font-headline text-3xl">
              Edit Account Profile
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-lg">
              Update account details, project associations, and platform configurations.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8">
          <UserForm 
            initialUser={initialUser} 
            onSave={onSave} 
            onCancel={onClose} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
