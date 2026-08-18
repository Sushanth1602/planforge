"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck, Clock, AlertTriangle, UserCheck, Flag, Sparkles } from "lucide-react";
import { usePlanForge } from "@/lib/store";
import { formatRelativeTime } from "@/lib/utils";
import Link from "next/link";

export function NotificationDropdown() {
  const { notifications, unreadNotificationsCount, markNotificationRead, markAllNotificationsRead } = usePlanForge();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "task_assigned":
        return <UserCheck className="h-4 w-4 text-blue-400" />;
      case "task_overdue":
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case "deadline_approaching":
        return <Clock className="h-4 w-4 text-amber-400" />;
      case "milestone_completed":
        return <Flag className="h-4 w-4 text-emerald-400" />;
      default:
        return <Sparkles className="h-4 w-4 text-purple-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {unreadNotificationsCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-border bg-card shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">Notifications</span>
              {unreadNotificationsCount > 0 && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                  {unreadNotificationsCount} new
                </span>
              )}
            </div>
            {unreadNotificationsCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto divide-y divide-border/50">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-secondary/40 transition-colors cursor-pointer ${
                    !notif.is_read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="mt-0.5 p-1.5 rounded-md bg-secondary shrink-0 border border-border/50">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-semibold text-foreground truncate">{notif.title}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {formatRelativeTime(notif.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    {notif.link_url && (
                      <Link
                        href={notif.link_url}
                        onClick={() => setIsOpen(false)}
                        className="inline-block text-[11px] text-primary hover:underline mt-1 font-medium"
                      >
                        View details &rarr;
                      </Link>
                    )}
                  </div>
                  {!notif.is_read && (
                    <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
