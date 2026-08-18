"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePlanForge } from "@/lib/store";
import { Progress, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ActivityFeed } from "@/components/activity/activity-feed";
import { TaskModal } from "@/components/tasks/task-modal";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import {
  formatDate,
  formatShortDate,
  getPriorityColor,
  getWorkspaceTypeBadge,
  isDateOverdue,
} from "@/lib/utils";
import {
  FolderKanban,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  Target,
  Trophy,
  Users,
} from "lucide-react";

export default function DashboardPage() {
  const {
    currentUser,
    workspaces,
    tasks,
    activities,
    getGlobalStats,
    getWorkspaceStats,
    getWorkspaceMembers,
    moveTaskStatus,
  } = usePlanForge();

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isCreateWsOpen, setIsCreateWsOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const stats = getGlobalStats();

  // Get current hour for dynamic greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Filter today's tasks & assigned tasks
  const todayStr = new Date().toISOString().split("T")[0];
  const todayTasks = tasks.filter(
    (t) => t.status !== "done" && (t.due_date?.startsWith(todayStr) || t.assigned_to === currentUser.id)
  );

  return (
    <div className="space-y-8">
      {/* Top Greeting & Header Actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            {greeting}, {currentUser.full_name.split(" ")[0]}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Here is your collaborative sprint overview and current execution progress.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={() => setIsCreateWsOpen(true)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span>New Workspace</span>
          </Button>
          <Button size="sm" onClick={() => setIsCreateTaskOpen(true)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span>Create Task</span>
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border hover:border-border/80 transition-all shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Active Workspaces</span>
            <FolderKanban className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">{stats.activeWorkspaces}</div>
          <p className="text-[11px] text-muted-foreground mt-1">Hackathons, Projects & Goals</p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border hover:border-border/80 transition-all shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Tasks Due Today</span>
            <Clock className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-400">{stats.tasksDueToday}</div>
          <p className="text-[11px] text-muted-foreground mt-1">Scheduled for immediate action</p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border hover:border-border/80 transition-all shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Overdue Tasks</span>
            <AlertTriangle className={`h-4 w-4 ${stats.overdueTasks > 0 ? "text-red-400" : "text-muted-foreground"}`} />
          </div>
          <div className={`text-2xl font-bold font-mono ${stats.overdueTasks > 0 ? "text-red-400" : "text-foreground"}`}>
            {stats.overdueTasks}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {stats.overdueTasks > 0 ? "Needs immediate re-alignment" : "Zero blocker bottlenecks"}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border hover:border-border/80 transition-all shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Completed Tasks</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{stats.completedTasks}</div>
          <p className="text-[11px] text-muted-foreground mt-1">Across all collaborative projects</p>
        </div>
      </div>

      {/* Section 1: My Workspaces */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <FolderKanban className="h-4 w-4 text-primary" /> My Workspaces
          </h2>
          <Link
            href="/workspaces"
            className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
          >
            View all ({workspaces.length}) &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((ws) => {
            const wsStats = getWorkspaceStats(ws.id);
            const wsMembers = getWorkspaceMembers(ws.id);
            const badge = getWorkspaceTypeBadge(ws.type);

            return (
              <Link
                key={ws.id}
                href={`/workspaces/${ws.id}`}
                className="group p-5 rounded-xl bg-card border border-border hover:border-primary/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${badge.className}`}>
                      {badge.label}
                    </span>
                    {ws.deadline && (
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {formatShortDate(ws.deadline)}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {ws.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {ws.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground text-[11px]">Progress</span>
                    <span className="font-bold text-primary font-mono text-[11px]">{wsStats.progress}%</span>
                  </div>
                  <Progress value={wsStats.progress} className="h-1.5" />

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                    <span>{wsStats.activeTasks} tasks remaining</span>
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {wsMembers.slice(0, 3).map((m) => (
                        <Avatar
                          key={m.id}
                          src={m.profile?.avatar_url}
                          name={m.profile?.full_name || "User"}
                          size="xs"
                          className="ring-1 ring-background"
                        />
                      ))}
                      {wsMembers.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-secondary border border-border flex items-center justify-center text-[9px] font-bold text-muted-foreground">
                          +{wsMembers.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Section 2: Today's Tasks & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-sky-400" /> Today&apos;s Action Queue
            </h2>
            <Link href="/tasks" className="text-xs text-primary hover:underline font-medium">
              Go to My Tasks &rarr;
            </Link>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border/60 shadow-sm">
            {todayTasks.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2 opacity-60" />
                You are all caught up for today! No pending tasks.
              </div>
            ) : (
              todayTasks.slice(0, 6).map((task) => {
                const ws = workspaces.find((w) => w.id === task.workspace_id);
                const isOverdue = isDateOverdue(task.due_date, task.status === "done");

                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className="p-3.5 flex items-center justify-between gap-3 hover:bg-secondary/40 transition-colors cursor-pointer text-xs group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveTaskStatus(task.id, task.status === "done" ? "todo" : "done");
                        }}
                        className="text-muted-foreground hover:text-emerald-400 shrink-0"
                      >
                        <CheckCircle2
                          className={`h-4 w-4 ${task.status === "done" ? "text-emerald-400" : ""}`}
                        />
                      </button>

                      <div className="min-w-0">
                        <h4
                          className={`font-semibold text-foreground truncate group-hover:text-primary transition-colors ${
                            task.status === "done" ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <span className="truncate">{ws?.name || "Workspace"}</span>
                          {task.due_date && (
                            <>
                              <span>&bull;</span>
                              <span className={isOverdue ? "text-red-400 font-semibold" : ""}>
                                Due {formatShortDate(task.due_date)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded border ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-[10px] uppercase text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border">
                        {task.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 1 Col: Recent Activity Stream */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" /> Recent Activity
            </h2>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <ActivityFeed activities={activities.slice(0, 6)} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateWorkspaceDialog open={isCreateWsOpen} onOpenChange={setIsCreateWsOpen} />
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
