"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Flag, Layers, Target, Trophy, Sparkles } from "lucide-react";
import { AmbientBackground, GlassButton, GlassCard, ProgressBar } from "@/components/ui/cinematic";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050609] text-foreground selection:bg-blue-500/20 overflow-x-hidden relative">
      <AmbientBackground />

      {/* Cinematic Top Navbar */}
      <header className="h-16 border-b border-white/5 px-6 sm:px-12 flex items-center justify-between sticky top-0 bg-transparent backdrop-blur-md z-40">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-blue-500/25">
            PF
          </div>
          <span className="font-semibold text-base tracking-tight text-white">PlanForge</span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <GlassButton variant="ghost" size="sm">
              Login
            </GlassButton>
          </Link>
          <Link href="/signup">
            <GlassButton variant="primary" size="sm">
              Get Started
            </GlassButton>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24 text-center max-w-5xl mx-auto space-y-12 relative z-10">
        
        {/* Eyebrow Label */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-semibold text-blue-400 tracking-wider uppercase animate-cinematic-in delay-0">
          <Sparkles className="h-3.5 w-3.5 text-blue-500" />
          <span>COLLABORATIVE EXECUTION SYSTEM</span>
        </div>

        {/* Hero Headlines */}
        <div className="space-y-6 max-w-4xl animate-cinematic-in delay-80">
          <h1 className="text-5xl sm:text-7xl font-light tracking-[-0.03em] text-white leading-[1.08] max-w-3xl mx-auto">
            Plan together.<br />
            Build together.<br />
            <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 shadow-sm">Finish together.</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed pt-2">
            PlanForge transforms team coordination from scattered lists into a premium cinematic pipeline. Map objectives, assign milestones, and accelerate team velocity inside one immersive workspace.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-cinematic-in delay-160 w-full sm:w-auto">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <GlassButton variant="primary" size="lg" className="w-full sm:w-auto gap-2 px-8">
              <span>Get Started</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </GlassButton>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <GlassButton variant="secondary" size="lg" className="w-full sm:w-auto px-8">
              Login to Workspace
            </GlassButton>
          </Link>
        </div>

        {/* Visual Pipeline representation */}
        <div className="w-full max-w-4xl pt-16 animate-cinematic-in delay-240">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-8">
            The PlanForge Execution Pipeline
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left relative">
            {/* Step 1: Goal */}
            <GlassCard className="relative group border border-white/5 bg-white/[0.015] hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Step 1</span>
                <Target className="h-4 w-4 text-blue-500" />
              </div>
              <h3 className="text-xs font-bold text-white tracking-wide">GOAL</h3>
              <p className="text-[11px] text-muted-foreground mt-1">Define high-level objective</p>
              <div className="mt-4 p-2 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-white/90 font-medium">
                Build AI Resume Analyzer
              </div>
            </GlassCard>

            {/* Step 2: Milestone */}
            <GlassCard className="relative group border border-white/5 bg-white/[0.015] hover:border-emerald-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Step 2</span>
                <Flag className="h-4 w-4 text-emerald-400" />
              </div>
              <h3 className="text-xs font-bold text-white tracking-wide">MILESTONE</h3>
              <p className="text-[11px] text-muted-foreground mt-1">Break into checkpoints</p>
              <div className="mt-4 space-y-1.5 text-[11px]">
                <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-white/95 flex items-center justify-between">
                  <span>1. AI Pipeline</span>
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                </div>
                <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-muted-foreground flex items-center justify-between">
                  <span>2. Frontend UI</span>
                  <span className="text-[9px] font-semibold text-blue-400">In progress</span>
                </div>
              </div>
            </GlassCard>

            {/* Step 3: Task */}
            <GlassCard className="relative group border border-white/5 bg-white/[0.015] hover:border-cyan-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Step 3</span>
                <Layers className="h-4 w-4 text-cyan-405" />
              </div>
              <h3 className="text-xs font-bold text-white tracking-wide">TASK</h3>
              <p className="text-[11px] text-muted-foreground mt-1">Assign & execute</p>
              <div className="mt-4 space-y-1.5 text-[11px]">
                <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-white/90 flex items-center justify-between">
                  <span className="truncate">Extract PDF Embeddings</span>
                  <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/10 px-1.5 py-0.2 rounded font-medium">Sushanth</span>
                </div>
                <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-white/90 flex items-center justify-between">
                  <span className="truncate">Design Radar Chart</span>
                  <span className="text-[9px] bg-white/5 text-muted-foreground px-1.5 py-0.2 rounded font-medium">Rahul</span>
                </div>
              </div>
            </GlassCard>

            {/* Step 4: Progress */}
            <GlassCard className="relative group border border-white/5 bg-white/[0.015] hover:border-purple-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Step 4</span>
                <Trophy className="h-4 w-4 text-purple-400" />
              </div>
              <h3 className="text-xs font-bold text-white tracking-wide">PROGRESS</h3>
              <p className="text-[11px] text-muted-foreground mt-1">Track velocity</p>
              <div className="mt-4 p-2 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-white/80">Sprint Progress</span>
                  <span className="text-blue-450 font-mono">68%</span>
                </div>
                <ProgressBar value={68} />
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 text-left w-full max-w-4xl border-t border-white/5 animate-cinematic-in delay-320">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white tracking-wide">Zero Friction Collaboration</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Designed specifically for fast sprints, hackathon teams, and structured learning cohorts with instant assignments and checklists.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white tracking-wide">Information Density</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No bloated enterprise cards. Immediately check who is doing what, what is overdue, and what needs to be tackled next.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white tracking-wide">Integrated AI Roadmap</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Turn a plain objective description into structured goals, milestones, and task checklists with 1-click apply and risk analysis.
            </p>
          </div>
        </div>
      </main>

      {/* Cinematic Footer */}
      <footer className="border-t border-white/5 py-8 px-6 sm:px-12 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <div>PlanForge &copy; 2026. Built for high-velocity teams.</div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="hover:text-white transition-colors">
            App Dashboard
          </Link>
          <Link href="/login" className="hover:text-white transition-colors">
            Sign In
          </Link>
        </div>
      </footer>
    </div>
  );
}
