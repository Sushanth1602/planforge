"use client";

import React, { useState } from "react";
import { Task, TaskStatus, PriorityLevel } from "@/types/planforge";
import { usePlanForge } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { TaskModal } from "@/components/tasks/task-modal";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { formatShortDate, isDateOverdue } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  Plus,
  Calendar,
  CheckSquare,
  MessageSquare,
  MoveRight,
  MoveLeft,
  Filter,
} from "lucide-react";
import { StatusBadge, GlassCard, GlassPanel } from "@/components/ui/cinematic";

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: "backlog", label: "BACKLOG", color: "text-slate-400 bg-slate-500/5" },
  { id: "todo", label: "TO DO", color: "text-amber-400 bg-amber-500/5" },
  { id: "in_progress", label: "IN PROGRESS", color: "text-blue-400 bg-blue-500/5" },
  { id: "review", label: "REVIEW", color: "text-purple-400 bg-purple-500/5" },
  { id: "done", label: "DONE", color: "text-emerald-400 bg-emerald-500/5" },
];

export function KanbanBoard({ workspaceId }: { workspaceId: string }) {
  const { tasks, moveTaskStatus, allUsers, milestones, comments } = usePlanForge();

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [createColumnStatus, setCreateColumnStatus] = useState<TaskStatus | null>(null);
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const workspaceTasks = tasks.filter((t) => {
    if (t.workspace_id !== workspaceId) return false;
    if (filterAssignee !== "all" && t.assigned_to !== filterAssignee) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    return true;
  });

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    moveTaskStatus(taskId, newStatus);
    if (newStatus === "done") {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch {}
    }
  };

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    const order: TaskStatus[] = ["backlog", "todo", "in_progress", "review", "done"];
    const idx = order.indexOf(current);
    return idx < order.length - 1 ? order[idx + 1] : null;
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    const order: TaskStatus[] = ["backlog", "todo", "in_progress", "review", "done"];
    const idx = order.indexOf(current);
    return idx > 0 ? order[idx - 1] : null;
  };

  return (
    <div className="flex flex-col h-full space-y-4 animate-cinematic-in">
      {/* Board Controls & Filters */}
      <div className="flex items-center justify-between gap-3 flex-wrap bg-white/[0.015] border border-white/5 p-3 rounded-2xl">
        <div className="flex items-center gap-2.5 text-xs">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-semibold text-white">Filters:</span>

          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="h-8 rounded-lg border border-white/8 bg-[#080B12] px-2.5 text-xs text-white focus:outline-none focus:border-blue-500/40"
          >
            <option value="all">All Assignees</option>
            {allUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.full_name}
              </option>
            ))}
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="h-8 rounded-lg border border-white/8 bg-[#080B12] px-2.5 text-xs text-white focus:outline-none focus:border-blue-500/40"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-white">{workspaceTasks.length}</span> tasks
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4 items-start scrollbar-thin">
        {COLUMNS.map((col) => {
          const colTasks = workspaceTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="flex flex-col bg-white/[0.01] rounded-2xl border border-white/5 p-3.5 min-w-[260px] max-h-[calc(100vh-210px)]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full border border-white/5 ${col.color}`}>
                    {col.label}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground font-mono">
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => setCreateColumnStatus(col.id)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
                  title={`Add task to ${col.label}`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 overflow-y-auto pr-1 flex-1 min-h-[120px] scrollbar-thin">
                {colTasks.length === 0 ? (
                  <div className="h-24 flex items-center justify-center border border-dashed border-white/5 rounded-xl text-xs text-muted-foreground/40 italic">
                    No tasks
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const assignee = allUsers.find((u) => u.id === task.assigned_to);
                    const milestone = milestones.find((m) => m.id === task.milestone_id);
                    const taskCommentsCount = comments.filter((c) => c.task_id === task.id).length;
                    const subtasks = task.subtasks || [];
                    const completedSubtasks = subtasks.filter((s) => s.is_completed).length;
                    const isOverdue = isDateOverdue(task.due_date, task.status === "done");
                    const prevStatus = getPrevStatus(task.status);
                    const nextStatus = getNextStatus(task.status);

                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        className="liquid-glass rounded-xl p-3.5 hover:border-blue-500/20 cursor-pointer group relative select-none"
                      >
                        {/* Tags and Priority */}
                        <div className="flex items-center justify-between gap-1.5 mb-2">
                          <StatusBadge value={task.priority} />

                          {task.tags && task.tags.length > 0 && (
                            <span className="text-[9px] font-semibold px-2 py-0.2 rounded bg-white/5 text-muted-foreground truncate max-w-[85px] border border-white/5">
                              {task.tags[0].name}
                            </span>
                          )}
                        </div>

                        {/* Task Title */}
                        <h4 className="text-[12px] font-semibold text-white line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors leading-snug">
                          {task.title}
                        </h4>

                        {/* Milestone Tag */}
                        {milestone && (
                          <div className="text-[10px] text-muted-foreground truncate mb-3 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                            <span className="truncate">{milestone.title}</span>
                          </div>
                        )}

                        {/* Card Footer: Due date, Subtasks, Comments, Assignee */}
                        <div className="flex items-center justify-between pt-2.5 border-t border-white/5 text-[10px] text-muted-foreground font-mono">
                          <div className="flex items-center gap-2">
                            {task.due_date && (
                              <div
                                className={`flex items-center gap-1 font-medium ${
                                  isOverdue ? "text-red-400 font-bold" : ""
                                }`}
                              >
                                <Calendar className="h-3 w-3" />
                                <span>{formatShortDate(task.due_date)}</span>
                              </div>
                            )}

                            {subtasks.length > 0 && (
                              <div className="flex items-center gap-0.5">
                                <CheckSquare className="h-3 w-3" />
                                <span>
                                  {completedSubtasks}/{subtasks.length}
                                </span>
                              </div>
                            )}

                            {taskCommentsCount > 0 && (
                              <div className="flex items-center gap-0.5">
                                <MessageSquare className="h-3 w-3" />
                                <span>{taskCommentsCount}</span>
                              </div>
                            )}
                          </div>

                          <Avatar src={assignee?.avatar_url} name={assignee?.full_name || "Unassigned"} size="xs" className="border border-white/10" />
                        </div>

                        {/* Quick Hover Move Buttons */}
                        <div
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-[#080B12]/90 backdrop-blur-sm p-1 rounded-lg border border-white/8 shadow-2xl"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {prevStatus && (
                            <button
                              onClick={() => handleStatusChange(task.id, prevStatus)}
                              title={`Move back to ${prevStatus}`}
                              className="p-1 hover:bg-white/5 rounded-md text-muted-foreground hover:text-white transition-all"
                            >
                              <MoveLeft className="h-3 w-3" />
                            </button>
                          )}
                          {nextStatus && (
                            <button
                              onClick={() => handleStatusChange(task.id, nextStatus)}
                              title={`Advance to ${nextStatus}`}
                              className="p-1 hover:bg-white/5 rounded-md text-muted-foreground hover:text-blue-400 transition-all"
                            >
                              <MoveRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Detail Modal */}
      {selectedTaskId && (
        <TaskModal
          taskId={selectedTaskId}
          open={Boolean(selectedTaskId)}
          onOpenChange={(open) => !open && setSelectedTaskId(null)}
        />
      )}

      {/* Quick Add Dialog */}
      {createColumnStatus && (
        <CreateTaskDialog
          open={Boolean(createColumnStatus)}
          onOpenChange={(open) => !open && setCreateColumnStatus(null)}
          defaultWorkspaceId={workspaceId}
          defaultStatus={createColumnStatus}
        />
      )}
    </div>
  );
}
