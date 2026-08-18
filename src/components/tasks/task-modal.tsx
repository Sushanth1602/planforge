"use client";

import React, { useState } from "react";
import { Dialog, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Task, TaskStatus, PriorityLevel } from "@/types/planforge";
import { usePlanForge } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { formatDate, formatRelativeTime, isDateOverdue, getPriorityColor } from "@/lib/utils";
import {
  Calendar,
  Clock,
  Trash2,
  Send,
  CheckCircle2,
  Circle,
  Plus,
  Tag as TagIcon,
  Layers,
  Flag,
} from "lucide-react";

interface TaskModalProps {
  taskId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskModal({ taskId, open, onOpenChange }: TaskModalProps) {
  const {
    tasks,
    updateTask,
    moveTaskStatus,
    deleteTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    comments,
    addComment,
    members,
    allUsers,
    goals,
    milestones,
    workspaces,
  } = usePlanForge();

  const task = tasks.find((t) => t.id === taskId);

  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [newCommentContent, setNewCommentContent] = useState("");

  if (!task) return null;

  const currentWorkspace = workspaces.find((w) => w.id === task.workspace_id);
  const currentGoal = goals.find((g) => g.id === task.goal_id);
  const currentMilestone = milestones.find((m) => m.id === task.milestone_id);
  const currentAssignee = allUsers.find((u) => u.id === task.assigned_to);
  const taskComments = comments.filter((c) => c.task_id === task.id);
  const currentMembers = members.filter((m) => m.workspace_id === task.workspace_id);

  const statuses: { id: TaskStatus; label: string }[] = [
    { id: "backlog", label: "Backlog" },
    { id: "todo", label: "To Do" },
    { id: "in_progress", label: "In Progress" },
    { id: "review", label: "Review" },
    { id: "done", label: "Done" },
  ];

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    await addSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle("");
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentContent.trim()) return;
    await addComment(task.id, newCommentContent.trim());
    setNewCommentContent("");
  };

  const isOverdue = isDateOverdue(task.due_date, task.status === "done");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="relative -m-6 max-h-[85vh] flex flex-col">
        <DialogClose onClose={() => onOpenChange(false)} />

        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-border bg-secondary/20 flex flex-wrap items-center justify-between gap-3 pr-12">
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <span>{currentWorkspace?.name || "Workspace"}</span>
            {currentGoal && (
              <>
                <span>&rsaquo;</span>
                <span className="flex items-center gap-1 text-foreground">
                  <Layers className="h-3 w-3" /> {currentGoal.title}
                </span>
              </>
            )}
            {currentMilestone && (
              <>
                <span>&rsaquo;</span>
                <span className="flex items-center gap-1 text-primary">
                  <Flag className="h-3 w-3" /> {currentMilestone.title}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Title & Status Bar */}
          <div>
            <Input
              value={task.title}
              onChange={(e) => updateTask(task.id, { title: e.target.value })}
              className="text-lg font-bold border-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-b h-auto py-1"
            />

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              <span className="text-xs text-muted-foreground mr-1">Status:</span>
              {statuses.map((s) => (
                <button
                  key={s.id}
                  onClick={() => moveTaskStatus(task.id, s.id)}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                    task.status === s.id
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Key Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-lg bg-secondary/30 border border-border/60 text-xs">
            <div>
              <span className="text-muted-foreground block text-[11px] mb-1">Priority</span>
              <select
                value={task.priority}
                onChange={(e) => updateTask(task.id, { priority: e.target.value as PriorityLevel })}
                className={`w-full rounded border px-2 py-1 bg-secondary text-xs font-medium focus:outline-none ${getPriorityColor(
                  task.priority
                )}`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <span className="text-muted-foreground block text-[11px] mb-1">Assignee</span>
              <select
                value={task.assigned_to || ""}
                onChange={(e) => updateTask(task.id, { assigned_to: e.target.value || null })}
                className="w-full rounded border border-border px-2 py-1 bg-secondary text-xs text-foreground focus:outline-none"
              >
                <option value="">Unassigned</option>
                {currentMembers.map((m) => {
                  const u = allUsers.find((user) => user.id === m.user_id) || m.profile;
                  return (
                    <option key={m.user_id} value={m.user_id}>
                      {u?.full_name || u?.email}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <span className="text-muted-foreground block text-[11px] mb-1">Due Date</span>
              <input
                type="date"
                value={task.due_date ? task.due_date.split("T")[0] : ""}
                onChange={(e) => updateTask(task.id, { due_date: e.target.value || null })}
                className={`w-full rounded border px-2 py-1 bg-secondary text-xs focus:outline-none ${
                  isOverdue ? "text-red-400 border-red-500/50" : "text-foreground border-border"
                }`}
              />
            </div>

            <div>
              <span className="text-muted-foreground block text-[11px] mb-1">Est. Hours</span>
              <input
                type="number"
                step="0.5"
                value={task.estimated_hours || 0}
                onChange={(e) => updateTask(task.id, { estimated_hours: Number(e.target.value) || 0 })}
                className="w-full rounded border border-border px-2 py-1 bg-secondary text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5 uppercase tracking-wider">
              Description
            </label>
            <Textarea
              value={task.description || ""}
              onChange={(e) => updateTask(task.id, { description: e.target.value })}
              placeholder="Add details, links, or notes..."
              rows={3}
              className="text-xs"
            />
          </div>

          {/* Subtasks Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Subtasks ({task.subtasks?.filter((s) => s.is_completed).length || 0}/
                {task.subtasks?.length || 0})
              </label>
            </div>

            <div className="space-y-1.5">
              {(task.subtasks || []).map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center justify-between p-2 rounded-md bg-secondary/40 hover:bg-secondary/70 border border-border/40 group text-xs transition-colors"
                >
                  <button
                    onClick={() => toggleSubtask(task.id, subtask.id)}
                    className="flex items-center gap-2 text-left flex-1 min-w-0"
                  >
                    {subtask.is_completed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <span
                      className={`truncate ${
                        subtask.is_completed ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {subtask.title}
                    </span>
                  </button>
                  <button
                    onClick={() => deleteSubtask(task.id, subtask.id)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 p-1 transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              <form onSubmit={handleAddSubtask} className="flex gap-2 pt-1">
                <Input
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="Add a checklist item..."
                  className="h-8 text-xs"
                />
                <Button type="submit" size="sm" variant="secondary" disabled={!newSubtaskTitle.trim()}>
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </form>
            </div>
          </div>

          {/* Activity / Comments Stream */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-2 uppercase tracking-wider">
              Discussion & Comments ({taskComments.length})
            </label>

            <div className="space-y-3 mb-3">
              {taskComments.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-2">No comments yet. Start the conversation.</p>
              ) : (
                taskComments.map((comment) => {
                  const author = allUsers.find((u) => u.id === comment.user_id) || comment.user;
                  return (
                    <div key={comment.id} className="flex items-start gap-2.5 p-3 rounded-lg bg-secondary/30 border border-border/40 text-xs">
                      <Avatar src={author?.avatar_url} name={author?.full_name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-semibold text-foreground">{author?.full_name || "Team Member"}</span>
                          <span className="text-[10px] text-muted-foreground">{formatRelativeTime(comment.created_at)}</span>
                        </div>
                        <p className="text-foreground leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <Input
                value={newCommentContent}
                onChange={(e) => setNewCommentContent(e.target.value)}
                placeholder="Write an update, question, or note..."
                className="h-9 text-xs"
              />
              <Button type="submit" size="sm" disabled={!newCommentContent.trim()}>
                <Send className="h-3.5 w-3.5 mr-1" /> Send
              </Button>
            </form>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-border bg-secondary/20 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm("Are you sure you want to delete this task?")) {
                deleteTask(task.id);
                onOpenChange(false);
              }
            }}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Task
          </Button>

          <Button size="sm" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
