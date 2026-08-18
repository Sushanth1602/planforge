"use client";

import React, { use } from "react";
import { usePlanForge } from "@/lib/store";
import { WorkspaceHeader } from "@/components/workspaces/workspace-header";
import { GoalCard } from "@/components/goals/goal-card";
import { ActivityFeed } from "@/components/activity/activity-feed";
import { ProgressAnalytics } from "@/components/analytics/progress-analytics";
import Link from "next/link";
import { ArrowRight, CheckSquare, Target, Trophy, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <div className="text-center py-16 space-y-3">
        <h2 className="text-xl font-bold text-foreground">Workspace not found</h2>
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
  const pendingTasks = wsTasks.filter((t) => t.status !== "done");

  return (
    <div className="space-y-6">
      <WorkspaceHeader workspace={workspace} />

      {/* Main Grid: Goals Summary & Recent Workspace Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Goals & Execution Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" /> Active Goals & Milestone Roadmaps
            </h2>
            <Link
              href={`/workspaces/${workspace.id}/goals`}
              className="text-xs text-primary hover:underline font-medium"
            >
              Manage all goals &rarr;
            </Link>
          </div>

          {wsGoals.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
              No goals set for this workspace yet. Create a goal to define your roadmap!
            </div>
          ) : (
            <div className="space-y-4">
              {wsGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Links & Workspace Activity Stream */}
        <div className="space-y-6">
          {/* Quick Links Card */}
          <div className="p-4 rounded-xl bg-card border border-border space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Quick Navigation
            </h3>
            <div className="space-y-1.5 text-xs">
              <Link
                href={`/workspaces/${workspace.id}/kanban`}
                className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-foreground font-medium group transition-colors"
              >
                <span>Kanban Execution Board</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={`/workspaces/${workspace.id}/team`}
                className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-foreground font-medium group transition-colors"
              >
                <span>Team Roster & Workload</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={`/workspaces/${workspace.id}/ai-planner`}
                className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-foreground font-medium group transition-colors"
              >
                <span>AI Roadmap & Risk Analyzer</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Activity Feed for this Workspace */}
          <div className="p-4 rounded-xl bg-card border border-border space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Recent Workspace Events
            </h3>
            <ActivityFeed activities={wsActivities.slice(0, 6)} />
          </div>
        </div>
      </div>
    </div>
  );
}
