"use client";

import React, { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkspaceRole } from "@/types/planforge";
import { usePlanForge } from "@/lib/store";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
}

export function InviteMemberDialog({ open, onOpenChange, workspaceId }: InviteMemberDialogProps) {
  const { addMember, allUsers } = usePlanForge();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<WorkspaceRole>("member");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      await addMember(workspaceId, email.trim(), role);
      onOpenChange(false);
      setEmail("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit} className="relative">
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>Add a teammate to collaborate on goals, assign tasks, and track workload.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Email or Username *</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. dev@team.com or Rahul"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Workspace Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as WorkspaceRole)}
              className="w-full h-9 rounded-md border border-border bg-secondary/50 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="member">Member (Can view, edit tasks & comments)</option>
              <option value="admin">Admin (Can manage goals, milestones & members)</option>
              <option value="owner">Owner (Full workspace administrative rights)</option>
            </select>
          </div>

          <div className="p-3 bg-secondary/30 rounded-lg border border-border/60">
            <span className="text-[11px] font-semibold text-muted-foreground block mb-1.5 uppercase">
              Active Project Users:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {allUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setEmail(u.email)}
                  className="text-xs px-2 py-1 bg-secondary hover:bg-primary/20 hover:text-primary rounded border border-border transition-colors"
                >
                  {u.full_name} ({u.email.split("@")[0]})
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting} disabled={!email.trim()}>
            Send Invite
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
