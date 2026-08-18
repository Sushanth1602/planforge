"use client";

import React, { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { PriorityLevel, TaskStatus } from "@/types/planforge";
import { usePlanForge } from "@/lib/store";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultWorkspaceId?: string;
  defaultStatus?: TaskStatus;
}

export function CreateTaskDialog({ open, onOpenChange, defaultWorkspaceId, defaultStatus = "todo" }: CreateTaskDialogProps) {
  const { workspaces, goals, milestones, members, allUsers, createTask, activeWorkspaceId } = usePlanForge();

  const initialWsId = defaultWorkspaceId || activeWorkspaceId || workspaces[0]?.id || "";
  const [workspaceId, setWorkspaceId] = useState(initialWsId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalId, setGoalId] = useState("");
  const [milestoneId, setMilestoneId] = useState("");
  const [priority, setPriority] = useState<PriorityLevel>("medium");
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [dueDate, setDueDate] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("3");
  const [assignedTo, setAssignedTo] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter goals and milestones according to selected workspace
  const currentGoals = goals.filter((g) => g.workspace_id === workspaceId);
  const currentMilestones = milestones.filter((m) => m.workspace_id === workspaceId && (!goalId || m.goal_id === goalId));
  const currentMembers = members.filter((m) => m.workspace_id === workspaceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !workspaceId) return;

    setIsSubmitting(true);
    try {
      const tags = tagInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => ({ name: t, color: "#6366f1" }));

      await createTask({
        workspace_id: workspaceId,
        title: title.trim(),
        description: description.trim(),
        goal_id: goalId || null,
        milestone_id: milestoneId || null,
        priority,
        status,
        due_date: dueDate || null,
        estimated_hours: Number(estimatedHours) || 2,
        assigned_to: assignedTo || null,
        tags,
      });

      onOpenChange(false);
      setTitle("");
      setDescription("");
      setTagInput("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit} className="relative">
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>Define an executable task, assign team members, and link to a milestone.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5 py-2 max-h-[65vh] overflow-y-auto pr-1">
          {/* Workspace Selector */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Workspace *</label>
            <select
              value={workspaceId}
              onChange={(e) => {
                setWorkspaceId(e.target.value);
                setGoalId("");
                setMilestoneId("");
              }}
              className="w-full h-9 rounded-md border border-border bg-secondary/50 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              required
            >
              {workspaces.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.type})
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Task Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement OpenAI embeddings vector pipeline"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, acceptance criteria, or links..."
              rows={2}
            />
          </div>

          {/* Goal and Milestone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Goal (Optional)</label>
              <select
                value={goalId}
                onChange={(e) => {
                  setGoalId(e.target.value);
                  setMilestoneId("");
                }}
                className="w-full h-9 rounded-md border border-border bg-secondary/50 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">-- No Goal --</option>
                {currentGoals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Milestone (Optional)</label>
              <select
                value={milestoneId}
                onChange={(e) => setMilestoneId(e.target.value)}
                className="w-full h-9 rounded-md border border-border bg-secondary/50 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">-- No Milestone --</option>
                {currentMilestones.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority & Status */}
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
                <option value="urgent">Urgent ⚡</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full h-9 rounded-md border border-border bg-secondary/50 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Assignee & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Assign To</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full h-9 rounded-md border border-border bg-secondary/50 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Unassigned</option>
                {currentMembers.map((m) => {
                  const u = allUsers.find((user) => user.id === m.user_id) || m.profile;
                  return (
                    <option key={m.user_id} value={m.user_id}>
                      {u?.full_name || u?.email} ({m.role})
                    </option>
                  );
                })}
              </select>
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

          {/* Estimated Hours & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Estimated Hours</label>
              <Input
                type="number"
                min="0.5"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Tags (Comma-separated)</label>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="AI/ML, Frontend, Urgent"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting} disabled={!title.trim()}>
            Create Task
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
