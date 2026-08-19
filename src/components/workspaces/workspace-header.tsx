"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Workspace } from "@/types/planforge";
import { usePlanForge } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { CreateGoalDialog } from "@/components/goals/create-goal-dialog";
import { InviteMemberDialog } from "@/components/team/invite-member-dialog";
import {
  formatDate,
  getWorkspaceTypeBadge,
  isDateOverdue,
} from "@/lib/utils";
import {
  Compass,
  KanbanSquare,
  Target,
  Users,
  Calendar,
  BarChart3,
  Sparkles,
  Settings,
  Plus,
  Clock,
  UserPlus,
} from "lucide-react";
import { GlassButton, ProgressBar, GlassCard } from "@/components/ui/cinematic";

export function WorkspaceHeader({ workspace }: { workspace: Workspace }) {
  const pathname = usePathname();
  const { getWorkspaceStats, getWorkspaceMembers } = usePlanForge();

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const stats = getWorkspaceStats(workspace.id);
  const members = getWorkspaceMembers(workspace.id);
  const badge = getWorkspaceTypeBadge(workspace.type);
  const isOverdue = isDateOverdue(workspace.deadline, stats.progress === 100);

  const tabs = [
    { label: "Overview", href: `/workspaces/${workspace.id}`, icon: Compass },
    { label: "Board", href: `/workspaces/${workspace.id}/kanban`, icon: KanbanSquare },
    { label: "Goals", href: `/workspaces/${workspace.id}/goals`, icon: Target },
    { label: "Team", href: `/workspaces/${workspace.id}/team`, icon: Users },
    { label: "Calendar", href: `/workspaces/${workspace.id}/calendar`, icon: Calendar },
    { label: "Analytics", href: `/workspaces/${workspace.id}/analytics`, icon: BarChart3 },
    { label: "AI", href: `/workspaces/${workspace.id}/ai-planner`, icon: Sparkles },
  ];

  return (
    <div className="space-y-4 pb-4 border-b border-white/5 mb-6 animate-cinematic-in">
      {/* Top Workspace Meta & Actions */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/10 px-2.5 py-0.5 rounded-full">
              {badge.label}
            </span>
            {workspace.deadline && (
              <span
                className={`text-xs flex items-center gap-1.5 font-mono ${
                  isOverdue ? "text-red-400 font-bold" : "text-muted-foreground"
                }`}
              >
                <Clock className="h-3.5 w-3.5" /> Deadline: {formatDate(workspace.deadline)}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-light tracking-[-0.03em] text-white leading-tight">
            {workspace.name}
          </h1>
          {workspace.description && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {workspace.description}
            </p>
          )}
        </div>

        {/* Header CTAs */}
        <div className="flex items-center gap-2 flex-wrap">
          <GlassButton variant="secondary" size="sm" onClick={() => setIsInviteOpen(true)} className="gap-1.5">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Invite Member</span>
          </GlassButton>

          <GlassButton variant="secondary" size="sm" onClick={() => setIsCreateGoalOpen(true)} className="gap-1.5">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Add Goal</span>
          </GlassButton>

          <GlassButton variant="primary" size="sm" onClick={() => setIsCreateTaskOpen(true)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </GlassButton>

          <Link href={`/workspaces/${workspace.id}/settings`} title="Workspace Settings">
            <GlassButton variant="secondary" size="sm" className="h-9 w-9 p-0 flex items-center justify-center">
              <Settings className="h-4 w-4" />
            </GlassButton>
          </Link>
        </div>
      </div>

      {/* Progress & Quick Stats Ribbon */}
      <GlassCard className="p-4 flex items-center justify-between gap-4 flex-wrap text-xs">
        <div className="flex items-center gap-3.5 flex-1 min-w-[240px]">
          <span className="text-muted-foreground font-semibold">Workspace Progress:</span>
          <ProgressBar value={stats.progress} className="flex-1 max-w-xs" />
          <span className="font-bold text-blue-400 font-mono">{stats.progress}%</span>
        </div>

        <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
          <span>
            <strong className="text-white">{stats.completedTasks}</strong>/{stats.totalTasks} Done
          </span>
          <span>
            <strong className="text-blue-400">{stats.activeTasks}</strong> Active
          </span>
          {stats.overdueTasks > 0 && (
            <span className="text-red-400 font-bold">
              {stats.overdueTasks} Overdue
            </span>
          )}
          <div className="flex -space-x-1.5 overflow-hidden">
            {members.map((m) => (
              <Avatar
                key={m.id}
                src={m.profile?.avatar_url}
                name={m.profile?.full_name || "User"}
                size="xs"
                className="ring-1 ring-[#080B12]"
              />
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1.5 scrollbar-thin">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/25 shadow-[0_0_12px_rgba(59,130,246,0.18)] font-bold"
                  : "text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Modals */}
      <CreateTaskDialog
        open={isCreateTaskOpen}
        onOpenChange={setIsCreateTaskOpen}
        defaultWorkspaceId={workspace.id}
      />
      <CreateGoalDialog
        open={isCreateGoalOpen}
        onOpenChange={setIsCreateGoalOpen}
        workspaceId={workspace.id}
      />
      <InviteMemberDialog
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        workspaceId={workspace.id}
      />
    </div>
  );
}
