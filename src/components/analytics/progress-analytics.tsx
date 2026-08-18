"use client";

import React from "react";
import { usePlanForge } from "@/lib/store";
import { Progress } from "@/components/ui/avatar";
import { CheckCircle2, Clock, AlertTriangle, Target, Flag, Layers, BarChart3, TrendingUp } from "lucide-react";

export function ProgressAnalytics({ workspaceId }: { workspaceId: string }) {
  const { workspaces, tasks, goals, milestones, getWorkspaceStats } = usePlanForge();

  const ws = workspaces.find((w) => w.id === workspaceId);
  const stats = getWorkspaceStats(workspaceId);

  const wsGoals = goals.filter((g) => g.workspace_id === workspaceId);
  const wsMilestones = milestones.filter((m) => m.workspace_id === workspaceId);

  const doneTasks = tasks.filter((t) => t.workspace_id === workspaceId && t.status === "done").length;
  const inProgressTasks = tasks.filter((t) => t.workspace_id === workspaceId && t.status === "in_progress").length;
  const todoTasks = tasks.filter((t) => t.workspace_id === workspaceId && t.status === "todo").length;
  const reviewTasks = tasks.filter((t) => t.workspace_id === workspaceId && t.status === "review").length;
  const backlogTasks = tasks.filter((t) => t.workspace_id === workspaceId && t.status === "backlog").length;

  return (
    <div className="space-y-6">
      {/* Top Level Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Overall Progress</span>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">{stats.progress}%</div>
          <div className="mt-2">
            <Progress value={stats.progress} className="h-1.5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Completed Tasks</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-foreground font-mono">
            {stats.completedTasks} <span className="text-xs text-muted-foreground font-normal">/ {stats.totalTasks}</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}% completion velocity
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Active / In Flight</span>
            <Clock className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-sky-400 font-mono">{stats.activeTasks}</div>
          <p className="text-[11px] text-muted-foreground mt-1">{stats.hoursRemaining} estimated hours left</p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Overdue Tasks</span>
            <AlertTriangle className={`h-4 w-4 ${stats.overdueTasks > 0 ? "text-red-400" : "text-muted-foreground"}`} />
          </div>
          <div className={`text-2xl font-bold font-mono ${stats.overdueTasks > 0 ? "text-red-400" : "text-foreground"}`}>
            {stats.overdueTasks}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {stats.overdueTasks === 0 ? "No blocker items" : "Immediate action required"}
          </p>
        </div>
      </div>

      {/* Breakdown Section: Task Status Distribution & Milestone Completion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <div className="p-5 rounded-xl bg-card border border-border space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Task Status Distribution
            </h3>
            <span className="text-xs font-mono text-muted-foreground">{stats.totalTasks} total</span>
          </div>

          <div className="space-y-3">
            {[
              { label: "Done", count: doneTasks, color: "bg-emerald-500", text: "text-emerald-400" },
              { label: "In Progress", count: inProgressTasks, color: "bg-sky-500", text: "text-sky-400" },
              { label: "Review", count: reviewTasks, color: "bg-purple-500", text: "text-purple-400" },
              { label: "To Do", count: todoTasks, color: "bg-amber-500", text: "text-amber-400" },
              { label: "Backlog", count: backlogTasks, color: "bg-slate-600", text: "text-slate-400" },
            ].map((item) => {
              const percent = stats.totalTasks > 0 ? Math.round((item.count / stats.totalTasks) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold text-foreground font-mono">
                      {item.count} ({percent}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-300`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestone Progress Status */}
        <div className="p-5 rounded-xl bg-card border border-border space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Flag className="h-4 w-4 text-emerald-400" /> Milestone Milestones
            </h3>
            <span className="text-xs font-mono text-muted-foreground">{wsMilestones.length} milestones</span>
          </div>

          <div className="space-y-3.5 max-h-[280px] overflow-y-auto pr-1">
            {wsMilestones.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-4">No milestones defined yet.</p>
            ) : (
              wsMilestones.map((m) => {
                const mTasks = tasks.filter((t) => t.milestone_id === m.id);
                const mDone = mTasks.filter((t) => t.status === "done").length;
                const mPercent = mTasks.length > 0 ? Math.round((mDone / mTasks.length) * 100) : m.status === "completed" ? 100 : 0;

                return (
                  <div key={m.id} className="p-2.5 rounded-lg bg-secondary/30 border border-border/60">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-foreground truncate max-w-[200px]">{m.title}</span>
                      <span className="font-mono text-primary text-[11px]">{mPercent}%</span>
                    </div>
                    <Progress value={mPercent} className="h-1.5" />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
