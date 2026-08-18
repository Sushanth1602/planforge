"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Workspace } from "@/types/planforge";
import { usePlanForge } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Progress, Avatar } from "@/components/ui/avatar";
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
    { label: "Kanban Board", href: `/workspaces/${workspace.id}/kanban`, icon: KanbanSquare },
    { label: "Goals & Milestones", href: `/workspaces/${workspace.id}/goals`, icon: Target },
    { label: "Team & Workload", href: `/workspaces/${workspace.id}/team`, icon: Users },
    { label: "Calendar", href: `/workspaces/${workspace.id}/calendar`, icon: Calendar },
    { label: "Analytics", href: `/workspaces/${workspace.id}/analytics`, icon: BarChart3 },
    { label: "AI Roadmap & Risk", href: `/workspaces/${workspace.id}/ai-planner`, icon: Sparkles },
    { label: "Settings", href: `/workspaces/${workspace.id}/settings`, icon: Settings },
  ];

  return (
    <div className="space-y-4 pb-4 border-b border-border mb-6">
      {/* Top Workspace Meta & Actions */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${badge.className}`}>
              {badge.label}
            </span>
            {workspace.deadline && (
              <span
                className={`text-xs flex items-center gap-1 font-medium ${
                  isOverdue ? "text-red-400 font-bold" : "text-muted-foreground"
                }`}
              >
                <Clock className="h-3.5 w-3.5" /> Target Deadline: {formatDate(workspace.deadline)}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-black tracking-tight text-foreground">{workspace.name}</h1>
          {workspace.description && (
            <p className="text-xs text-muted-foreground leading-relaxed">{workspace.description}</p>
          )}
        </div>

        {/* Header CTAs */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setIsInviteOpen(true)} className="gap-1.5">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Invite</span>
          </Button>

          <Button variant="outline" size="sm" onClick={() => setIsCreateGoalOpen(true)} className="gap-1.5">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Add Goal</span>
          </Button>

          <Button size="sm" onClick={() => setIsCreateTaskOpen(true)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </Button>
        </div>
      </div>

      {/* Progress & Quick Stats Ribbon */}
      <div className="p-3 rounded-lg bg-card border border-border/80 flex items-center justify-between gap-4 flex-wrap text-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <span className="text-muted-foreground font-semibold">Progress:</span>
          <Progress value={stats.progress} className="h-2 flex-1 max-w-xs" />
          <span className="font-bold text-primary font-mono">{stats.progress}%</span>
        </div>

        <div className="flex items-center gap-4 text-muted-foreground">
          <span>
            <strong className="text-foreground">{stats.completedTasks}</strong>/{stats.totalTasks} Done
          </span>
          <span>
            <strong className="text-sky-400">{stats.activeTasks}</strong> Active
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
                className="ring-1 ring-background"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pt-1 border-b border-border/60 pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
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
