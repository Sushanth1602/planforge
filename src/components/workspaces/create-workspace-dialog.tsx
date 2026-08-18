"use client";

import React, { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { WorkspaceType } from "@/types/planforge";
import { usePlanForge } from "@/lib/store";
import { Trophy, BookOpen, Layers, Target, User, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateWorkspaceDialog({ open, onOpenChange }: CreateWorkspaceDialogProps) {
  const { createWorkspace } = usePlanForge();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<WorkspaceType>("hackathon");
  const [deadline, setDeadline] = useState("");
  const [useTemplate, setUseTemplate] = useState<"none" | "hackathon" | "learning">("hackathon");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const templateOption = type === "hackathon" || type === "learning" ? (useTemplate as any) : "none";
      const newWs = await createWorkspace(name.trim(), description.trim(), type, deadline || undefined, templateOption);
      onOpenChange(false);
      setName("");
      setDescription("");
      router.push(`/workspaces/${newWs.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const types: { id: WorkspaceType; label: string; icon: any; desc: string }[] = [
    { id: "hackathon", label: "Hackathon", icon: Trophy, desc: "Fast-paced sprint tracking" },
    { id: "learning", label: "Learning", icon: BookOpen, desc: "Skill roadmaps & milestones" },
    { id: "project", label: "Project", icon: Layers, desc: "College/team build" },
    { id: "competition", label: "Competition", icon: Target, desc: "Contests & deliverables" },
    { id: "personal", label: "Personal", icon: User, desc: "Solo goals & habits" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit} className="relative">
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Organize team goals, milestones, tasks, and deadlines in one collaborative hub.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">Workspace Name *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. AI Resume Intelligence Engine"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is your team building and aiming to achieve?"
              rows={2}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">Workspace Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {types.map((t) => {
                const Icon = t.icon;
                const isSelected = type === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setType(t.id);
                      if (t.id === "hackathon") setUseTemplate("hackathon");
                      else if (t.id === "learning") setUseTemplate("learning");
                      else setUseTemplate("none");
                    }}
                    className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 text-foreground shadow-sm"
                        : "border-border bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Icon className={`h-4 w-4 mb-1.5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-xs font-medium text-foreground">{t.label}</span>
                    <span className="text-[10px] text-muted-foreground line-clamp-1">{t.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {(type === "hackathon" || type === "learning") && (
            <div className="p-3 rounded-lg bg-secondary/40 border border-border flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="flex-1">
                <label className="text-xs font-semibold text-foreground block">
                  Recommended Template Available
                </label>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                  {type === "hackathon"
                    ? "Auto-provision 3 Core Goals and 5 Milestones (Problem Definition, UI/UX, AI Pipeline, Demo Pitch)."
                    : "Auto-provision a 6-milestone structured curriculum (Foundations, NumPy, ML Algorithms, Deep Learning, Capstone)."}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer">
                    <input
                      type="radio"
                      name="template"
                      checked={useTemplate !== "none"}
                      onChange={() => setUseTemplate(type as any)}
                      className="accent-primary"
                    />
                    Use Template (Recommended)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                    <input
                      type="radio"
                      name="template"
                      checked={useTemplate === "none"}
                      onChange={() => setUseTemplate("none")}
                      className="accent-primary"
                    />
                    Start Blank
                  </label>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">Target Deadline</label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting} disabled={!name.trim()}>
            Create Workspace
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
