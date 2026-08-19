"use client";

import React, { useState } from "react";
import { Goal, Milestone, Task } from "@/types/planforge";
import { usePlanForge } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { CreateMilestoneDialog } from "@/components/goals/create-goal-dialog";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { TaskModal } from "@/components/tasks/task-modal";
import {
  Target,
  Flag,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { StatusBadge, ProgressBar, GlassCard, GlassPanel, GlassButton } from "@/components/ui/cinematic";

export function GoalCard({ goal }: { goal: Goal }) {
  const { milestones, tasks, deleteGoal, deleteMilestone, updateMilestone, moveTaskStatus } = usePlanForge();

  const [isExpanded, setIsExpanded] = useState(true);
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [createTaskMilestoneId, setCreateTaskMilestoneId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const goalMilestones = milestones
    .filter((m) => m.goal_id === goal.id)
    .sort((a, b) => a.order_index - b.order_index);

  const goalTasks = tasks.filter((t) => t.goal_id === goal.id);
  const totalTasks = goalTasks.length;
  const completedTasks = goalTasks.filter((t) => t.status === "done").length;
  const goalProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <>
      <div className="rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.37)] hover:border-white/10 transition-all duration-300">
        {/* Goal Header */}
        <div className="p-4 sm:p-5 border-b border-white/5 bg-white/[0.005]">
          <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-0.5 p-1 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-all"
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <StatusBadge value={goal.priority} />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1">
                    <Target className="h-3.5 w-3.5 text-blue-500" /> Goal Objective
                  </span>
                  {goal.target_date && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                      <Calendar className="h-3.5 w-3.5" /> Target: {formatDate(goal.target_date)}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-semibold text-white tracking-[-0.015em]">{goal.title}</h3>
                {goal.description && (
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{goal.description}</p>
                )}
              </div>
            </div>

            {/* Goal Actions & Overall Progress */}
            <div className="flex flex-col items-end gap-2.5 shrink-0 ml-7 sm:ml-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddMilestoneOpen(true)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-500/10 text-blue-400 hover:bg-blue-500/15 border border-blue-500/15 transition-all flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Milestone
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete this goal and all nested milestones?")) deleteGoal(goal.id);
                  }}
                  className="p-1 text-muted-foreground hover:text-red-400 rounded-lg hover:bg-white/5 transition-all"
                  title="Delete Goal"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-muted-foreground font-medium">Goal Progress:</span>
                <span className="text-blue-400 font-mono">{goalProgress}%</span>
              </div>
            </div>
          </div>

          {/* Goal Progress Bar */}
          <div className="mt-4">
            <ProgressBar value={goalProgress} />
          </div>
        </div>

        {/* Milestones & Child Tasks Body */}
        {isExpanded && (
          <div className="p-4 sm:p-5 space-y-4 bg-transparent">
            {goalMilestones.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground border border-dashed border-white/5 rounded-xl italic">
                No milestones added yet. Add a milestone to break down this goal into actionable steps.
              </div>
            ) : (
              goalMilestones.map((milestone) => {
                const milestoneTasks = tasks.filter((t) => t.milestone_id === milestone.id);
                const mTotal = milestoneTasks.length;
                const mDone = milestoneTasks.filter((t) => t.status === "done").length;
                const mProgress = mTotal > 0 ? Math.round((mDone / mTotal) * 100) : milestone.status === "completed" ? 100 : 0;

                return (
                  <div
                    key={milestone.id}
                    className="p-4 rounded-xl bg-white/[0.005] border border-white/5 space-y-3.5 hover:border-white/10 transition-all duration-300"
                  >
                    {/* Milestone Header */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 min-w-0">
                        <Flag className="h-4 w-4 text-emerald-400 shrink-0" />
                        <h4 className="text-xs font-bold text-white truncate">{milestone.title}</h4>
                        {milestone.due_date && (
                          <span className="text-[11px] text-muted-foreground shrink-0 flex items-center gap-1 font-mono">
                            <Clock className="h-3.5 w-3.5" /> Due {formatDate(milestone.due_date)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-medium text-muted-foreground">
                          {mDone}/{mTotal} tasks ({mProgress}%)
                        </span>
                        <button
                          onClick={() => setCreateTaskMilestoneId(milestone.id)}
                          className="p-1 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/15 border border-blue-500/15 transition-all"
                          title="Add task to milestone"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this milestone?")) deleteMilestone(milestone.id);
                          }}
                          className="p-1 text-muted-foreground hover:text-red-400 rounded hover:bg-white/5 transition-all"
                          title="Delete Milestone"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Milestone Tasks list */}
                    {milestoneTasks.length > 0 ? (
                      <div className="space-y-2 pl-4 border-l border-white/10 ml-2 relative">
                        {milestoneTasks.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => setSelectedTaskId(task.id)}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.015] hover:bg-white/[0.03] border border-white/5 hover:border-blue-500/30 cursor-pointer text-xs group transition-all duration-300"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveTaskStatus(task.id, task.status === "done" ? "todo" : "done");
                                }}
                                className="text-muted-foreground hover:text-emerald-400 transition-colors"
                              >
                                <CheckCircle2
                                  className={`h-4.5 w-4.5 ${
                                    task.status === "done" ? "text-emerald-400 fill-emerald-500/10" : ""
                                  }`}
                                />
                              </button>
                              <span
                                className={`truncate font-medium ${
                                  task.status === "done" ? "line-through text-muted-foreground" : "text-white"
                                }`}
                              >
                                {task.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <StatusBadge value={task.priority} />
                              <StatusBadge value={task.status} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] text-muted-foreground italic pl-6">
                        No tasks assigned to this milestone yet. Click &ldquo;+&rdquo; to add a task.
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateMilestoneDialog
        open={isAddMilestoneOpen}
        onOpenChange={setIsAddMilestoneOpen}
        goalId={goal.id}
        workspaceId={goal.workspace_id}
      />

      {createTaskMilestoneId && (
        <CreateTaskDialog
          open={Boolean(createTaskMilestoneId)}
          onOpenChange={(open) => !open && setCreateTaskMilestoneId(null)}
          defaultWorkspaceId={goal.workspace_id}
        />
      )}

      {selectedTaskId && (
        <TaskModal
          taskId={selectedTaskId}
          open={Boolean(selectedTaskId)}
          onOpenChange={(open) => !open && setSelectedTaskId(null)}
        />
      )}
    </>
  );
}
