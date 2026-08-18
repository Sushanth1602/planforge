"use client";

import React, { use } from "react";
import { usePlanForge } from "@/lib/store";
import { WorkspaceHeader } from "@/components/workspaces/workspace-header";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WorkspaceKanbanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { workspaces } = usePlanForge();

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

  return (
    <div className="space-y-6">
      <WorkspaceHeader workspace={workspace} />
      <KanbanBoard workspaceId={workspace.id} />
    </div>
  );
}
