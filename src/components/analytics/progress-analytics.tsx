"use client";

import React from "react";
import { usePlanForge } from "@/lib/store";
import { CheckCircle2, Clock, AlertTriangle, Flag, BarChart3, TrendingUp, Users } from "lucide-react";
import { GlassCard, ProgressBar, GlassPanel } from "@/components/ui/cinematic";

export function ProgressAnalytics({ workspaceId }: { workspaceId?: string }) {
  const { workspaces, tasks, goals, milestones, getWorkspaceStats, getWorkspaceMembers, allUsers } = usePlanForge();

  // Filter tasks and milestones based on context (workspace-specific vs global)
  const relevantTasks = tasks.filter((t) => !workspaceId || t.workspace_id === workspaceId);
  const relevantMilestones = milestones.filter((m) => !workspaceId || m.workspace_id === workspaceId);

  const stats = workspaceId
    ? getWorkspaceStats(workspaceId)
    : {
        progress: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === "done").length / tasks.length) * 100) : 0,
        completedTasks: tasks.filter(t => t.status === "done").length,
        totalTasks: tasks.length,
        activeTasks: tasks.filter(t => t.status !== "done").length,
        overdueTasks: tasks.filter(t => {
          if (t.status === "done" || !t.due_date) return false;
          return new Date(t.due_date).getTime() < Date.now();
        }).length,
        hoursRemaining: tasks.filter(t => t.status !== "done").reduce((acc, t) => acc + (t.estimated_hours || 0), 0),
      };

  // Status breakdown
  const doneTasks = relevantTasks.filter((t) => t.status === "done").length;
  const inProgressTasks = relevantTasks.filter((t) => t.status === "in_progress").length;
  const todoTasks = relevantTasks.filter((t) => t.status === "todo").length;
  const reviewTasks = relevantTasks.filter((t) => t.status === "review").length;
  const backlogTasks = relevantTasks.filter((t) => t.status === "backlog").length;

  if (relevantTasks.length === 0) {
    return (
      <GlassPanel className="py-16 text-center text-xs text-muted-foreground flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl">
        <BarChart3 className="h-10 w-10 text-muted-foreground/30 mb-3" />
        <h3 className="font-bold text-white mb-1">No activity yet</h3>
        <p className="text-[11px]">Once your team creates and starts completing tasks, real-time analytics will render here.</p>
      </GlassPanel>
    );
  }

  // --- CHART 1: TASK COMPLETION TREND (Line Chart last 7 Days) ---
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const formatMonthDay = (date: Date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  const trendData = last7Days.map(date => {
    const dateStr = date.toISOString().split("T")[0];
    const count = relevantTasks.filter(t => 
      t.status === "done" && 
      (t.updated_at?.startsWith(dateStr) || t.created_at?.startsWith(dateStr))
    ).length;
    return {
      label: formatMonthDay(date),
      count
    };
  });

  const chartW = 500;
  const chartH = 150;
  const padLeft = 30;
  const padRight = 10;
  const padTop = 15;
  const padBottom = 20;

  const maxVal = Math.max(...trendData.map(d => d.count), 4);

  const points = trendData.map((d, index) => {
    const x = padLeft + (index / 6) * (chartW - padLeft - padRight);
    const y = chartH - padBottom - (d.count / maxVal) * (chartH - padBottom - padTop);
    return { x, y, count: d.count, label: d.label };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartH - padBottom} L ${points[0].x} ${chartH - padBottom} Z`;

  // --- CHART 2: TASK STATUS DISTRIBUTION (Donut Chart) ---
  const donutData = [
    { label: "Todo", count: todoTasks, color: "#F59E0B" },
    { label: "In Progress", count: inProgressTasks, color: "#3B82F6" },
    { label: "Review", count: reviewTasks, color: "#A78BFA" },
    { label: "Done", count: doneTasks, color: "#10B981" },
    { label: "Backlog", count: backlogTasks, color: "#64748B" },
  ].filter(d => d.count > 0);

  const donutTotal = relevantTasks.length;
  const donutRadius = 45;
  const donutCircum = 2 * Math.PI * donutRadius; // ~282.7
  
  let accumulatedPercent = 0;

  const donutSlices = donutData.map(d => {
    const percent = d.count / donutTotal;
    const strokeDash = percent * donutCircum;
    const strokeOffset = donutCircum - (accumulatedPercent * donutCircum);
    accumulatedPercent += percent;
    return {
      ...d,
      strokeDash,
      strokeOffset,
    };
  });

  // --- CHART 3: TEAM WORKLOAD ---
  const teamMembers = (workspaceId
    ? getWorkspaceMembers(workspaceId).map((m) => m.profile)
    : allUsers
  ).filter((m): m is NonNullable<typeof m> => !!m);

  const teamWorkload = teamMembers.map(member => {
    const memberTasks = relevantTasks.filter(t => t.assigned_to === member.id);
    const done = memberTasks.filter(t => t.status === "done").length;
    const active = memberTasks.length - done;
    return {
      name: member.full_name,
      total: memberTasks.length,
      done,
      active,
    };
  }).filter(t => t.total > 0)
    .sort((a, b) => b.total - a.total);

  // --- CHART 5: AT RISK / OVERDUE/ ON TRACK ---
  const overdueCount = stats.overdueTasks;
  const totalRelevant = relevantTasks.length;
  const doneCount = relevantTasks.filter(t => t.status === "done").length;
  
  // Calculate At Risk: tasks overdue + high priority tasks not completed
  const atRiskCount = relevantTasks.filter(t => {
    if (t.status === "done") return false;
    const isHigh = t.priority === "high" || t.priority === "urgent";
    const isOverdue = t.due_date ? new Date(t.due_date).getTime() < Date.now() : false;
    return isOverdue || isHigh;
  }).length;

  const onTrackCount = Math.max(0, totalRelevant - overdueCount - atRiskCount);

  return (
    <div className="space-y-6 animate-cinematic-in">
      {/* ROW 1: Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="hover:border-blue-500/20">
          <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-2">
            <span>Overall Progress</span>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-3xl font-light font-mono text-white tracking-tight">{stats.progress}%</div>
          <div className="mt-3">
            <ProgressBar value={stats.progress} />
          </div>
        </GlassCard>

        <GlassCard className="hover:border-emerald-500/20">
          <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-2">
            <span>Completed Tasks</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-light font-mono text-white tracking-tight">
            {stats.completedTasks} <span className="text-xs text-muted-foreground font-normal">/ {stats.totalTasks}</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">Shipped sprint deliverable units</p>
        </GlassCard>

        <GlassCard className="hover:border-cyan-500/20">
          <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-2">
            <span>Active Sprint Tasks</span>
            <Clock className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-light font-mono text-cyan-400 tracking-tight">{stats.activeTasks}</div>
          <p className="text-[10px] text-muted-foreground mt-2">{stats.hoursRemaining} estimated hours left</p>
        </GlassCard>

        <GlassCard className={`hover:border-red-500/20 ${stats.overdueTasks > 0 ? "border-red-500/25 bg-red-950/5" : ""}`}>
          <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground tracking-wider uppercase mb-2">
            <span>Overdue Tasks</span>
            <AlertTriangle className={`h-4 w-4 ${stats.overdueTasks > 0 ? "text-red-400 animate-pulse" : "text-muted-foreground"}`} />
          </div>
          <div className={`text-3xl font-light font-mono tracking-tight ${stats.overdueTasks > 0 ? "text-red-400" : "text-white"}`}>
            {stats.overdueTasks}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">Requires sprint re-allocation</p>
        </GlassCard>
      </div>

      {/* ROW 2: Task Completion Trend | Task Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Completion Trend (Line Chart) */}
        <GlassPanel className="space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" /> Task Completion Trend
          </h3>
          <div className="w-full">
            <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto text-muted-foreground overflow-visible">
              <defs>
                <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.00" />
                </linearGradient>
              </defs>
              {/* Horizontal gridlines */}
              {Array.from({ length: 4 }).map((_, i) => {
                const y = padTop + (i / 3) * (chartH - padTop - padBottom);
                const labelVal = Math.round(maxVal - (i / 3) * maxVal);
                return (
                  <g key={i} className="opacity-40">
                    <line
                      x1={padLeft}
                      y1={y}
                      x2={chartW - padRight}
                      y2={y}
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth={1}
                    />
                    <text x={padLeft - 8} y={y + 4} textAnchor="end" fontSize="9" fill="currentColor" className="font-mono">
                      {labelVal}
                    </text>
                  </g>
                );
              })}
              {/* Area Under Path */}
              {doneTasks > 0 && (
                <path d={areaD} fill="url(#area-gradient)" className="animate-draw" />
              )}
              {/* Line Path */}
              {doneTasks > 0 && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {/* Circle Points */}
              {points.map((p, i) => (
                <g key={i} className="group cursor-pointer">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={3.5}
                    fill="#0C111D"
                    stroke="#60A5FA"
                    strokeWidth={1.5}
                    className="hover:r-5 transition-all"
                  />
                  <text
                    x={p.x}
                    y={chartH - 4}
                    textAnchor="middle"
                    fontSize="9"
                    fill="rgba(255,255,255,0.4)"
                    className="font-mono"
                  >
                    {p.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </GlassPanel>

        {/* Task Status Distribution (Donut Chart) */}
        <GlassPanel className="space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-purple-400" /> Status Distribution
          </h3>
          
          <div className="flex items-center justify-around gap-4 flex-wrap">
            <div className="relative h-32 w-32 shrink-0">
              <svg viewBox="0 0 150 150" className="w-full h-full -rotate-90">
                <circle
                  cx="75"
                  cy="75"
                  r={donutRadius}
                  fill="transparent"
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="15"
                />
                {donutSlices.map((slice, i) => (
                  <circle
                    key={i}
                    cx="75"
                    cy="75"
                    r={donutRadius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth="15"
                    strokeDasharray={`${slice.strokeDash} ${donutCircum}`}
                    strokeDashoffset={slice.strokeOffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-semibold text-white font-mono">{donutTotal}</span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Tasks</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs font-semibold">
              {donutData.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-muted-foreground min-w-[70px]">{d.label}</span>
                  <span className="text-white font-mono">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* ROW 3: Team Workload | Milestone Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Workload */}
        <GlassPanel className="space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" /> Team Workload
          </h3>
          
          <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
            {teamWorkload.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-6 text-center">No assigned workloads recorded.</p>
            ) : (
              teamWorkload.map((m, idx) => {
                const pctDone = m.total > 0 ? (m.done / m.total) * 100 : 0;
                const pctActive = m.total > 0 ? (m.active / m.total) * 100 : 0;
                return (
                  <div key={idx} className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">{m.name}</span>
                      <span className="font-mono text-muted-foreground text-[11px]">
                        {m.done} completed / {m.total} total
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
                        style={{ width: `${pctDone}%` }}
                      />
                      <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${pctActive}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </GlassPanel>

        {/* Milestone Progress */}
        <GlassPanel className="space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Flag className="h-4 w-4 text-emerald-400" /> Milestone Checkpoints
          </h3>

          <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
            {relevantMilestones.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-6 text-center">No milestones defined yet.</p>
            ) : (
              relevantMilestones.map((m) => {
                const mTasks = tasks.filter((t) => t.milestone_id === m.id);
                const mDone = mTasks.filter((t) => t.status === "done").length;
                const mPercent = mTasks.length > 0 ? Math.round((mDone / mTasks.length) * 100) : m.status === "completed" ? 100 : 0;

                return (
                  <div key={m.id} className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all duration-300">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-white truncate max-w-[220px]">{m.title}</span>
                      <span className="font-mono text-blue-400 font-bold">{mPercent}%</span>
                    </div>
                    <ProgressBar value={mPercent} />
                  </div>
                );
              })
            )}
          </div>
        </GlassPanel>
      </div>

      {/* ROW 4: Overdue / At-Risk Indicators */}
      <GlassPanel className="p-5">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
          Project Health & Delivery Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center gap-3.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] shrink-0 animate-pulse" />
            <div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase">On Track</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">{onTrackCount} Tasks</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center gap-3.5">
            <span className="h-3 w-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] shrink-0" />
            <div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase">At Risk</div>
              <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">{atRiskCount} Tasks</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center gap-3.5">
            <span className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] shrink-0" />
            <div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase">Overdue</div>
              <div className="text-xl font-bold font-mono text-red-400 mt-0.5">{overdueCount} Tasks</div>
            </div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
