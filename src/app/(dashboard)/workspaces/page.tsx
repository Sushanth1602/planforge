"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePlanForge } from "@/lib/store";
import { Progress, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";
import {
  formatDate,
  formatShortDate,
  getWorkspaceTypeBadge,
  isDateOverdue,
} from "@/lib/utils";
import {
  FolderKanban,
  Plus,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
  Users,
  CheckCircle2,
} from "lucide-react";
import { WorkspaceType } from "@/types/planforge";

export default function WorkspacesPage() {
  const { workspaces, getWorkspaceStats, getWorkspaceMembers } = usePlanForge();
  const [isCreateWsOpen, setIsCreateWsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredWorkspaces = workspaces.filter((ws) => {
    if (selectedType !== "all" && ws.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <FolderKanban className="h-6 w-6 text-primary" /> Workspaces & Projects
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your hackathon teams, learning tracks, college projects, and personal builds.
          </p>
        </div>

        <Button size="sm" onClick={() => setIsCreateWsOpen(true)} className="gap-1.5">
          <Plus className="h-4 w-4" />
          <span>New Workspace</span>
        </Button>
      </div>

      {/* Workspace Type Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-muted-foreground font-semibold flex items-center gap-1 shrink-0">
          <Filter className="h-3.5 w-3.5" /> Type:
        </span>
        {["all", "hackathon", "learning", "project", "competition", "personal"].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3 py-1 rounded-lg font-semibold uppercase tracking-wider text-[11px] transition-colors shrink-0 ${
              selectedType === t
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Workspace Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWorkspaces.map((ws) => {
          const stats = getWorkspaceStats(ws.id);
          const members = getWorkspaceMembers(ws.id);
          const badge = getWorkspaceTypeBadge(ws.type);
          const isOverdue = isDateOverdue(ws.deadline, stats.progress === 100);

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
                    <span
                      className={`text-[11px] flex items-center gap-1 ${
                        isOverdue ? "text-red-400 font-semibold" : "text-muted-foreground"
                      }`}
                    >
                      <Calendar className="h-3 w-3" /> {formatDate(ws.deadline)}
                    </span>
                  )}
                </div>

                <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {ws.name}
                </h2>
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                  {ws.description || "No description provided."}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-border/60 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground text-[11px]">Execution Progress</span>
                  <span className="font-bold text-primary font-mono text-[11px]">{stats.progress}%</span>
                </div>
                <Progress value={stats.progress} className="h-1.5" />

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span className="font-mono">
                    {stats.completedTasks}/{stats.totalTasks} tasks done
                  </span>

                  <div className="flex -space-x-1.5 overflow-hidden">
                    {members.slice(0, 3).map((m) => (
                      <Avatar
                        key={m.id}
                        src={m.profile?.avatar_url}
                        name={m.profile?.full_name || "User"}
                        size="xs"
                        className="ring-1 ring-background"
                      />
                    ))}
                    {members.length > 3 && (
                      <div className="h-6 w-6 rounded-full bg-secondary border border-border flex items-center justify-center text-[9px] font-bold text-muted-foreground">
                        +{members.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <CreateWorkspaceDialog open={isCreateWsOpen} onOpenChange={setIsCreateWsOpen} />
    </div>
  );
}
