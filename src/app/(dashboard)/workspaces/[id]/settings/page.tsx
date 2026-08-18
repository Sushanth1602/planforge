"use client";

import React, { useState, use } from "react";
import { usePlanForge } from "@/lib/store";
import { WorkspaceHeader } from "@/components/workspaces/workspace-header";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { WorkspaceType } from "@/types/planforge";
import { useRouter } from "next/navigation";
import { Trash2, Save, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function WorkspaceSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { workspaces, updateWorkspace, deleteWorkspace } = usePlanForge();
  const router = useRouter();

  const workspace = workspaces.find((w) => w.id === id);

  const [name, setName] = useState(workspace?.name || "");
  const [description, setDescription] = useState(workspace?.description || "");
  const [type, setType] = useState<WorkspaceType>(workspace?.type || "project");
  const [deadline, setDeadline] = useState(workspace?.deadline ? workspace.deadline.split("T")[0] : "");
  const [isSaved, setIsSaved] = useState(false);

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkspace(workspace.id, {
      name,
      description,
      type,
      deadline: deadline || null,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to permanently delete "${workspace.name}"? This action cannot be undone.`)) {
      deleteWorkspace(workspace.id);
      router.push("/workspaces");
    }
  };

  return (
    <div className="space-y-6">
      <WorkspaceHeader workspace={workspace} />

      <div className="max-w-2xl space-y-6">
        <form onSubmit={handleSave} className="p-6 rounded-xl bg-card border border-border shadow-sm space-y-4">
          <h3 className="text-base font-bold text-foreground">General Workspace Configuration</h3>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Workspace Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Workspace Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as WorkspaceType)}
                className="w-full h-9 rounded-md border border-border bg-secondary px-2 text-xs text-foreground focus:outline-none"
              >
                <option value="hackathon">Hackathon</option>
                <option value="learning">Learning Track</option>
                <option value="project">College/Team Project</option>
                <option value="competition">Competition</option>
                <option value="personal">Personal Goal</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Target Deadline</label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button type="submit" size="sm" className="gap-1.5">
              <Save className="h-4 w-4" />
              <span>{isSaved ? "Saved Changes!" : "Save Changes"}</span>
            </Button>
          </div>
        </form>

        {/* Danger Zone */}
        <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/30 space-y-3">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>Danger Zone</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Deleting this workspace will delete all associated goals, milestones, tasks, checklists, and activity logs.
          </p>

          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleDelete}
            className="gap-1.5 mt-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Workspace</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
