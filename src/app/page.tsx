"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Flag, Layers, Target, Trophy, Sparkles, Shield, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20">
      {/* Top Navbar */}
      <header className="h-16 border-b border-border/80 px-6 sm:px-12 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-40">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md shadow-primary/20">
            PF
          </div>
          <span className="font-bold text-base tracking-tight">PlanForge</span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24 text-center max-w-5xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/50 text-xs text-muted-foreground font-medium animate-in fade-in">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Engineered for Hackathons, Learning & Engineering Teams</span>
        </div>

        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Plan together. Build together. <span className="text-primary">Finish together.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            PlanForge helps teams organize hackathons, projects, learning goals, and everything in between.
          </p>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto px-8 gap-2 font-semibold shadow-lg shadow-primary/25">
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
              Login to Workspace
            </Button>
          </Link>
        </div>

        {/* Visual Workflow Pipeline Demo */}
        <div className="w-full max-w-4xl pt-12">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            The PlanForge Execution Pipeline
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-left">
            {/* Step 1: Goal */}
            <div className="p-4 rounded-xl bg-card border border-border/80 shadow-sm relative group hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Step 1</span>
                <Target className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-xs font-bold text-foreground">Goal</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Define high-level objective</p>
              <div className="mt-3 p-2 rounded bg-secondary/50 border border-border text-[11px] font-medium text-foreground">
                Build AI Resume Analyzer
              </div>
            </div>

            {/* Step 2: Milestones */}
            <div className="p-4 rounded-xl bg-card border border-border/80 shadow-sm relative group hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Step 2</span>
                <Flag className="h-4 w-4 text-emerald-400" />
              </div>
              <h3 className="text-xs font-bold text-foreground">Milestones</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Break into checkpoints</p>
              <div className="mt-3 space-y-1 text-[11px]">
                <div className="p-1.5 rounded bg-secondary/50 border border-border text-foreground flex items-center justify-between">
                  <span>1. AI Pipeline</span>
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                </div>
                <div className="p-1.5 rounded bg-secondary/50 border border-border text-muted-foreground flex items-center justify-between">
                  <span>2. Frontend UI</span>
                  <span className="text-[9px] text-primary">In progress</span>
                </div>
              </div>
            </div>

            {/* Step 3: Tasks */}
            <div className="p-4 rounded-xl bg-card border border-border/80 shadow-sm relative group hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Step 3</span>
                <Layers className="h-4 w-4 text-sky-400" />
              </div>
              <h3 className="text-xs font-bold text-foreground">Tasks</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Assign & execute</p>
              <div className="mt-3 space-y-1 text-[11px]">
                <div className="p-1.5 rounded bg-secondary/50 border border-border text-foreground flex items-center justify-between">
                  <span className="truncate">Extract PDF Embeddings</span>
                  <span className="text-[9px] bg-primary/20 text-primary px-1 rounded">Sushanth</span>
                </div>
                <div className="p-1.5 rounded bg-secondary/50 border border-border text-foreground flex items-center justify-between">
                  <span className="truncate">Design Radar Chart</span>
                  <span className="text-[9px] bg-secondary text-muted-foreground px-1 rounded">Rahul</span>
                </div>
              </div>
            </div>

            {/* Step 4: Progress */}
            <div className="p-4 rounded-xl bg-card border border-border/80 shadow-sm relative group hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Step 4</span>
                <Trophy className="h-4 w-4 text-purple-400" />
              </div>
              <h3 className="text-xs font-bold text-foreground">Progress</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Track real velocity</p>
              <div className="mt-3 p-2 rounded bg-secondary/50 border border-border">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Sprint Completion</span>
                  <span className="text-primary font-mono">68%</span>
                </div>
                <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-[68%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 text-left w-full max-w-4xl border-t border-border/60">
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-foreground">Zero Friction Collaborative Planning</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Designed specifically for fast sprints, hackathon teams, and structured learning cohorts with instant assignments and templates.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-foreground">Actionable Information Density</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No bloated enterprise cards. Quickly answer who is doing what, what is overdue, and what needs to be tackled next.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-foreground">Integrated AI Roadmap Engine</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Turn a prompt into structured goals, milestones, and task checklists with 1-click apply and automated risk analysis.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 py-6 px-6 sm:px-12 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>PlanForge &copy; 2026. Built for high-velocity builders.</div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            App Dashboard
          </Link>
          <Link href="/login" className="hover:text-foreground transition-colors">
            Sign In
          </Link>
        </div>
      </footer>
    </div>
  );
}
