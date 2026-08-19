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
  ChevronRight,
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

export function Sidebar({ isMobile = false }: { isMobile?: boolean }) {
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



  const getWorkspaceIcon = (type: string) => {
    switch (type) {
      case "hackathon":
        return <Trophy className="h-4 w-4 text-indigo-400 shrink-0" />;
      case "learning":
        return <BookOpen className="h-4 w-4 text-emerald-400 shrink-0" />;
      case "competition":
        return <Target className="h-4 w-4 text-rose-400 shrink-0" />;
      case "personal":
        return <User className="h-4 w-4 text-purple-400 shrink-0" />;
      default:
        return <Layers className="h-4 w-4 text-blue-400 shrink-0" />;
    }
  };

  // Render Narrow Navigation Rail for Desktop
  if (!isMobile) {
    return (
      <>
        <aside className="w-16 h-[calc(100vh-1.5rem)] my-3 ml-3 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-lg flex flex-col items-center py-4 justify-between shrink-0 sticky top-3 select-none z-30">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4">
            <Link href="/dashboard" className="group" title="PlanForge">
              <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
                PF
              </div>
            </Link>

            <div className="w-8 h-[1px] bg-white/5 my-2" />

            {/* Platform Main Navigation */}
            <nav className="flex flex-col items-center gap-1.5">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href) && !isInsideWorkspace);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.label}
                    className={`h-9 w-9 flex items-center justify-center rounded-xl transition-all duration-300 relative group ${
                      isActive
                        ? "bg-white/[0.04] text-white border border-white/[0.08] shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                        : "text-muted-foreground hover:text-white hover:bg-white/[0.02]"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    
                    {/* Tooltip */}
                    <span className="absolute left-14 px-2 py-1 rounded bg-[#080B12] border border-white/5 text-[10px] font-semibold text-white tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-xl z-50">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>


          </div>

          {/* Footer Area: Active Workspace Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsWsDropdownOpen(!isWsDropdownOpen)}
              className="h-9.5 w-9.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center hover:bg-white/[0.05] transition-all relative group"
              title={activeWs ? `Workspace: ${activeWs.name}` : "Workspaces"}
            >
              {activeWs ? getWorkspaceIcon(activeWs.type) : <Layers className="h-4 w-4 text-muted-foreground" />}
              <span className="absolute left-14 px-2 py-1 rounded bg-[#080B12] border border-white/5 text-[10px] font-semibold text-white tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-xl z-50">
                Switch Project
              </span>
            </button>

            {/* Workspace Dropdown */}
            {isWsDropdownOpen && (
              <div className="absolute left-12 bottom-0 w-56 rounded-xl border border-white/8 bg-[#080B12]/95 backdrop-blur-xl shadow-2xl z-50 p-2 space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 pt-1.5 pb-1">
                  Active Workspaces
                </div>
                <div className="max-h-48 overflow-y-auto space-y-0.5">
                  {workspaces.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => {
                        setActiveWorkspaceId(w.id);
                        setIsWsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                        w.id === activeWorkspaceId
                          ? "bg-blue-600/10 text-blue-400 border border-blue-500/15"
                          : "text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      {getWorkspaceIcon(w.type)}
                      <span className="truncate flex-1">{w.name}</span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-white/5 pt-1.5">
                  <button
                    onClick={() => {
                      setIsWsDropdownOpen(false);
                      setIsCreateWsOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-blue-400 font-semibold hover:bg-blue-500/5 transition-all text-left"
                  >
                    <Plus className="h-4 w-4" />
                    Create Workspace
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        <CreateWorkspaceDialog open={isCreateWsOpen} onOpenChange={setIsCreateWsOpen} />
      </>
    );
  }

  // Render Mobile Sidebar inside Drawer (wider menu with labels)
  return (
    <>
      <aside className="w-full flex flex-col h-full select-none bg-[#080B12]/90 backdrop-blur-md text-foreground">
        {/* Logo & Close Title */}
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="h-8.5 w-8.5 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold shadow-md">
              PF
            </div>
            <span className="font-semibold text-sm tracking-tight text-white flex items-center gap-1.5">
              PlanForge
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 bg-blue-500/10 text-blue-400 rounded">
                v1.0
              </span>
            </span>
          </Link>
        </div>

        {/* Workspace Quick Switcher */}
        <div className="p-4 border-b border-white/5 relative">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-2 flex items-center justify-between">
            <span>Workspace</span>
            <button
              onClick={() => setIsCreateWsOpen(true)}
              className="text-blue-400 hover:text-blue-300 transition-colors p-0.5"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => setIsWsDropdownOpen(!isWsDropdownOpen)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all text-left text-xs font-semibold text-white"
          >
            <div className="flex items-center gap-2 min-w-0">
              {activeWs ? getWorkspaceIcon(activeWs.type) : <Layers className="h-4 w-4 text-muted-foreground" />}
              <span className="truncate">{activeWs ? activeWs.name : "Select Workspace"}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>

          {isWsDropdownOpen && (
            <div className="absolute left-4 right-4 top-20 rounded-xl border border-white/8 bg-[#080B12] shadow-2xl z-50 p-2 space-y-1">
              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {workspaces.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      setActiveWorkspaceId(w.id);
                      setIsWsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors text-left ${
                      w.id === activeWorkspaceId
                        ? "bg-blue-600/10 text-blue-400"
                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {getWorkspaceIcon(w.type)}
                    <span className="truncate">{w.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation lists */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-2">
              Platform Navigation
            </div>
            <nav className="space-y-1">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href) && !isInsideWorkspace);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-white/[0.04] text-white border border-white/[0.08] shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>


        </div>
      </aside>

      <CreateWorkspaceDialog open={isCreateWsOpen} onOpenChange={setIsCreateWsOpen} />
    </>
  );
}
