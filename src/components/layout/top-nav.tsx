"use client";

import React, { useState } from "react";
import { Search, Plus, Menu, User, LogOut } from "lucide-react";
import { usePlanForge } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { CommandMenu } from "@/components/layout/command-menu";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function TopNav({ onOpenMobileMenu }: { onOpenMobileMenu?: () => void }) {
  const { currentUser, allUsers, setCurrentUser, logout, activeWorkspaceId } = usePlanForge();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreateWsOpen, setIsCreateWsOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <header className="h-14 border-b border-border bg-card/40 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        {/* Left Side: Mobile Toggle & Global Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary/80 border border-border/60 text-xs text-muted-foreground transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
              <span>Search workspaces, tasks, milestones...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono uppercase bg-background text-muted-foreground rounded border border-border/80">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Side: Quick Action, Notifications, User Menu */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Create Task */}
          <Button
            size="sm"
            onClick={() => setIsCreateTaskOpen(true)}
            className="hidden sm:inline-flex gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Task</span>
          </Button>

          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-primary/40 transition-all"
            >
              <Avatar src={currentUser.avatar_url} name={currentUser.full_name} size="sm" />
            </button>

            {isProfileOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-card shadow-2xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setIsProfileOpen(false)}
              >
                {/* User Header */}
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-xs font-semibold text-foreground truncate">{currentUser.full_name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{currentUser.email}</p>
                </div>


                <div className="border-t border-border pt-1">
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-foreground hover:bg-secondary transition-colors"
                  >
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    Account Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      router.push("/login");
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <CommandMenu open={isSearchOpen} onOpenChange={setIsSearchOpen} />
      <CreateWorkspaceDialog open={isCreateWsOpen} onOpenChange={setIsCreateWsOpen} />
      <CreateTaskDialog
        open={isCreateTaskOpen}
        onOpenChange={setIsCreateTaskOpen}
        defaultWorkspaceId={activeWorkspaceId || undefined}
      />
    </>
  );
}
