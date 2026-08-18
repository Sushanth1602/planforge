"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Calendar as CalendarIcon,
  BarChart3,
  Settings,
  Plus,
  ChevronDown,
  Trophy,
  BookOpen,
  Layers,
  Target,
  User,
  KanbanSquare,
  Sparkles,
  Users,
  Compass,
} from "lucide-react";
import { usePlanForge } from "@/lib/store";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";

export function Sidebar() {
  const pathname = usePathname();
  const { workspaces, activeWorkspaceId, setActiveWorkspaceId } = usePlanForge();
  const [isCreateWsOpen, setIsCreateWsOpen] = useState(false);
  const [isWsDropdownOpen, setIsWsDropdownOpen] = useState(false);

  const activeWs = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  const mainNav = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Tasks", href: "/tasks", icon: CheckSquare },
    { label: "Workspaces", href: "/workspaces", icon: FolderKanban },
    { label: "Calendar", href: "/calendar", icon: CalendarIcon },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  const isInsideWorkspace = pathname.startsWith("/workspaces/") && pathname !== "/workspaces";
  const currentWsId = isInsideWorkspace ? pathname.split("/")[2] : activeWorkspaceId;

  const wsNav = currentWsId
    ? [
        { label: "Overview", href: `/workspaces/${currentWsId}`, icon: Compass },
        { label: "Kanban Board", href: `/workspaces/${currentWsId}/kanban`, icon: KanbanSquare },
        { label: "Goals & Milestones", href: `/workspaces/${currentWsId}/goals`, icon: Target },
        { label: "Team & Workload", href: `/workspaces/${currentWsId}/team`, icon: Users },
        { label: "Workspace Analytics", href: `/workspaces/${currentWsId}/analytics`, icon: BarChart3 },
        { label: "AI Roadmap & Risk", href: `/workspaces/${currentWsId}/ai-planner`, icon: Sparkles },
      ]
    : [];

  const getWorkspaceIcon = (type: string) => {
    switch (type) {
      case "hackathon":
        return <Trophy className="h-3.5 w-3.5 text-indigo-400 shrink-0" />;
      case "learning":
        return <BookOpen className="h-3.5 w-3.5 text-emerald-400 shrink-0" />;
      case "competition":
        return <Target className="h-3.5 w-3.5 text-rose-400 shrink-0" />;
      case "personal":
        return <User className="h-3.5 w-3.5 text-purple-400 shrink-0" />;
      default:
        return <Layers className="h-3.5 w-3.5 text-blue-400 shrink-0" />;
    }
  };

  return (
    <>
      <aside className="w-64 border-r border-border bg-card/60 flex flex-col h-screen shrink-0 sticky top-0 select-none">
        {/* App Branding */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              PF
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-foreground flex items-center gap-1.5">
                PlanForge
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-primary/15 text-primary rounded font-semibold">
                  v1.0
                </span>
              </span>
            </div>
          </Link>
        </div>

        {/* Workspace Quick Switcher */}
        <div className="p-3 border-b border-border/70 relative">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1.5 flex items-center justify-between">
            <span>Workspace</span>
            <button
              onClick={() => setIsCreateWsOpen(true)}
              className="text-primary hover:text-primary/80 transition-colors p-0.5"
              title="Create Workspace"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsWsDropdownOpen(!isWsDropdownOpen)}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-secondary/50 hover:bg-secondary border border-border/60 transition-all text-left group"
          >
            <div className="flex items-center gap-2 min-w-0">
              {activeWs ? getWorkspaceIcon(activeWs.type) : <Layers className="h-3.5 w-3.5 text-muted-foreground" />}
              <span className="text-xs font-semibold text-foreground truncate">
                {activeWs ? activeWs.name : "Select Workspace"}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground shrink-0 transition-transform" />
          </button>

          {/* Workspace Dropdown */}
          {isWsDropdownOpen && (
            <div className="absolute left-3 right-3 top-16 rounded-xl border border-border bg-popover shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-100">
              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {workspaces.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      setActiveWorkspaceId(w.id);
                      setIsWsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-xs font-medium transition-colors text-left ${
                      w.id === activeWorkspaceId
                        ? "bg-primary/15 text-primary font-semibold"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {getWorkspaceIcon(w.type)}
                    <span className="truncate">{w.name}</span>
                  </button>
                ))}
              </div>
              <div className="border-t border-border/60 pt-1 mt-1">
                <button
                  onClick={() => {
                    setIsWsDropdownOpen(false);
                    setIsCreateWsOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-primary font-medium hover:bg-primary/10 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create New Workspace
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {/* Main Navigation */}
          <div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1.5">
              Platform
            </div>
            <nav className="space-y-0.5">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href) && !isInsideWorkspace);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Current Workspace Navigation */}
          {currentWsId && (
            <div>
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1.5 flex items-center justify-between">
                <span>Active Project</span>
                <span className="text-[9px] text-primary lowercase truncate max-w-[80px]">
                  {activeWs?.type}
                </span>
              </div>
              <nav className="space-y-0.5">
                {wsNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-secondary text-foreground border border-border font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Footer Quick Info */}
        <div className="p-3 border-t border-border text-xs text-muted-foreground bg-secondary/20">
          <div className="flex items-center justify-between text-[11px]">
            <span>Active Goal Tracking</span>
            <span className="font-mono text-emerald-400">Online</span>
          </div>
        </div>
      </aside>

      <CreateWorkspaceDialog open={isCreateWsOpen} onOpenChange={setIsCreateWsOpen} />
    </>
  );
}
