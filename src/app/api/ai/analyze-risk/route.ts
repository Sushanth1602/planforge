import { NextResponse } from "next/server";
import { AIRiskAnalysis } from "@/types/planforge";

export async function POST(req: Request) {
  try {
    const { workspaceData } = await req.json();

    const {
      name = "Workspace",
      totalTasks = 0,
      completedTasks = 0,
      overdueTasks = 0,
      activeTasks = 0,
      unassignedTasks = 0,
      memberCount = 1,
      deadline = null,
    } = workspaceData || {};

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const overdueRatio = totalTasks > 0 ? overdueTasks / totalTasks : 0;

    let healthScore = 100;
    healthScore -= overdueTasks * 15;
    healthScore -= unassignedTasks * 10;
    if (completionRate < 30 && totalTasks > 5) healthScore -= 15;
    healthScore = Math.max(10, Math.min(100, healthScore));

    const overallStatus =
      healthScore >= 80 ? "On Track" : healthScore >= 50 ? "At Risk" : "Critical Delay";

    const riskFactors = [];
    const recommendations = [];

    if (overdueTasks > 0) {
      riskFactors.push({
        category: "Schedule Slippage",
        severity: overdueTasks >= 2 ? ("high" as const) : ("medium" as const),
        description: `${overdueTasks} critical tasks have surpassed their target deadline.`,
        affected_tasks_or_milestones: [`${overdueTasks} Overdue Task(s)`],
      });
      recommendations.push("Re-prioritize overdue items or reassign them to team members with lower active load.");
    }

    if (unassignedTasks > 0) {
      riskFactors.push({
        category: "Ownership Gaps",
        severity: "medium" as const,
        description: `${unassignedTasks} task(s) currently have no owner assigned.`,
        affected_tasks_or_milestones: ["Unassigned tasks queue"],
      });
      recommendations.push("Assign specific team members to unowned tasks to establish accountability.");
    }

    if (activeTasks > memberCount * 3) {
      riskFactors.push({
        category: "Workload Congestion",
        severity: "medium" as const,
        description: `Average active tasks per member is high (${(activeTasks / Math.max(1, memberCount)).toFixed(1)} tasks/person).`,
        affected_tasks_or_milestones: ["Sprint throughput"],
      });
      recommendations.push("Limit WIP (Work In Progress) on Kanban board to 2-3 tasks per person.");
    }

    if (riskFactors.length === 0) {
      riskFactors.push({
        category: "Velocity & Health",
        severity: "low" as const,
        description: "Sprint execution is on schedule with balanced member workloads and zero overdue blockers.",
        affected_tasks_or_milestones: ["Sprint milestones"],
      });
      recommendations.push("Maintain current velocity and conduct regular standup reviews.");
    }

    const analysis: AIRiskAnalysis = {
      health_score: healthScore,
      overall_status: overallStatus,
      summary: `Workspace "${name}" is currently ${overallStatus} with a health rating of ${healthScore}/100. ${
        overdueTasks > 0
          ? `Urgent attention is needed for ${overdueTasks} overdue task(s).`
          : "Development velocity is healthy."
      }`,
      risk_factors: riskFactors,
      recommendations: recommendations,
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("AI Risk Analysis Error:", error);
    return NextResponse.json({ error: "Failed to analyze risk" }, { status: 500 });
  }
}
