"use client";

import React, { use } from "react";
import { usePlanForge } from "@/lib/store";
import { WorkspaceHeader } from "@/components/workspaces/workspace-header";
import { GoalCard } from "@/components/goals/goal-card";
import { ActivityFeed } from "@/components/activity/activity-feed";
import Link from "next/link";
import { ArrowRight, Target, Settings, Activity, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassPanel, GlassCard, CinematicSection, CinematicPageHeader } from "@/components/ui/cinematic";

export default function WorkspaceOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { workspaces, goals, tasks, activities } = usePlanForge();

  const workspace = workspaces.find((w) => w.id === id);

  if (!workspace) {
    return (
      <div className="text-center py-16 space-y-3 animate-cinematic-in">
        <h2 className="text-xl font-bold text-white">Workspace not found</h2>
        <p className="text-xs text-muted-foreground">The workspace may have been deleted or moved.</p>
        <Link href="/workspaces">
          <Button size="sm">Back to Workspaces</Button>
        </Link>
      </div>
    );
  }

  const wsGoals = goals.filter((g) => g.workspace_id === workspace.id);
  const wsActivities = activities.filter((a) => a.workspace_id === workspace.id);
  const wsTasks = tasks.filter((t) => t.workspace_id === workspace.id);

  return (
    <div className="space-y-6 animate-cinematic-in pb-12">
      <WorkspaceHeader workspace={workspace} />

      {/* Main Grid: Goals Summary & Quick Actions / Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Goals & Milestone Roadmaps */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" /> Active Goals & Roadmaps
            </h2>
            <Link
              href={`/workspaces/${workspace.id}/goals`}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              All Goals &rarr;
            </Link>
          </div>

          {wsGoals.length === 0 ? (
            <GlassPanel className="py-12 text-center text-xs text-muted-foreground italic border border-dashed border-white/5 rounded-2xl">
              No goals set for this workspace yet. Create a goal to define your roadmap!
            </GlassPanel>
          ) : (
            <div className="space-y-4">
              {wsGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Actions & Workspace Activity Stream */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <GlassPanel className="p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-blue-500" /> Quick Actions
            </h3>
            <div className="space-y-2 text-xs">
              <Link
                href={`/workspaces/${workspace.id}/kanban`}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.015] hover:bg-white/[0.04] border border-white/5 text-white font-semibold group transition-all"
              >
                <span>Workspace Board</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-400 transition-all group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={`/workspaces/${workspace.id}/team`}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.015] hover:bg-white/[0.04] border border-white/5 text-white font-semibold group transition-all"
              >
                <span>Team & Workload</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-400 transition-all group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={`/workspaces/${workspace.id}/ai-planner`}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.015] hover:bg-white/[0.04] border border-white/5 text-white font-semibold group transition-all"
              >
                <span>AI Roadmap & Risks</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-400 transition-all group-hover:translate-x-0.5" />
              </Link>
            </div>
          </GlassPanel>

          {/* Activity Feed for this Workspace */}
          <GlassPanel className="p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-emerald-400" /> Recent Activity
            </h3>
            <ActivityFeed activities={wsActivities.slice(0, 5)} />
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
