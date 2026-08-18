"use client";

import React from "react";
import { ActivityEvent } from "@/types/planforge";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils";
import { CheckCircle2, UserPlus, Flag, Target, Sparkles, MoveRight, MessageSquare, Plus } from "lucide-react";

export function ActivityFeed({ activities }: { activities: ActivityEvent[] }) {
  const getActionIcon = (type: string) => {
    switch (type) {
      case "task_completed":
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />;
      case "task_created":
        return <Plus className="h-3.5 w-3.5 text-sky-400" />;
      case "status_changed":
        return <MoveRight className="h-3.5 w-3.5 text-purple-400" />;
      case "member_joined":
        return <UserPlus className="h-3.5 w-3.5 text-amber-400" />;
      case "milestone_completed":
      case "milestone_created":
        return <Flag className="h-3.5 w-3.5 text-emerald-400" />;
      case "goal_created":
        return <Target className="h-3.5 w-3.5 text-primary" />;
      case "comment_added":
        return <MessageSquare className="h-3.5 w-3.5 text-blue-400" />;
      case "ai_roadmap_applied":
        return <Sparkles className="h-3.5 w-3.5 text-primary" />;
      default:
        return <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  const formatActivityText = (act: ActivityEvent) => {
    const userName = act.user?.full_name || "A team member";

    switch (act.action_type) {
      case "task_completed":
        return (
          <>
            <span className="font-semibold text-foreground">{userName}</span> completed{" "}
            <span className="font-semibold text-foreground">&ldquo;{act.entity_title}&rdquo;</span>
          </>
        );
      case "task_created":
        return (
          <>
            <span className="font-semibold text-foreground">{userName}</span> created task{" "}
            <span className="font-semibold text-foreground">&ldquo;{act.entity_title}&rdquo;</span>
          </>
        );
      case "status_changed":
        return (
          <>
            <span className="font-semibold text-foreground">{userName}</span> moved{" "}
            <span className="font-semibold text-foreground">&ldquo;{act.entity_title}&rdquo;</span>
            {act.metadata?.to ? ` to ${act.metadata.to}` : ""}
          </>
        );
      case "task_assigned":
        return (
          <>
            <span className="font-semibold text-foreground">{userName}</span> assigned task{" "}
            <span className="font-semibold text-foreground">&ldquo;{act.entity_title}&rdquo;</span>
          </>
        );
      case "milestone_completed":
        return (
          <>
            <span className="font-semibold text-foreground">{userName}</span> finished milestone{" "}
            <span className="font-semibold text-emerald-400">&ldquo;{act.entity_title}&rdquo;</span>
          </>
        );
      case "goal_created":
        return (
          <>
            <span className="font-semibold text-foreground">{userName}</span> created goal{" "}
            <span className="font-semibold text-foreground">&ldquo;{act.entity_title}&rdquo;</span>
          </>
        );
      case "workspace_created":
        return (
          <>
            <span className="font-semibold text-foreground">{userName}</span> created workspace{" "}
            <span className="font-semibold text-primary">&ldquo;{act.entity_title}&rdquo;</span>
          </>
        );
      case "member_joined":
        return (
          <>
            <span className="font-semibold text-foreground">{act.entity_title}</span>
          </>
        );
      default:
        return (
          <>
            <span className="font-semibold text-foreground">{userName}</span> updated{" "}
            <span className="font-semibold text-foreground">&ldquo;{act.entity_title}&rdquo;</span>
          </>
        );
    }
  };

  return (
    <div className="space-y-3">
      {activities.length === 0 ? (
        <div className="text-center py-6 text-xs text-muted-foreground">No recent activity</div>
      ) : (
        activities.map((act) => (
          <div
            key={act.id}
            className="flex items-start gap-3 p-2.5 rounded-lg bg-card/60 hover:bg-card border border-border/50 transition-colors text-xs"
          >
            <div className="relative shrink-0 mt-0.5">
              <Avatar src={act.user?.avatar_url} name={act.user?.full_name} size="xs" />
              <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 border border-border">
                {getActionIcon(act.action_type)}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-muted-foreground leading-relaxed truncate">{formatActivityText(act)}</p>
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                {formatRelativeTime(act.created_at)}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
