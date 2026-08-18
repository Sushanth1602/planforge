"use client";

import React from "react";
import { CalendarView } from "@/components/calendar/calendar-view";
import { Calendar as CalendarIcon } from "lucide-react";

export default function GlobalCalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-primary" /> Master Schedule & Deadlines
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cross-workspace timeline of task deadlines, milestone checkpoints, and project deliveries.
          </p>
        </div>
      </div>

      <CalendarView />
    </div>
  );
}
