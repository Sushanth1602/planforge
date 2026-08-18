"use client";

import React, { useState, use } from "react";
import { usePlanForge } from "@/lib/store";
import { WorkspaceHeader } from "@/components/workspaces/workspace-header";
import { GoalCard } from "@/components/goals/goal-card";
import { CreateGoalDialog } from "@/components/goals/create-goal-dialog";
import { Button } from "@/components/ui/button";
import { Target, Plus } from "lucide-react";
import Link from "next/link";

export default function WorkspaceGoalsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { workspaces, goals } = usePlanForge();
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);

  const workspace = workspaces.find((w) => w.id === id);

  if (!workspace) {
    return (
      <div className="text-center py-16 space-y-3">
        <h2 className="text-xl font-bold text-foreground">Workspace not found</h2>
        <Link href="/workspaces">
          <Button size="sm">Back to Workspaces</Button>
        </Link>
      </div>
    );
  }

  const wsGoals = goals.filter((g) => g.workspace_id === workspace.id);

  return (
    <div className="space-y-6">
      <WorkspaceHeader workspace={workspace} />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-card/60 p-4 rounded-xl border border-border">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" /> Workspace Goal & Milestone Roadmaps
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Organize high-level project aims and track milestone checkpoints.
          </p>
        </div>

        <Button size="sm" onClick={() => setIsCreateGoalOpen(true)} className="gap-1.5">
          <Plus className="h-4 w-4" />
          <span>Add New Goal</span>
        </Button>
      </div>

      <div className="space-y-4">
        {wsGoals.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
            No goals created yet. Click &ldquo;Add New Goal&rdquo; to establish key project objectives.
          </div>
        ) : (
          wsGoals.map((goal) => <GoalCard key={goal.id} goal={goal} />)
        )}
      </div>

      <CreateGoalDialog
        open={isCreateGoalOpen}
        onOpenChange={setIsCreateGoalOpen}
        workspaceId={workspace.id}
      />
    </div>
  );
}
