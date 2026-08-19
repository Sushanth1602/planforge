"use client";

import React, { useState } from "react";
import { Search, Plus, Menu, User, LogOut } from "lucide-react";
import { usePlanForge } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { CommandMenu } from "@/components/layout/command-menu";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { GlassButton } from "@/components/ui/cinematic";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function TopNav({ onOpenMobileMenu }: { onOpenMobileMenu?: () => void }) {
  const { currentUser, setCurrentUser, logout, activeWorkspaceId } = usePlanForge();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreateWsOpen, setIsCreateWsOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <header className="mx-4 mt-3 mb-2 h-14 rounded-2xl border border-white/5 bg-white/[0.015] backdrop-blur-md px-4 flex items-center justify-between sticky top-3 z-30 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
        {/* Left Side: Mobile Menu Button & Platform logo on mobile, or search box */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Search Trigger Command Bar */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 text-xs text-muted-foreground transition-all duration-300 group cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-muted-foreground group-hover:text-white transition-colors" />
              <span className="truncate">Search workspaces, tasks, milestones...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono uppercase bg-black/40 text-muted-foreground rounded border border-white/5">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Side: Quick Action, Notifications, User Menu */}
        <div className="flex items-center gap-3">
          {/* Quick Create Task */}
          <GlassButton
            size="sm"
            variant="primary"
            onClick={() => setIsCreateTaskOpen(true)}
            className="hidden sm:inline-flex gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Task</span>
          </GlassButton>

          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-blue-500/50 transition-all duration-300"
            >
              <Avatar src={currentUser.avatar_url} name={currentUser.full_name} size="sm" className="border border-white/10" />
            </button>

            {isProfileOpen && (
              <div
                className="absolute right-0 mt-2 w-60 rounded-xl border border-white/8 bg-[#080B12]/95 backdrop-blur-xl shadow-2xl z-50 p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200"
                onClick={() => setIsProfileOpen(false)}
              >
                {/* User Header */}
                <div className="px-3 py-2.5 border-b border-white/5">
                  <p className="text-xs font-semibold text-white truncate">{currentUser.full_name}</p>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">{currentUser.email}</p>
                </div>

                <div className="pt-1.5">
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
                  >
                    <User className="h-3.5 w-3.5 shrink-0" />
                    Account Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      router.push("/login");
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all text-left"
                  >
                    <LogOut className="h-3.5 w-3.5 shrink-0" />
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
