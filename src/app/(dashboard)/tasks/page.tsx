"use client";

import React, { useState } from "react";
import { usePlanForge } from "@/lib/store";
import { TaskModal } from "@/components/tasks/task-modal";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  formatShortDate,
  getPriorityColor,
  isDateOverdue,
  isDateToday,
} from "@/lib/utils";
import {
  CheckSquare,
  Plus,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  Search,
} from "lucide-react";

type FilterType = "all" | "today" | "upcoming" | "overdue" | "completed";
type SortType = "due_date" | "priority" | "workspace" | "status";

export default function MyTasksPage() {
  const { tasks, workspaces, currentUser, moveTaskStatus } = usePlanForge();

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeSort, setActiveSort] = useState<SortType>("due_date");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    // Search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    const isOverdue = isDateOverdue(task.due_date, task.status === "done");
    const isToday = isDateToday(task.due_date);

    switch (activeFilter) {
      case "today":
        return task.status !== "done" && isToday;
      case "upcoming":
        return task.status !== "done" && !isOverdue && !isToday && task.due_date;
      case "overdue":
        return isOverdue;
      case "completed":
        return task.status === "done";
      case "all":
      default:
        return true;
    }
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (activeSort === "due_date") {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    if (activeSort === "priority") {
      const pWeights = { urgent: 4, high: 3, medium: 2, low: 1 };
      return (pWeights[b.priority] || 0) - (pWeights[a.priority] || 0);
    }
    if (activeSort === "workspace") {
      const wsA = workspaces.find((w) => w.id === a.workspace_id)?.name || "";
      const wsB = workspaces.find((w) => w.id === b.workspace_id)?.name || "";
      return wsA.localeCompare(wsB);
    }
    if (activeSort === "status") {
      const sWeights = { in_progress: 4, todo: 3, review: 2, backlog: 1, done: 0 };
      return (sWeights[b.status] || 0) - (sWeights[a.status] || 0);
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary" /> My Task Execution Center
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Filter, sort, and complete your assigned milestones and action items.
          </p>
        </div>

        <Button size="sm" onClick={() => setIsCreateTaskOpen(true)} className="gap-1.5">
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </Button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-card/60 p-3 rounded-xl border border-border">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(
            [
              { id: "all", label: "All", count: tasks.length },
              {
                id: "today",
                label: "Today",
                count: tasks.filter((t) => t.status !== "done" && isDateToday(t.due_date)).length,
              },
              {
                id: "upcoming",
                label: "Upcoming",
                count: tasks.filter(
                  (t) => t.status !== "done" && !isDateOverdue(t.due_date) && !isDateToday(t.due_date) && t.due_date
                ).length,
              },
              {
                id: "overdue",
                label: "Overdue",
                count: tasks.filter((t) => isDateOverdue(t.due_date, t.status === "done")).length,
              },
              {
                id: "completed",
                label: "Completed",
                count: tasks.filter((t) => t.status === "done").length,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                activeFilter === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeFilter === tab.id ? "bg-primary-foreground/20 text-white" : "bg-secondary text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="h-8 w-full pl-8 pr-2 rounded-md border border-border bg-secondary text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value as SortType)}
              className="h-8 rounded-md border border-border bg-secondary px-2 text-xs text-foreground focus:outline-none"
            >
              <option value="due_date">Sort: Due Date</option>
              <option value="priority">Sort: Priority</option>
              <option value="workspace">Sort: Workspace</option>
              <option value="status">Sort: Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Table / Card List */}
      <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border/60 shadow-sm">
        {sortedTasks.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            <CheckCircle2 className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            No tasks found in this view.
          </div>
        ) : (
          sortedTasks.map((task) => {
            const ws = workspaces.find((w) => w.id === task.workspace_id);
            const isOverdue = isDateOverdue(task.due_date, task.status === "done");

            return (
              <div
                key={task.id}
                onClick={() => setSelectedTaskId(task.id)}
                className="p-4 flex items-center justify-between gap-4 hover:bg-secondary/40 transition-colors cursor-pointer text-xs group"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveTaskStatus(task.id, task.status === "done" ? "todo" : "done");
                    }}
                    className="text-muted-foreground hover:text-emerald-400 shrink-0"
                  >
                    <CheckCircle2
                      className={`h-5 w-5 ${
                        task.status === "done" ? "text-emerald-400 fill-emerald-400/20" : ""
                      }`}
                    />
                  </button>

                  <div className="min-w-0 flex-1">
                    <h3
                      className={`font-semibold text-foreground text-sm group-hover:text-primary transition-colors truncate ${
                        task.status === "done" ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1 flex-wrap">
                      <span className="font-medium text-foreground">{ws?.name || "Workspace"}</span>
                      {task.description && (
                        <>
                          <span>&bull;</span>
                          <span className="truncate max-w-[240px]">{task.description}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Metadata: Priority, Due Date, Status */}
                <div className="flex items-center gap-3 shrink-0">
                  {task.due_date && (
                    <div
                      className={`flex items-center gap-1 font-mono text-xs ${
                        isOverdue ? "text-red-400 font-bold" : "text-muted-foreground"
                      }`}
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatShortDate(task.due_date)}</span>
                    </div>
                  )}

                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>

                  <span className="text-[11px] uppercase text-muted-foreground bg-secondary px-2 py-0.5 rounded border border-border/80">
                    {task.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <CreateTaskDialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen} />
      {selectedTaskId && (
        <TaskModal
          taskId={selectedTaskId}
          open={Boolean(selectedTaskId)}
          onOpenChange={(open) => !open && setSelectedTaskId(null)}
        />
      )}
    </div>
  );
}

