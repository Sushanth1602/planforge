"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlanForge } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
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
  Filter,
} from "lucide-react";
import { GlassButton, GlassCard, ProgressBar, CinematicPageHeader } from "@/components/ui/cinematic";

export default function WorkspacesPage() {
  const { workspaces, getWorkspaceStats, getWorkspaceMembers } = usePlanForge();
  const [isCreateWsOpen, setIsCreateWsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredWorkspaces = workspaces.filter((ws) => {
    if (selectedType !== "all" && ws.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-cinematic-in pb-12">
      {/* Header */}
      <CinematicPageHeader
        title="Workspaces & Projects"
        subheading="Manage your hackathon teams, learning tracks, college projects, and personal builds."
      >
        <GlassButton variant="primary" size="sm" onClick={() => setIsCreateWsOpen(true)} className="gap-1.5">
          <Plus className="h-4 w-4" />
          <span>New Workspace</span>
        </GlassButton>
      </CinematicPageHeader>

      {/* Workspace Type Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-muted-foreground font-semibold flex items-center gap-1.5 shrink-0">
          <Filter className="h-3.5 w-3.5" /> Filter Type:
        </span>
        {["all", "hackathon", "learning", "project", "competition", "personal"].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all shrink-0 ${
              selectedType === t
                ? "bg-blue-600/10 text-blue-400 border border-blue-500/25 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                : "bg-white/[0.02] text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Workspace Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
        {filteredWorkspaces.map((ws) => {
          const stats = getWorkspaceStats(ws.id);
          const members = getWorkspaceMembers(ws.id);
          const badge = getWorkspaceTypeBadge(ws.type);
          const isOverdue = isDateOverdue(ws.deadline, stats.progress === 100);

          return (
            <Link
              key={ws.id}
              href={`/workspaces/${ws.id}`}
              className="group liquid-glass rounded-xl p-5 hover:border-blue-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/10 px-2 py-0.5 rounded-full">
                    {badge.label}
                  </span>
                  {ws.deadline && (
                    <span
                      className={`text-[10px] flex items-center gap-1 font-mono ${
                        isOverdue ? "text-red-400 font-bold" : "text-muted-foreground"
                      }`}
                    >
                      <Calendar className="h-3.5 w-3.5" /> {formatShortDate(ws.deadline)}
                    </span>
                  )}
                </div>

                <h2 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                  {ws.name}
                </h2>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {ws.description || "No description provided."}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-white/5 space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Execution Progress</span>
                  <span className="font-bold text-blue-450 font-mono">{stats.progress}%</span>
                </div>
                <ProgressBar value={stats.progress} />

                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                  <span className="font-mono">
                    {stats.completedTasks}/{stats.totalTasks} done
                  </span>

                  <div className="flex -space-x-1.5 overflow-hidden">
                    {members.slice(0, 3).map((m) => (
                      <Avatar
                        key={m.id}
                        src={m.profile?.avatar_url}
                        name={m.profile?.full_name || "User"}
                        size="xs"
                        className="ring-1 ring-[#080B12]"
                      />
                    ))}
                    {members.length > 3 && (
                      <div className="h-5 w-5 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-[8px] font-bold text-muted-foreground">
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
