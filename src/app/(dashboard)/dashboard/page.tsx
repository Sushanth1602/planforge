"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePlanForge } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { TaskModal } from "@/components/tasks/task-modal";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { ActivityFeed } from "@/components/activity/activity-feed";
import {
  formatDate,
  formatShortDate,
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
  TrendingUp,
} from "lucide-react";
import {
  GlassCard,
  GlassPanel,
  GlassButton,
  StatusBadge,
  ProgressBar,
  Timeline,
  CinematicSection,
} from "@/components/ui/cinematic";

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

  // Filter today's focus tasks (assigned to current user, not done)
  const todayTasks = tasks.filter(
    (t) => t.status !== "done" && t.assigned_to === currentUser.id
  );

  return (
    <div className="space-y-8 animate-cinematic-in pb-12">
      {/* Top Greeting & Header Actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-light tracking-[-0.03em] text-white">
            {greeting}, <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{currentUser.full_name.split(" ")[0]}.</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Here&apos;s what deserves your attention today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <GlassButton variant="secondary" size="sm" onClick={() => setIsCreateWsOpen(true)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span>New Workspace</span>
          </GlassButton>
          <GlassButton variant="primary" size="sm" onClick={() => setIsCreateTaskOpen(true)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span>Create Task</span>
          </GlassButton>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <CinematicSection delayIndex={1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="hover:border-blue-500/20">
          <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-2">
            <span>Active Workspaces</span>
            <FolderKanban className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-semibold font-mono text-white">{stats.activeWorkspaces}</div>
          <p className="text-[10px] text-muted-foreground mt-1.5">Hackathons & Projects</p>
        </GlassCard>

        <GlassCard className="hover:border-cyan-500/20">
          <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-2">
            <span>Tasks Due Today</span>
            <Clock className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-semibold font-mono text-cyan-400">{stats.tasksDueToday}</div>
          <p className="text-[10px] text-muted-foreground mt-1.5">Immediate execution queued</p>
        </GlassCard>

        <GlassCard className={`hover:border-red-500/20 ${stats.overdueTasks > 0 ? "border-red-500/20 bg-red-950/5" : ""}`}>
          <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-2">
            <span>Overdue Tasks</span>
            <AlertTriangle className={`h-4 w-4 ${stats.overdueTasks > 0 ? "text-red-400 animate-pulse" : "text-muted-foreground"}`} />
          </div>
          <div className={`text-2xl font-semibold font-mono ${stats.overdueTasks > 0 ? "text-red-400" : "text-white"}`}>
            {stats.overdueTasks}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5">
            {stats.overdueTasks > 0 ? "Blocker bottlenecks detected" : "Zero blocker issues"}
          </p>
        </GlassCard>

        <GlassCard className="hover:border-emerald-500/20">
          <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-2">
            <span>Completed Tasks</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-semibold font-mono text-emerald-400">{stats.completedTasks}</div>
          <p className="text-[10px] text-muted-foreground mt-1.5">Sprint objectives accomplished</p>
        </GlassCard>
      </CinematicSection>

      {/* TODAY'S FOCUS - Large horizontal glass rows */}
      <CinematicSection delayIndex={2} className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Today&apos;s Focus
        </h2>

        <div className="space-y-2.5">
          {todayTasks.length === 0 ? (
            <GlassPanel className="py-10 text-center text-xs text-muted-foreground flex flex-col items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-500/80 mb-2.5" />
              You are all caught up for today! No pending items in your queue.
            </GlassPanel>
          ) : (
            todayTasks.slice(0, 4).map((task) => {
              const ws = workspaces.find((w) => w.id === task.workspace_id);
              const isOverdue = isDateOverdue(task.due_date, task.status === "done");

              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className="liquid-glass rounded-xl p-3.5 flex items-center justify-between gap-4 cursor-pointer hover:border-blue-500/30 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveTaskStatus(task.id, "done");
                      }}
                      className="text-muted-foreground hover:text-emerald-400 shrink-0 transition-colors"
                      title="Mark Complete"
                    >
                      <CheckCircle2 className="h-4.5 w-4.5" />
                    </button>
                    
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                        {task.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate flex items-center gap-1.5">
                        <span className="text-white/70 font-medium">{ws?.name || "Workspace"}</span>
                        {task.due_date && (
                          <>
                            <span>&bull;</span>
                            <span className={isOverdue ? "text-red-400 font-bold" : ""}>
                              Due {formatShortDate(task.due_date)}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge value={task.priority} />
                    <StatusBadge value={task.status} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CinematicSection>

      {/* Workspaces Grid */}
      <CinematicSection delayIndex={3} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Workspaces
          </h2>
          <Link
            href="/workspaces"
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-semibold"
          >
            All Workspaces ({workspaces.length}) &rarr;
          </Link>
        </div>

        <div className="space-y-3">
          {workspaces.map((ws) => {
            const wsStats = getWorkspaceStats(ws.id);
            const wsMembers = getWorkspaceMembers(ws.id);
            const badge = getWorkspaceTypeBadge(ws.type);

            return (
              <Link
                key={ws.id}
                href={`/workspaces/${ws.id}`}
                className="group p-4 rounded-xl border border-white/5 bg-[#0C111D]/90 hover:bg-[#101624]/90 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
              >
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-xs text-white group-hover:text-blue-400 transition-colors">
                      {ws.name}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/10 px-2 py-0.2 rounded-full">
                      {badge.label}
                    </span>
                  </div>
                  {ws.description && (
                    <p className="text-[11px] text-muted-foreground line-clamp-1 truncate max-w-xl">
                      {ws.description}
                    </p>
                  )}
                  <div className="text-[10px] text-muted-foreground flex items-center gap-2 flex-wrap font-mono">
                    <span>{wsMembers.length} members</span>
                    <span>&bull;</span>
                    <span>{wsStats.totalTasks} tasks</span>
                    {ws.deadline && (
                      <>
                        <span>&bull;</span>
                        <span>Due {formatShortDate(ws.deadline)}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="w-full sm:w-48 shrink-0 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-muted-foreground text-[10px]">Progress</span>
                    <span className="font-bold text-blue-400 text-[11px]">{wsStats.progress}%</span>
                  </div>
                  <ProgressBar value={wsStats.progress} />
                </div>
              </Link>
            );
          })}
        </div>
      </CinematicSection>

      {/* Recent Activity */}
      <CinematicSection delayIndex={4} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" /> Recent Activity
          </h2>

          <GlassPanel className="p-5">
            <ActivityFeed activities={activities.slice(0, 6)} />
          </GlassPanel>
        </div>
      </CinematicSection>

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
