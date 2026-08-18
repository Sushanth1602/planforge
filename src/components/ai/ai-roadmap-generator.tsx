"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { usePlanForge } from "@/lib/store";
import { AIRoadmapPlan } from "@/types/planforge";
import { Sparkles, ArrowRight, CheckCircle2, Flag, Layers, Users, Clock, Zap } from "lucide-react";
import confetti from "canvas-confetti";

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
    <div className="space-y-6">
      {/* Generator Prompt Box */}
      <div className="p-5 rounded-xl bg-card border border-border shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">AI Roadmap & Sprint Generator</h3>
            <p className="text-xs text-muted-foreground">
              Describe your project goal, timeframe, and team size. PlanForge will synthesize structured goals, milestones, tasks, and role assignments.
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Project Intent / Sprint Prompt *</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. We have 5 days to build an AI-powered attendance system with 4 people..."
              rows={2}
              required
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Duration (Days)</label>
              <Input
                type="number"
                min="1"
                max="90"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Team Size</label>
              <Input
                type="number"
                min="1"
                max="20"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
              />
            </div>

            <div className="col-span-2 flex items-end">
              <Button type="submit" className="w-full h-9 gap-2" isLoading={isLoading}>
                <Zap className="h-4 w-4" />
                <span>Generate Roadmap Plan</span>
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Generated Roadmap Preview */}
      {generatedPlan && (
        <div className="p-5 rounded-xl bg-card border border-primary/40 shadow-md space-y-5 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-primary/20 text-primary">
                  Generated Plan
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {generatedPlan.estimated_duration_days} Days Sprint
                </span>
              </div>
              <h4 className="text-sm font-bold text-foreground mt-1">{generatedPlan.summary}</h4>
            </div>

            <Button
              size="sm"
              onClick={handleApply}
              disabled={isApplied}
              className={isApplied ? "bg-emerald-600 hover:bg-emerald-600" : ""}
            >
              {isApplied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Applied to Workspace!
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-1" /> Apply 1-Click to Workspace
                </>
              )}
            </Button>
          </div>

          {/* Goals Hierarchy */}
          <div className="space-y-4">
            {generatedPlan.goals.map((g, gIdx) => (
              <div key={gIdx} className="p-4 rounded-lg bg-secondary/30 border border-border space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-xs font-bold text-foreground">{g.title}</span>
                  </div>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-secondary text-primary border border-border">
                    {g.priority}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{g.description}</p>

                {/* Milestones list */}
                <div className="space-y-2.5 pl-4 border-l border-border/80 ml-1">
                  {g.milestones.map((m, mIdx) => (
                    <div key={mIdx} className="p-2.5 rounded bg-card/70 border border-border/60 space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Flag className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span className="font-semibold text-foreground">{m.title}</span>
                      </div>

                      {/* Tasks */}
                      <div className="space-y-1.5 pl-5">
                        {m.tasks.map((t, tIdx) => (
                          <div
                            key={tIdx}
                            className="flex items-center justify-between p-1.5 rounded bg-secondary/40 text-[11px]"
                          >
                            <span className="text-foreground font-medium">{t.title}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground font-mono">{t.estimated_hours}h</span>
                              <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.2 rounded">
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
      <div className="p-5 rounded-xl bg-card border border-border shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-sm font-bold text-foreground">AI Progress & Risk Assistant</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Inspects real workspace velocity, bottlenecks, overdue items, and assignee workloads.
          </p>
        </div>

        <Button size="sm" onClick={handleAnalyze} isLoading={isLoading} className="gap-2">
          <Sparkles className="h-4 w-4" />
          <span>Analyze Current Workspace</span>
        </Button>
      </div>

      {analysis && (
        <div className="p-5 rounded-xl bg-card border border-border shadow-md space-y-5 animate-in fade-in zoom-in-95">
          {/* Health Score Header */}
          <div className="flex items-center justify-between gap-4 flex-wrap p-4 rounded-xl bg-secondary/40 border border-border">
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">Project Health Rating</span>
              <div className="text-2xl font-black font-mono mt-0.5 text-foreground">
                {analysis.health_score} <span className="text-xs text-muted-foreground font-normal">/ 100</span>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${
                  analysis.overall_status === "On Track"
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : analysis.overall_status === "At Risk"
                    ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                    : "bg-red-500/15 text-red-400 border-red-500/30"
                }`}
              >
                {analysis.overall_status}
              </span>
            </div>
          </div>

          <p className="text-xs text-foreground leading-relaxed">{analysis.summary}</p>

          {/* Risk Factors */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Identified Risk Factors</h4>
            <div className="grid grid-cols-1 gap-2.5">
              {analysis.risk_factors.map((rf: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs space-y-1 ${
                    rf.severity === "high"
                      ? "bg-red-500/10 border-red-500/30 text-red-300"
                      : rf.severity === "medium"
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                      : "bg-secondary/40 border-border text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span>{rf.category}</span>
                    <span className="text-[10px] uppercase">{rf.severity}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{rf.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Actionable Recommendations</h4>
            <div className="space-y-1.5">
              {analysis.recommendations.map((rec: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-xs p-2 rounded bg-secondary/30 border border-border/50 text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
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
