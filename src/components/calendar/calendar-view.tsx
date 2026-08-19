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
import { ChevronLeft, ChevronRight, Flag, CheckSquare } from "lucide-react";
import { GlassButton, GlassCard } from "@/components/ui/cinematic";

export function CalendarView({ workspaceId }: { workspaceId?: string }) {
  const { tasks, milestones } = usePlanForge();
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
    <div className="space-y-4 animate-cinematic-in pb-12">
      {/* Calendar Controls Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-white/[0.015] border border-white/5 p-3 rounded-2xl">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-white tracking-wide">
            {format(currentDate, viewMode === "month" ? "MMMM yyyy" : "'Week of' MMM d, yyyy")}
          </h2>
          <div className="flex items-center rounded-xl border border-white/5 bg-black/40 p-0.5">
            <button
              onClick={prevPeriod}
              className="p-1 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:text-white transition-all"
            >
              Today
            </button>
            <button
              onClick={nextPeriod}
              className="p-1 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-white/5 bg-black/40 p-0.5 text-xs">
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition-all ${
                viewMode === "month"
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition-all ${
                viewMode === "week"
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.005] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-white/5 bg-white/[0.01] text-center py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-white/5 border-t border-white/5">
          {days.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            const dayTasks = relevantTasks.filter((t) => t.due_date && isSameDay(new Date(t.due_date), day));
            const dayMilestones = relevantMilestones.filter((m) => m.due_date && isSameDay(new Date(m.due_date), day));

            return (
              <div
                key={idx}
                className={`min-h-[110px] p-2 flex flex-col justify-between transition-all duration-300 ${
                  !isCurrentMonth ? "bg-white/[0.002] text-muted-foreground/30" : "bg-transparent"
                } ${isToday ? "border border-blue-500/30 bg-blue-500/[0.02] shadow-[0_0_15px_rgba(59,130,246,0.1)]" : ""}`}
              >
                {/* Day Header Number */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[11px] font-bold h-5 w-5 flex items-center justify-center rounded-full ${
                      isToday ? "bg-blue-600 text-white font-extrabold shadow-md shadow-blue-500/20" : "text-muted-foreground"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                  {(dayTasks.length > 0 || dayMilestones.length > 0) && (
                    <span className="text-[9px] text-muted-foreground font-mono">
                      {dayTasks.length + dayMilestones.length}
                    </span>
                  )}
                </div>

                {/* Deadlines Items */}
                <div className="space-y-1.5 overflow-y-auto max-h-[85px] scrollbar-none">
                  {/* Milestones first */}
                  {dayMilestones.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 text-[9px] font-bold truncate"
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
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg border text-[9px] font-semibold truncate cursor-pointer transition-all duration-300 hover:translate-y-[-1px] ${
                        t.status === "done"
                          ? "bg-white/5 text-muted-foreground border-white/5 line-through"
                          : t.priority === "urgent"
                          ? "bg-red-500/10 text-red-400 border-red-500/20 font-bold"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
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
