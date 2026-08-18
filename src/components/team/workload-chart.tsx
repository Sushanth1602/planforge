"use client";

import React, { useState } from "react";
import { usePlanForge } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { WorkspaceRole } from "@/types/planforge";
import { InviteMemberDialog } from "@/components/team/invite-member-dialog";
import { UserPlus, Shield, Trash2, CheckCircle2, Clock, AlertTriangle, Briefcase } from "lucide-react";

export function TeamWorkloadSection({ workspaceId }: { workspaceId: string }) {
  const { getMemberWorkload, removeMember, updateMemberRole, currentUser } = usePlanForge();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const memberStats = getMemberWorkload(workspaceId);

  return (
    <div className="space-y-6">
      {/* Header & Invite CTA */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-card/60 p-4 rounded-xl border border-border">
        <div>
          <h2 className="text-base font-bold text-foreground">Team Roster & Workload Balance</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor capacity, task assignments, and bottlenecks across all teammates.
          </p>
        </div>
        <Button size="sm" onClick={() => setIsInviteOpen(true)} className="gap-1.5">
          <UserPlus className="h-4 w-4" />
          <span>Invite Teammate</span>
        </Button>
      </div>

      {/* Team Members Workload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {memberStats.map(({ user, role, assignedCount, completedCount, activeCount, overdueCount }) => {
          const completionRate = assignedCount > 0 ? Math.round((completedCount / assignedCount) * 100) : 0;
          const isOverloaded = activeCount >= 5;

          return (
            <div
              key={user.id}
              className="p-4 rounded-xl bg-card border border-border hover:border-border/80 shadow-sm space-y-3.5 transition-all"
            >
              {/* Member Top Bar */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar src={user.avatar_url} name={user.full_name} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{user.full_name}</span>
                      {user.id === currentUser.id && (
                        <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.2 rounded font-semibold">
                          You
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={role}
                    onChange={(e) => updateMemberRole(workspaceId, user.id, e.target.value as WorkspaceRole)}
                    className="h-7 rounded border border-border bg-secondary px-2 text-[11px] font-medium text-foreground focus:outline-none"
                  >
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>

                  {user.id !== currentUser.id && (
                    <button
                      onClick={() => {
                        if (confirm(`Remove ${user.full_name} from this workspace?`)) {
                          removeMember(workspaceId, user.id);
                        }
                      }}
                      className="p-1 text-muted-foreground hover:text-red-400 rounded hover:bg-secondary transition-colors"
                      title="Remove member"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Stats Metrics Badges */}
              <div className="grid grid-cols-4 gap-2 text-center p-2 rounded-lg bg-secondary/40 border border-border/50 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Assigned</span>
                  <span className="font-bold text-foreground">{assignedCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Active</span>
                  <span className="font-bold text-sky-400">{activeCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Completed</span>
                  <span className="font-bold text-emerald-400">{completedCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Overdue</span>
                  <span className={`font-bold ${overdueCount > 0 ? "text-red-400" : "text-muted-foreground"}`}>
                    {overdueCount}
                  </span>
                </div>
              </div>

              {/* Workload Capacity Bar */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> Workload Capacity
                  </span>
                  <span className={`font-semibold ${isOverloaded ? "text-amber-400" : "text-muted-foreground"}`}>
                    {activeCount} active tasks {isOverloaded ? "(High Load)" : "(Optimal)"}
                  </span>
                </div>

                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 transition-all duration-300"
                    style={{ width: `${assignedCount > 0 ? (completedCount / assignedCount) * 100 : 0}%` }}
                    title="Completed"
                  />
                  <div
                    className="bg-sky-500 transition-all duration-300"
                    style={{ width: `${assignedCount > 0 ? (activeCount / assignedCount) * 100 : 0}%` }}
                    title="Active"
                  />
                  <div
                    className="bg-red-500 transition-all duration-300"
                    style={{ width: `${assignedCount > 0 ? (overdueCount / assignedCount) * 100 : 0}%` }}
                    title="Overdue"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <InviteMemberDialog open={isInviteOpen} onOpenChange={setIsInviteOpen} workspaceId={workspaceId} />
    </div>
  );
}
