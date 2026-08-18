"use client";

import React, { useState } from "react";
import { Goal, Milestone, Task } from "@/types/planforge";
import { usePlanForge } from "@/lib/store";
import { Progress } from "@/components/ui/avatar";
import { formatDate, getPriorityColor } from "@/lib/utils";
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
      <div className="rounded-xl border border-border bg-card/60 overflow-hidden shadow-sm hover:border-border/80 transition-all">
        {/* Goal Header */}
        <div className="p-4 sm:p-5 border-b border-border/80 bg-secondary/20">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-0.5 p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getPriorityColor(
                      goal.priority
                    )}`}
                  >
                    {goal.priority}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                    <Target className="h-3 w-3 text-primary" /> Goal
                  </span>
                  {goal.target_date && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Target: {formatDate(goal.target_date)}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-foreground">{goal.title}</h3>
                {goal.description && (
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{goal.description}</p>
                )}
              </div>
            </div>

            {/* Goal Actions & Overall Progress */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddMilestoneOpen(true)}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Milestone
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete this goal and all nested milestones?")) deleteGoal(goal.id);
                  }}
                  className="p-1 text-muted-foreground hover:text-red-400 rounded hover:bg-secondary"
                  title="Delete Goal"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-muted-foreground">Progress:</span>
                <span className="text-primary font-mono">{goalProgress}%</span>
              </div>
            </div>
          </div>

          {/* Goal Progress Bar */}
          <div className="mt-3">
            <Progress value={goalProgress} className="h-1.5" />
          </div>
        </div>

        {/* Milestones & Child Tasks Body */}
        {isExpanded && (
          <div className="p-4 sm:p-5 space-y-4">
            {goalMilestones.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
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
                    className="p-3.5 rounded-lg bg-secondary/30 border border-border space-y-3"
                  >
                    {/* Milestone Header */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Flag className="h-4 w-4 text-primary shrink-0" />
                        <h4 className="text-xs font-bold text-foreground truncate">{milestone.title}</h4>
                        {milestone.due_date && (
                          <span className="text-[11px] text-muted-foreground shrink-0 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {formatDate(milestone.due_date)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-medium text-muted-foreground">
                          {mDone}/{mTotal} tasks ({mProgress}%)
                        </span>
                        <button
                          onClick={() => setCreateTaskMilestoneId(milestone.id)}
                          className="p-1 rounded text-primary hover:bg-primary/10 transition-colors"
                          title="Add task to milestone"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this milestone?")) deleteMilestone(milestone.id);
                          }}
                          className="p-1 text-muted-foreground hover:text-red-400 rounded"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Milestone Tasks list */}
                    {milestoneTasks.length > 0 ? (
                      <div className="space-y-1.5 pl-6 border-l-2 border-primary/30 ml-2">
                        {milestoneTasks.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => setSelectedTaskId(task.id)}
                            className="flex items-center justify-between p-2 rounded-md bg-card/80 hover:bg-card border border-border/60 hover:border-primary/40 cursor-pointer text-xs group"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveTaskStatus(task.id, task.status === "done" ? "todo" : "done");
                                }}
                                className="text-muted-foreground hover:text-emerald-400"
                              >
                                <CheckCircle2
                                  className={`h-4 w-4 ${
                                    task.status === "done" ? "text-emerald-400 fill-emerald-400/20" : ""
                                  }`}
                                />
                              </button>
                              <span
                                className={`truncate font-medium ${
                                  task.status === "done" ? "line-through text-muted-foreground" : "text-foreground"
                                }`}
                              >
                                {task.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-semibold ${getPriorityColor(
                                  task.priority
                                )}`}
                              >
                                {task.priority}
                              </span>
                              <span className="text-[10px] uppercase text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                                {task.status}
                              </span>
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
