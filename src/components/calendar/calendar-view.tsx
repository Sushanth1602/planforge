"use client";

import React, { useState } from "react";
import { usePlanForge } from "@/lib/store";
import { TaskModal } from "@/components/tasks/task-modal";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Flag, Layers, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CalendarView({ workspaceId }: { workspaceId?: string }) {
  const { tasks, milestones, workspaces } = usePlanForge();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Filter items by workspace if provided
  const relevantTasks = tasks.filter((t) => (!workspaceId || t.workspace_id === workspaceId) && t.due_date);
  const relevantMilestones = milestones.filter(
    (m) => (!workspaceId || m.workspace_id === workspaceId) && m.due_date
  );

  const prevPeriod = () => {
    if (viewMode === "month") setCurrentDate(subMonths(currentDate, 1));
    else setCurrentDate(subWeeks(currentDate, 1));
  };

  const nextPeriod = () => {
    if (viewMode === "month") setCurrentDate(addMonths(currentDate, 1));
    else setCurrentDate(addWeeks(currentDate, 1));
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(viewMode === "month" ? monthStart : currentDate);
  const calendarEnd = endOfWeek(viewMode === "month" ? monthEnd : currentDate);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div className="space-y-4">
      {/* Calendar Controls Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-card/60 p-3.5 rounded-xl border border-border">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-foreground">
            {format(currentDate, viewMode === "month" ? "MMMM yyyy" : "'Week of' MMM d, yyyy")}
          </h2>
          <div className="flex items-center rounded-lg border border-border bg-secondary/50 p-0.5">
            <button
              onClick={prevPeriod}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Today
            </button>
            <button
              onClick={nextPeriod}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border bg-secondary/50 p-0.5 text-xs">
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                viewMode === "month" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                viewMode === "week" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-border bg-secondary/40 text-center py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-border/60">
          {days.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            const dayTasks = relevantTasks.filter((t) => t.due_date && isSameDay(new Date(t.due_date), day));
            const dayMilestones = relevantMilestones.filter((m) => m.due_date && isSameDay(new Date(m.due_date), day));

            return (
              <div
                key={idx}
                className={`min-h-[110px] p-2 transition-colors flex flex-col justify-between ${
                  !isCurrentMonth ? "bg-secondary/15 text-muted-foreground/40" : "bg-card"
                } ${isToday ? "ring-1 ring-inset ring-primary bg-primary/5" : ""}`}
              >
                {/* Day Header Number */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-semibold h-5 w-5 flex items-center justify-center rounded-full ${
                      isToday ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                  {(dayTasks.length > 0 || dayMilestones.length > 0) && (
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {dayTasks.length + dayMilestones.length}
                    </span>
                  )}
                </div>

                {/* Deadlines Items */}
                <div className="space-y-1 overflow-y-auto max-h-[80px]">
                  {/* Milestones first */}
                  {dayMilestones.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold truncate"
                    >
                      <Flag className="h-2.5 w-2.5 shrink-0" />
                      <span className="truncate">{m.title}</span>
                    </div>
                  ))}

                  {/* Tasks */}
                  {dayTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTaskId(t.id)}
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-medium truncate cursor-pointer transition-all hover:scale-[1.02] ${
                        t.status === "done"
                          ? "bg-secondary/60 text-muted-foreground border-border line-through"
                          : t.priority === "urgent"
                          ? "bg-red-500/10 text-red-400 border-red-500/30 font-semibold"
                          : "bg-sky-500/10 text-sky-400 border-sky-500/30"
                      }`}
                    >
                      <CheckSquare className="h-2.5 w-2.5 shrink-0" />
                      <span className="truncate">{t.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedTaskId && (
        <TaskModal
          taskId={selectedTaskId}
          open={Boolean(selectedTaskId)}
          onOpenChange={(open) => !open && setSelectedTaskId(null)}
        />
      )}
    </div>
  );
}
