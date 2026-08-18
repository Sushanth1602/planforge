"use client";

import React, { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { PriorityLevel } from "@/types/planforge";
import { usePlanForge } from "@/lib/store";

interface CreateGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
}

export function CreateGoalDialog({ open, onOpenChange, workspaceId }: CreateGoalDialogProps) {
  const { createGoal } = usePlanForge();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<PriorityLevel>("high");
  const [targetDate, setTargetDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await createGoal(workspaceId, title.trim(), description.trim(), priority, targetDate || undefined);
      onOpenChange(false);
      setTitle("");
      setDescription("");
    } catch (error: any) {
      console.error("Failed to create goal:", {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit} className="relative">
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>Add High-Level Goal</DialogTitle>
          <DialogDescription>
            What is the major objective for this workspace? (e.g. Build AI Resume Analyzer Engine)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Goal Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build AI Resume Analyzer Engine"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail what success looks like for this goal..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full h-9 rounded-md border border-border bg-secondary/50 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Target Date</label>
              <Input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting} disabled={!title.trim()}>
            Create Goal
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

interface CreateMilestoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalId: string;
  workspaceId: string;
}

export function CreateMilestoneDialog({ open, onOpenChange, goalId, workspaceId }: CreateMilestoneDialogProps) {
  const { createMilestone } = usePlanForge();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await createMilestone(goalId, workspaceId, title.trim(), description.trim(), dueDate || undefined);
      onOpenChange(false);
      setTitle("");
      setDescription("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit} className="relative">
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>Add Milestone</DialogTitle>
          <DialogDescription>
            Milestones break down goals into concrete checkpoints (e.g. 1. Architecture Spec, 2. AI Pipeline).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Milestone Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 2. Backend Vector Search & Embeddings"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key deliverable or acceptance criteria..."
              rows={2}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Due Date</label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting} disabled={!title.trim()}>
            Create Milestone
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
