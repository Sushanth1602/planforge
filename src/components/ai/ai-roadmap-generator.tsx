"use client";

import React, { useState } from "react";
import { usePlanForge } from "@/lib/store";
import { AIRoadmapPlan } from "@/types/planforge";
import { Sparkles, CheckCircle2, Flag, Layers, Clock, Zap } from "lucide-react";
import confetti from "canvas-confetti";
import { GlassCard, GlassPanel, GlassButton, GlassInput, GlassTextarea, StatusBadge, ProgressBar } from "@/components/ui/cinematic";

export function AIRoadmapGenerator({ workspaceId }: { workspaceId: string }) {
  const { applyAIRoadmap, workspaces } = usePlanForge();
  const currentWs = workspaces.find((w) => w.id === workspaceId);

  const [prompt, setPrompt] = useState("We have 5 days to build an AI-powered attendance system with 4 people.");
  const [durationDays, setDurationDays] = useState("5");
  const [teamSize, setTeamSize] = useState("4");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<AIRoadmapPlan | null>(null);
  const [isApplied, setIsApplied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setIsApplied(false);
    try {
      const res = await fetch("/api/ai/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          workspaceName: currentWs?.name || "Workspace",
          durationDays: Number(durationDays) || 5,
          teamSize: Number(teamSize) || 4,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate");
      const data = await res.json();
      setGeneratedPlan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!generatedPlan) return;
    applyAIRoadmap(workspaceId, generatedPlan);
    setIsApplied(true);
    try {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch {}
  };

  return (
    <div className="space-y-6 animate-cinematic-in">
      {/* Generator Prompt Box */}
      <GlassPanel className="space-y-4 hover:border-blue-500/20 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Planning Intelligence</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Turn an objective into an executable plan. Describe intent, duration, and team size.
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4 pt-1">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Project Intent / Sprint Prompt *</label>
            <GlassTextarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. We have 5 days and 4 teammates to build an AI resume analyzer..."
              rows={2}
              required
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Duration (Days)</label>
              <GlassInput
                type="number"
                min="1"
                max="90"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Team Size</label>
              <GlassInput
                type="number"
                min="1"
                max="20"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
              />
            </div>

            <div className="col-span-2 flex items-end">
              <GlassButton type="submit" variant="primary" className="w-full h-9.5 gap-2" isLoading={isLoading}>
                <Zap className="h-4 w-4" />
                <span>Generate Plan</span>
              </GlassButton>
            </div>
          </div>
        </form>
      </GlassPanel>

      {/* Generated Roadmap Preview */}
      {generatedPlan && (
        <div className="p-5 rounded-2xl border border-blue-500/20 bg-white/[0.005] shadow-[0_8px_32px_rgba(0,0,0,0.37)] space-y-5 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-white/5">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/10 px-2 py-0.5 rounded-full">
                  AI Roadmap
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                  <Clock className="h-3.5 w-3.5" /> {generatedPlan.estimated_duration_days} Days Sprint
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">{generatedPlan.summary}</h4>
            </div>

            <GlassButton
              size="sm"
              variant={isApplied ? "ghost" : "primary"}
              onClick={handleApply}
              disabled={isApplied}
              className={isApplied ? "text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 hover:translate-y-0" : ""}
            >
              {isApplied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-1.5" /> Applied
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-1.5" /> Apply to Workspace
                </>
              )}
            </GlassButton>
          </div>

          {/* Goals Hierarchy */}
          <div className="space-y-4">
            {generatedPlan.goals.map((g, gIdx) => (
              <div key={gIdx} className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="text-xs font-bold text-white">{g.title}</span>
                  </div>
                  <StatusBadge value={g.priority} />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{g.description}</p>

                {/* Milestones list */}
                <div className="space-y-2.5 pl-4 border-l border-white/5 ml-1">
                  {g.milestones.map((m, mIdx) => (
                    <div key={mIdx} className="p-3 rounded-lg bg-white/[0.005] border border-white/5 space-y-2.5 text-xs">
                      <div className="flex items-center gap-2">
                        <Flag className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span className="font-semibold text-white">{m.title}</span>
                      </div>

                      {/* Tasks */}
                      <div className="space-y-1.5 pl-5">
                        {m.tasks.map((t, tIdx) => (
                          <div
                            key={tIdx}
                            className="flex items-center justify-between p-2 rounded-lg bg-white/[0.015] border border-white/5 text-[11px]"
                          >
                            <span className="text-white font-medium">{t.title}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground font-mono">{t.estimated_hours}h</span>
                              <span className="text-[9px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded">
                                {t.suggested_role}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function AIRiskAssistant({ workspaceId }: { workspaceId: string }) {
  const { workspaces, tasks, members, getWorkspaceStats } = usePlanForge();
  const currentWs = workspaces.find((w) => w.id === workspaceId);
  const stats = getWorkspaceStats(workspaceId);
  const wsTasks = tasks.filter((t) => t.workspace_id === workspaceId);
  const unassignedTasksCount = wsTasks.filter((t) => !t.assigned_to).length;
  const wsMembers = members.filter((m) => m.workspace_id === workspaceId);

  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/analyze-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceData: {
            name: currentWs?.name,
            totalTasks: stats.totalTasks,
            completedTasks: stats.completedTasks,
            overdueTasks: stats.overdueTasks,
            activeTasks: stats.activeTasks,
            unassignedTasks: unassignedTasksCount,
            memberCount: wsMembers.length,
            deadline: currentWs?.deadline,
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to analyze");
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <GlassPanel className="flex items-center justify-between gap-4 flex-wrap hover:border-blue-500/20 transition-all duration-300">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Progress & Risk Assistant</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Inspect real workspace velocity, bottlenecks, overdue items, and workloads.
          </p>
        </div>

        <GlassButton size="sm" onClick={handleAnalyze} isLoading={isLoading} className="gap-2">
          <Sparkles className="h-4 w-4 text-blue-400" />
          <span>Analyze Workspace</span>
        </GlassButton>
      </GlassPanel>

      {analysis && (
        <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.005] shadow-[0_8px_32px_rgba(0,0,0,0.37)] space-y-5 animate-in fade-in zoom-in-95 duration-300">
          {/* Health Score Header */}
          <div className="flex items-center justify-between gap-4 flex-wrap p-4 rounded-xl bg-white/[0.015] border border-white/5">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">PROJECT HEALTH</span>
              <div className="text-2xl font-black font-mono mt-0.5 text-white">
                {analysis.health_score}%
              </div>
            </div>

            <div className="text-right">
              <span
                className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${
                  analysis.overall_status === "On Track"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : analysis.overall_status === "At Risk"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
                    : "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse"
                }`}
              >
                {analysis.overall_status}
              </span>
            </div>
          </div>

          <p className="text-xs text-white leading-relaxed">{analysis.summary}</p>

          {/* Risk Factors */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Identified Risk Factors</h4>
            <div className="grid grid-cols-1 gap-3">
              {analysis.risk_factors.map((rf: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                    rf.severity === "high"
                      ? "bg-red-950/10 border-red-550/20 text-red-300 shadow-[inset_0_1px_1px_rgba(239,68,68,0.05)]"
                      : rf.severity === "medium"
                      ? "bg-amber-950/10 border-amber-550/20 text-amber-300 shadow-[inset_0_1px_1px_rgba(245,158,11,0.05)]"
                      : "bg-white/[0.01] border-white/5 text-white"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{rf.category}</span>
                    <span className="text-[9px] uppercase font-mono">{rf.severity} risk</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mt-1">{rf.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Actionable Recommendations</h4>
            <div className="space-y-2">
              {analysis.recommendations.map((rec: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs p-2.5 rounded-xl bg-white/[0.01] border border-white/5 text-white">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
