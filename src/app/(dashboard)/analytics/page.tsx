"use client";

import React from "react";
import { usePlanForge } from "@/lib/store";
import { Progress } from "@/components/ui/avatar";
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderKanban,
  Target,
} from "lucide-react";
import Link from "next/link";

export default function GlobalAnalyticsPage() {
  const { workspaces, tasks, goals, getWorkspaceStats } = usePlanForge();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const activeTasks = tasks.filter((t) => t.status !== "done").length;
  const overdueTasks = tasks.filter((t) => {
    if (t.status === "done" || !t.due_date) return false;
    return new Date(t.due_date).getTime() < Date.now();
  }).length;

  const globalProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" /> Velocity & Productivity Analytics
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Aggregated cross-workspace statistics, milestone progression, and delivery health.
          </p>
        </div>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Overall Completion</span>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">{globalProgress}%</div>
          <div className="mt-2">
            <Progress value={globalProgress} className="h-1.5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Completed Tasks</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {completedTasks} <span className="text-xs text-muted-foreground font-normal">/ {totalTasks}</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Successfully shipped</p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Active Sprint Tasks</span>
            <Clock className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-400">{activeTasks}</div>
          <p className="text-[11px] text-muted-foreground mt-1">In progress, review & todo</p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Overdue Tasks</span>
            <AlertTriangle className={`h-4 w-4 ${overdueTasks > 0 ? "text-red-400" : "text-muted-foreground"}`} />
          </div>
          <div className={`text-2xl font-bold font-mono ${overdueTasks > 0 ? "text-red-400" : "text-foreground"}`}>
            {overdueTasks}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Requiring immediate resolution</p>
        </div>
      </div>

      {/* Workspace Performance Breakdown */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-primary" /> Workspace Velocity Leaderboard
        </h2>

        <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border/60 shadow-sm">
          {workspaces.map((ws) => {
            const stats = getWorkspaceStats(ws.id);
            return (
              <div
                key={ws.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-secondary/40 transition-colors text-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-foreground text-sm">{ws.name}</span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.2 rounded bg-secondary text-muted-foreground border border-border">
                      {ws.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Progress value={stats.progress} className="h-1.5 w-32" />
                    <span className="font-mono text-primary font-bold">{stats.progress}%</span>
                    <span>
                      {stats.completedTasks}/{stats.totalTasks} tasks done
                    </span>
                  </div>
                </div>

                <Link
                  href={`/workspaces/${ws.id}/analytics`}
                  className="text-primary hover:underline font-semibold text-xs shrink-0"
                >
                  Deep dive &rarr;
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
