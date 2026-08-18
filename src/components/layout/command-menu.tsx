"use client";

import React, { useState, useEffect } from "react";
import { Search, FolderKanban, Target, Flag, CheckSquare, Users, ArrowRight, X } from "lucide-react";
import { usePlanForge } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/dialog";

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const [query, setQuery] = useState("");
  const { workspaces, goals, milestones, tasks, members } = usePlanForge();
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const q = query.toLowerCase().trim();

  const filteredWorkspaces = q ? workspaces.filter((w) => w.name.toLowerCase().includes(q) || w.description?.toLowerCase().includes(q)) : [];
  const filteredGoals = q ? goals.filter((g) => g.title.toLowerCase().includes(q) || g.description?.toLowerCase().includes(q)) : [];
  const filteredMilestones = q ? milestones.filter((m) => m.title.toLowerCase().includes(q)) : [];
  const filteredTasks = q ? tasks.filter((t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)) : [];
  const filteredMembers = q ? members.filter((m) => m.profile?.full_name.toLowerCase().includes(q) || m.profile?.email.toLowerCase().includes(q)) : [];

  const hasResults =
    filteredWorkspaces.length > 0 ||
    filteredGoals.length > 0 ||
    filteredMilestones.length > 0 ||
    filteredTasks.length > 0 ||
    filteredMembers.length > 0;

  const navigate = (path: string) => {
    onOpenChange(false);
    setQuery("");
    router.push(path);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col -m-6 max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground shrink-0 mr-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workspaces, goals, tasks, team members... (Type to filter)"
            className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none text-foreground"
            autoFocus
          />
          {query ? (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] uppercase font-mono bg-secondary text-muted-foreground rounded border border-border">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Body */}
        <div className="p-3 overflow-y-auto max-h-[420px] space-y-4">
          {!query ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Type anything to search workspaces, tasks, milestones, or people...
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              {filteredWorkspaces.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                    <FolderKanban className="h-3 w-3" /> Workspaces
                  </div>
                  {filteredWorkspaces.map((w) => (
                    <div
                      key={w.id}
                      onClick={() => navigate(`/workspaces/${w.id}`)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/70 cursor-pointer group text-xs"
                    >
                      <div className="font-medium text-foreground">{w.name}</div>
                      <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                    </div>
                  ))}
                </div>
              )}

              {filteredTasks.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                    <CheckSquare className="h-3 w-3" /> Tasks
                  </div>
                  {filteredTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => navigate(`/workspaces/${t.workspace_id}/kanban`)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/70 cursor-pointer group text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-medium text-foreground truncate">{t.title}</span>
                        <span className="text-[10px] text-muted-foreground uppercase px-1.5 py-0.2 bg-secondary rounded border border-border/50">
                          {t.status}
                        </span>
                      </div>
                      <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5 shrink-0" />
                    </div>
                  ))}
                </div>
              )}

              {filteredGoals.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                    <Target className="h-3 w-3" /> Goals
                  </div>
                  {filteredGoals.map((g) => (
                    <div
                      key={g.id}
                      onClick={() => navigate(`/workspaces/${g.workspace_id}/goals`)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/70 cursor-pointer group text-xs"
                    >
                      <div className="font-medium text-foreground">{g.title}</div>
                      <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                    </div>
                  ))}
                </div>
              )}

              {filteredMilestones.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                    <Flag className="h-3 w-3" /> Milestones
                  </div>
                  {filteredMilestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => navigate(`/workspaces/${m.workspace_id}/goals`)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/70 cursor-pointer group text-xs"
                    >
                      <div className="font-medium text-foreground">{m.title}</div>
                      <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                    </div>
                  ))}
                </div>
              )}

              {filteredMembers.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                    <Users className="h-3 w-3" /> Team Members
                  </div>
                  {filteredMembers.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => navigate(`/workspaces/${m.workspace_id}/team`)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/70 cursor-pointer group text-xs"
                    >
                      <div className="font-medium text-foreground">{m.profile?.full_name || m.profile?.email}</div>
                      <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
}
