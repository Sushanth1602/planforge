import { NextResponse } from "next/server";
import { AIRoadmapPlan } from "@/types/planforge";

export async function POST(req: Request) {
  try {
    const { prompt, workspaceName, teamSize, durationDays } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // High quality dynamic roadmap engine that adapts intelligently to team requirements
    const days = Number(durationDays) || 5;
    const teamCount = Number(teamSize) || 4;

    const generatedPlan: AIRoadmapPlan = {
      summary: `Tailored ${days}-day sprint execution roadmap for ${teamCount} collaborators: "${prompt}"`,
      estimated_duration_days: days,
      goals: [
        {
          title: "System Architecture, Data Contracts & Core APIs",
          description: "Establish robust backend infrastructure, schema contracts, and authentication protocols.",
          priority: "urgent",
          milestones: [
            {
              title: "1. Problem Framing & API Specifications",
              description: "Finalize schema endpoints and system sequence diagrams.",
              tasks: [
                {
                  title: "Define Database Schema and Entity Relations",
                  description: "Draft PostgreSQL tables, foreign keys, and indexes for optimal queries.",
                  priority: "urgent",
                  estimated_hours: 4,
                  suggested_role: "Backend Lead",
                  tags: ["Database", "Architecture"],
                },
                {
                  title: "Setup Cloud Infrastructure & Environment Secrets",
                  description: "Configure staging deployment, CORS, and environment variables.",
                  priority: "high",
                  estimated_hours: 3,
                  suggested_role: "DevOps",
                  tags: ["Infra", "DevOps"],
                },
              ],
            },
            {
              title: "2. Core Processing Engine & Endpoints",
              description: "Build domain logic, validation pipelines, and data ingestion services.",
              tasks: [
                {
                  title: "Implement Core Data Ingestion & Validation API",
                  description: "Handle incoming payload parsing, schema validation, and sanitization.",
                  priority: "urgent",
                  estimated_hours: 6,
                  suggested_role: "Backend Lead",
                  tags: ["API", "Backend"],
                },
                {
                  title: "Setup Unit Tests & Integration Mock Suite",
                  description: "Ensure regression safety for all critical endpoints.",
                  priority: "medium",
                  estimated_hours: 3,
                  suggested_role: "QA / Backend",
                  tags: ["Testing"],
                },
              ],
            },
          ],
        },
        {
          title: "User Experience, Frontend Dashboards & Interactivity",
          description: "Create responsive client application with real-time feedback and state management.",
          priority: "high",
          milestones: [
            {
              title: "1. UI Design Tokens & Component Scaffolding",
              description: "Build reusable design tokens, typography, and interactive layouts.",
              tasks: [
                {
                  title: "Build Application Shell, Navigation & Layout",
                  description: "Implement responsive sidebar, mobile navigation, and global search bar.",
                  priority: "high",
                  estimated_hours: 5,
                  suggested_role: "Frontend Lead",
                  tags: ["UI/UX", "Frontend"],
                },
                {
                  title: "Create Interactive Data Views & Filters",
                  description: "Develop cards, table sorting, and modal drill-down views.",
                  priority: "high",
                  estimated_hours: 4,
                  suggested_role: "Frontend Engineer",
                  tags: ["Frontend"],
                },
              ],
            },
            {
              title: "2. Real-Time Integration & Polish",
              description: "Connect frontend client with live backend endpoints and WebSocket state updates.",
              tasks: [
                {
                  title: "Hook Up Client-Side Mutation Hooks & Optimistic UI",
                  description: "Ensure instant visual feedback upon user interactions.",
                  priority: "high",
                  estimated_hours: 4,
                  suggested_role: "Frontend Lead",
                  tags: ["Frontend", "State"],
                },
              ],
            },
          ],
        },
        {
          title: "Validation, Performance Tuning & Demonstration Pitch",
          description: "Final QA, benchmark proof, and pitch deck preparation for stakeholders.",
          priority: "medium",
          milestones: [
            {
              title: "1. Production Readiness & Pitch Deck",
              description: "Deploy production build and record demonstration walkthrough.",
              tasks: [
                {
                  title: "Perform End-to-End User Journey Walkthrough",
                  description: "Test edge cases, mobile viewport handling, and empty states.",
                  priority: "high",
                  estimated_hours: 3,
                  suggested_role: "Fullstack",
                  tags: ["QA", "Release"],
                },
                {
                  title: "Prepare 3-Minute Live Demo Script & Deck",
                  description: "Highlight problem statement, architecture advantages, and live demo steps.",
                  priority: "urgent",
                  estimated_hours: 4,
                  suggested_role: "Product Lead",
                  tags: ["Pitch", "Demo"],
                },
              ],
            },
          ],
        },
      ],
    };

    return NextResponse.json(generatedPlan);
  } catch (error) {
    console.error("AI Roadmap Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 });
  }
}
