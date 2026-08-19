"use client";

import React from "react";
import { usePlanForge } from "@/lib/store";
import { Progress } from "@/components/ui/avatar";
import { BarChart3, FolderKanban } from "lucide-react";
import Link from "next/link";
import { ProgressAnalytics } from "@/components/analytics/progress-analytics";

export default function GlobalAnalyticsPage() {
  const { workspaces, getWorkspaceStats } = usePlanForge();

  return (
    <div className="space-y-8 pb-12 animate-cinematic-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-white/5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" /> Velocity & Productivity Analytics
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Aggregated cross-workspace statistics, completion trends, and team delivery workloads.
          </p>
        </div>
      </div>

      {/* Unified Stats & SVG Charts */}
      <ProgressAnalytics />

      {/* Workspace Performance Breakdown */}
      {workspaces.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <FolderKanban className="h-4 w-4 text-blue-500" /> Workspace Leaderboard
          </h2>

          <div className="rounded-xl border border-white/5 bg-[#0C111D]/90 overflow-hidden divide-y divide-white/5 shadow-md">
            {workspaces.map((ws) => {
              const stats = getWorkspaceStats(ws.id);
              return (
                <div
                  key={ws.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-bold text-white text-sm">{ws.name}</span>
                      <span className="text-[9px] uppercase font-semibold px-2 py-0.2 rounded bg-white/5 text-muted-foreground border border-white/5">
                        {ws.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Progress value={stats.progress} className="h-1.5 w-32" />
                      <span className="font-mono text-blue-400 font-bold">{stats.progress}%</span>
                      <span>
                        {stats.completedTasks}/{stats.totalTasks} tasks done
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/workspaces/${ws.id}/analytics`}
                    className="text-blue-400 hover:text-blue-300 font-semibold text-xs shrink-0"
                  >
                    Deep dive &rarr;
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
