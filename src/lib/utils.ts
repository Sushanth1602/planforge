import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format, isPast, isToday, isTomorrow, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return "No date";
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return format(date, "MMM d, yyyy");
  } catch {
    return "Invalid date";
  }
}

export function formatShortDate(dateString?: string | null): string {
  if (!dateString) return "--";
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : new Date(dateString);
    if (isNaN(date.getTime())) return "--";
    return format(date, "MMM d");
  } catch {
    return "--";
  }
}

export function formatRelativeTime(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "";
  }
}

export function isDateOverdue(dateString?: string | null, isCompleted = false): boolean {
  if (!dateString || isCompleted) return false;
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : new Date(dateString);
    if (isNaN(date.getTime())) return false;
    return isPast(date) && !isToday(date);
  } catch {
    return false;
  }
}

export function isDateToday(dateString?: string | null): boolean {
  if (!dateString) return false;
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : new Date(dateString);
    if (isNaN(date.getTime())) return false;
    return isToday(date);
  } catch {
    return false;
  }
}

export function isDateTomorrow(dateString?: string | null): boolean {
  if (!dateString) return false;
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : new Date(dateString);
    if (isNaN(date.getTime())) return false;
    return isTomorrow(date);
  } catch {
    return false;
  }
}

export function getPriorityColor(priority: string) {
  switch (priority.toLowerCase()) {
    case "urgent":
      return "text-red-500 bg-red-500/10 border-red-500/20";
    case "high":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    case "medium":
      return "text-sky-500 bg-sky-500/10 border-sky-500/20";
    case "low":
    default:
      return "text-slate-400 bg-slate-500/10 border-slate-500/20";
  }
}

export function getStatusBadge(status: string) {
  switch (status.toLowerCase()) {
    case "done":
    case "completed":
      return {
        label: "Done",
        className: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      };
    case "in_progress":
      return {
        label: "In Progress",
        className: "text-sky-400 bg-sky-500/10 border-sky-500/30",
      };
    case "review":
      return {
        label: "Review",
        className: "text-purple-400 bg-purple-500/10 border-purple-500/30",
      };
    case "todo":
      return {
        label: "To Do",
        className: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      };
    case "backlog":
    default:
      return {
        label: "Backlog",
        className: "text-slate-400 bg-slate-500/10 border-slate-500/20",
      };
  }
}

export function getWorkspaceTypeBadge(type: string) {
  switch (type.toLowerCase()) {
    case "hackathon":
      return {
        label: "Hackathon",
        className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
      };
    case "learning":
      return {
        label: "Learning",
        className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      };
    case "competition":
      return {
        label: "Competition",
        className: "bg-rose-500/10 text-rose-400 border-rose-500/30",
      };
    case "personal":
      return {
        label: "Personal",
        className: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      };
    case "project":
    default:
      return {
        label: "Project",
        className: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      };
  }
}
