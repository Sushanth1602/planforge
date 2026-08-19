"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  Workspace,
  Goal,
  Milestone,
  Task,
  UserProfile,
  ActivityEvent,
  Notification,
  WorkspaceMember,
  TaskStatus,
  PriorityLevel,
  WorkspaceType,
  WorkspaceRole,
  AIRoadmapPlan,
  Comment,
  Subtask,
  Tag,
} from "@/types/planforge";
import { createClient } from "@/lib/supabase/client";
import {
  INITIAL_WORKSPACES,
  INITIAL_MEMBERS,
  INITIAL_GOALS,
  INITIAL_MILESTONES,
  INITIAL_TASKS,
  INITIAL_COMMENTS,
  INITIAL_ACTIVITY,
  INITIAL_NOTIFICATIONS,
  SEED_USERS,
  CURRENT_USER,
} from "./seed-data";

const STORAGE_KEY_PREFIX = "planforge_v1_";
const supabase = createClient() as any;

// Detect if Supabase is connected to a real instance (not default fallback placeholders)
const IS_SUPABASE_CONNECTED =
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("sample-planforge") &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("sample_anon_key");

interface PlanForgeContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  workspaces: Workspace[];
  members: WorkspaceMember[];
  goals: Goal[];
  milestones: Milestone[];
  tasks: Task[];
  comments: Comment[];
  activities: ActivityEvent[];
  notifications: Notification[];
  activeWorkspaceId: string | null;
  unreadNotificationsCount: number;
  isSupabaseMode: boolean;
  fetchSupabaseData: () => Promise<void>;

  // Auth Actions
  setCurrentUser: (user: UserProfile) => void | Promise<void>;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (fullName: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;

  // Workspace Actions
  setActiveWorkspaceId: (id: string | null) => void;
  createWorkspace: (name: string, description: string, type: WorkspaceType, deadline?: string, template?: "none" | "hackathon" | "learning") => Promise<Workspace>;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
  
  // Workspace Members
  addMember: (workspaceId: string, emailOrUserId: string, role?: WorkspaceRole) => Promise<boolean>;
  removeMember: (workspaceId: string, userId: string) => Promise<void>;
  updateMemberRole: (workspaceId: string, userId: string, role: WorkspaceRole) => Promise<void>;
  getWorkspaceMembers: (workspaceId: string) => WorkspaceMember[];

  // Goals & Milestones Actions
  createGoal: (workspaceId: string, title: string, description?: string, priority?: PriorityLevel, targetDate?: string) => Promise<Goal>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  
  createMilestone: (goalId: string, workspaceId: string, title: string, description?: string, dueDate?: string) => Promise<Milestone>;
  updateMilestone: (id: string, updates: Partial<Milestone>) => Promise<void>;
  deleteMilestone: (id: string) => Promise<void>;

  // Tasks Actions
  createTask: (taskData: {
    workspace_id: string;
    title: string;
    description?: string;
    goal_id?: string | null;
    milestone_id?: string | null;
    priority?: PriorityLevel;
    status?: TaskStatus;
    due_date?: string | null;
    estimated_hours?: number | null;
    assigned_to?: string | null;
    tags?: { name: string; color: string }[];
  }) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  moveTaskStatus: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  
  // Subtasks
  addSubtask: (taskId: string, title: string) => Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<void>;

  // Comments
  addComment: (taskId: string, content: string) => Promise<Comment>;

  // Notifications
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  // Templates & AI
  applyWorkspaceTemplate: (workspaceId: string, templateType: "hackathon" | "learning") => Promise<void>;
  applyAIRoadmap: (workspaceId: string, roadmap: AIRoadmapPlan) => Promise<void>;

  // Computed Helpers
  getWorkspaceStats: (workspaceId: string) => {
    progress: number;
    totalTasks: number;
    completedTasks: number;
    activeTasks: number;
    overdueTasks: number;
    hoursRemaining: number;
  };
  getGlobalStats: () => {
    activeWorkspaces: number;
    tasksDueToday: number;
    overdueTasks: number;
    completedTasks: number;
  };
  getMemberWorkload: (workspaceId: string) => {
    user: UserProfile;
    role: WorkspaceRole;
    assignedCount: number;
    completedCount: number;
    activeCount: number;
    overdueCount: number;
  }[];
}

const PlanForgeContext = createContext<PlanForgeContextType | null>(null);

export function PlanForgeProvider({ children }: { children: React.ReactNode }) {
  // State variables matching current workspace models
  const [currentUser, setCurrentUserState] = useState<UserProfile>({
    id: "",
    email: "",
    full_name: "",
    created_at: "",
  });
  const [authLoading, setAuthLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(SEED_USERS);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(INITIAL_WORKSPACES);
  const [members, setMembers] = useState<WorkspaceMember[]>(INITIAL_MEMBERS);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [activities, setActivities] = useState<ActivityEvent[]>(INITIAL_ACTIVITY);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);

  // Sync to/from localStorage when not connected to Supabase
  useEffect(() => {
    if (IS_SUPABASE_CONNECTED) return;
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_PREFIX + "user");
      const savedWorkspaces = localStorage.getItem(STORAGE_KEY_PREFIX + "workspaces");
      const savedMembers = localStorage.getItem(STORAGE_KEY_PREFIX + "members");
      const savedGoals = localStorage.getItem(STORAGE_KEY_PREFIX + "goals");
      const savedMilestones = localStorage.getItem(STORAGE_KEY_PREFIX + "milestones");
      const savedTasks = localStorage.getItem(STORAGE_KEY_PREFIX + "tasks");
      const savedComments = localStorage.getItem(STORAGE_KEY_PREFIX + "comments");
      const savedActivities = localStorage.getItem(STORAGE_KEY_PREFIX + "activities");
      const savedNotifications = localStorage.getItem(STORAGE_KEY_PREFIX + "notifications");

      if (savedUser) setCurrentUserState(JSON.parse(savedUser));
      if (savedWorkspaces) setWorkspaces(JSON.parse(savedWorkspaces));
      if (savedMembers) setMembers(JSON.parse(savedMembers));
      if (savedGoals) setGoals(JSON.parse(savedGoals));
      if (savedMilestones) setMilestones(JSON.parse(savedMilestones));
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedComments) setComments(JSON.parse(savedComments));
      if (savedActivities) setActivities(JSON.parse(savedActivities));
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    } catch (e) {
      console.warn("Could not read localStorage cache:", e);
    }
  }, []);

  // Write changes back to localStorage in local fallback mode
  useEffect(() => {
    if (IS_SUPABASE_CONNECTED) return;
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + "user", JSON.stringify(currentUser));
      localStorage.setItem(STORAGE_KEY_PREFIX + "workspaces", JSON.stringify(workspaces));
      localStorage.setItem(STORAGE_KEY_PREFIX + "members", JSON.stringify(members));
      localStorage.setItem(STORAGE_KEY_PREFIX + "goals", JSON.stringify(goals));
      localStorage.setItem(STORAGE_KEY_PREFIX + "milestones", JSON.stringify(milestones));
      localStorage.setItem(STORAGE_KEY_PREFIX + "tasks", JSON.stringify(tasks));
      localStorage.setItem(STORAGE_KEY_PREFIX + "comments", JSON.stringify(comments));
      localStorage.setItem(STORAGE_KEY_PREFIX + "activities", JSON.stringify(activities));
      localStorage.setItem(STORAGE_KEY_PREFIX + "notifications", JSON.stringify(notifications));
    } catch (e) {
      console.warn("Could not write to localStorage cache:", e);
    }
  }, [currentUser, workspaces, members, goals, milestones, tasks, comments, activities, notifications]);

  // Load and refresh state from Supabase PostgreSQL Database
  const fetchSupabaseData = useCallback(async () => {
    if (!IS_SUPABASE_CONNECTED) return;

    try {
      // 1. Profiles & Members
      const { data: dbProfiles } = await supabase.from("profiles").select("*") as { data: any[] | null };
      const { data: dbWorkspaces } = await supabase.from("workspaces").select("*") as { data: any[] | null };
      const { data: dbMembers } = await supabase.from("workspace_members").select("*") as { data: any[] | null };
      const { data: dbGoals } = await supabase.from("goals").select("*") as { data: any[] | null };
      const { data: dbMilestones } = await supabase.from("milestones").select("*") as { data: any[] | null };
      const { data: dbTasks } = await supabase.from("tasks").select("*") as { data: any[] | null };
      const { data: dbSubtasks } = await supabase.from("subtasks").select("*") as { data: any[] | null };
      const { data: dbComments } = await supabase.from("comments").select("*") as { data: any[] | null };
      const { data: dbActivities } = await supabase.from("activity_events").select("*") as { data: any[] | null };
      const { data: dbNotifications } = await supabase.from("notifications").select("*") as { data: any[] | null };
      const { data: dbTags } = await supabase.from("tags").select("*") as { data: any[] | null };

      if (dbProfiles && dbProfiles.length > 0) {
        setAllUsers(dbProfiles as UserProfile[]);
      }

      // Map workspaces
      if (dbWorkspaces) {
        const wsList = dbWorkspaces as Workspace[];
        setWorkspaces(wsList);
        if (wsList.length > 0 && !activeWorkspaceId) {
          setActiveWorkspaceId(wsList[0].id);
        }
      }

      // Map members joined with profile information
      if (dbMembers && dbProfiles) {
        const joinedMembers = dbMembers.map((m) => ({
          ...m,
          profile: dbProfiles.find((p) => p.id === m.user_id) as UserProfile,
        }));
        setMembers(joinedMembers as WorkspaceMember[]);
      }

      // Map goals & milestones
      if (dbGoals) setGoals(dbGoals as Goal[]);
      if (dbMilestones) setMilestones(dbMilestones as Milestone[]);

      // Map tasks joined with subtasks, tags and assignee info
      if (dbTasks) {
        const mappedTasks = dbTasks.map((t) => {
          const matchedSubtasks = dbSubtasks ? dbSubtasks.filter((st) => st.task_id === t.id) : [];
          const matchedTags = dbTags ? dbTags.filter((tag) => tag.workspace_id === t.workspace_id) : []; // simple map
          const matchedAssignee = dbProfiles ? dbProfiles.find((p) => p.id === t.assigned_to) : undefined;
          const matchedCreator = dbProfiles ? dbProfiles.find((p) => p.id === t.created_by) : undefined;

          return {
            ...t,
            subtasks: matchedSubtasks as Subtask[],
            tags: matchedTags as Tag[],
            assignee: matchedAssignee as UserProfile,
            creator: matchedCreator as UserProfile,
          };
        });
        setTasks(mappedTasks as Task[]);
      }

      // Map comments joined with author profile info
      if (dbComments && dbProfiles) {
        const mappedComments = dbComments.map((c) => ({
          ...c,
          user: dbProfiles.find((p) => p.id === c.user_id) as UserProfile,
        }));
        setComments(mappedComments as Comment[]);
      }

      // Map activities
      if (dbActivities && dbProfiles) {
        const mappedActs = dbActivities.map((a) => ({
          ...a,
          user: dbProfiles.find((p) => p.id === a.user_id) as UserProfile,
        }));
        setActivities(mappedActs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) as ActivityEvent[]);
      }

      // Map notifications
      if (dbNotifications) {
        setNotifications(dbNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) as Notification[]);
      }
    } catch (err) {
      console.error("Failed to query live Supabase data:", err);
    }
  }, [activeWorkspaceId]);

  // Seed DB if it's completely empty when a user logs in (improves deployment presentation)
  const seedDatabaseIfEmpty = useCallback(async (userId: string) => {
    if (!IS_SUPABASE_CONNECTED) return;
    const shouldSeed = process.env.NEXT_PUBLIC_SEED_DEMO_DATA === "true";
    if (!shouldSeed) {
      console.log("PlanForge Seeder: Seeding is disabled (NEXT_PUBLIC_SEED_DEMO_DATA !== 'true').");
      return;
    }

    try {
      const { data: workspacesCheck } = await supabase.from("workspaces").select("id").limit(1);
      if (workspacesCheck && workspacesCheck.length === 0) {
        console.log("Supabase empty, seeding default workspaces, goals, milestones, tasks...");
        
        // 1. Seed Workspaces
        for (const ws of INITIAL_WORKSPACES) {
          await supabase.from("workspaces").insert({
            id: ws.id,
            name: ws.name,
            description: ws.description,
            type: ws.type,
            deadline: ws.deadline,
            created_by: userId,
          } as any);

          // Insert owner member record
          await supabase.from("workspace_members").insert({
            workspace_id: ws.id,
            user_id: userId,
            role: "owner",
          } as any);
        }

        // 2. Seed Goals
        for (const goal of INITIAL_GOALS) {
          await supabase.from("goals").insert({
            id: goal.id,
            workspace_id: goal.workspace_id,
            title: goal.title,
            description: goal.description,
            status: goal.status,
            priority: goal.priority,
            target_date: goal.target_date,
            created_by: userId,
          } as any);
        }

        // 3. Seed Milestones
        for (const ms of INITIAL_MILESTONES) {
          await supabase.from("milestones").insert({
            id: ms.id,
            goal_id: ms.goal_id,
            workspace_id: ms.workspace_id,
            title: ms.title,
            description: ms.description,
            due_date: ms.due_date,
            status: ms.status,
            order_index: ms.order_index,
          } as any);
        }

        // 4. Seed Tasks & Subtasks
        for (const task of INITIAL_TASKS) {
          await supabase.from("tasks").insert({
            id: task.id,
            workspace_id: task.workspace_id,
            goal_id: task.goal_id,
            milestone_id: task.milestone_id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            due_date: task.due_date,
            estimated_hours: task.estimated_hours,
            created_by: userId,
            assigned_to: userId,
          } as any);

          if (task.subtasks) {
            for (const st of task.subtasks) {
              await supabase.from("subtasks").insert({
                id: st.id,
                task_id: task.id,
                title: st.title,
                is_completed: st.is_completed,
                order_index: st.order_index,
              } as any);
            }
          }
        }

        // 5. Seed Comments
        for (const com of INITIAL_COMMENTS) {
          await supabase.from("comments").insert({
            id: com.id,
            task_id: com.task_id,
            user_id: userId,
            content: com.content,
          } as any);
        }

        // 6. Seed Activities
        for (const act of INITIAL_ACTIVITY) {
          await supabase.from("activity_events").insert({
            id: act.id,
            workspace_id: act.workspace_id,
            user_id: userId,
            action_type: act.action_type,
            entity_type: act.entity_type,
            entity_id: act.entity_id,
            entity_title: act.entity_title,
          } as any);
        }
      }
    } catch (err) {
      console.warn("DB seed check failed:", err);
    }
  }, []);

  // Listen to Supabase Auth State changes & fetch profile details
  useEffect(() => {
    if (!IS_SUPABASE_CONNECTED) {
      setAuthLoading(false);
      return;
    }

    let isMounted = true;

    // Get initial session profile
    supabase.auth.getSession().then(({ data: { session }, error }: any) => {
      if (!isMounted) return;
      if (error) {
        console.error("Error getting session:", error);
      }
      if (session?.user) {
        const uEmail = session.user.email || "";
        const profile: UserProfile = {
          id: session.user.id,
          email: uEmail,
          full_name: session.user.user_metadata?.full_name || uEmail.split("@")[0],
          avatar_url: session.user.user_metadata?.avatar_url || undefined,
        };
        setCurrentUserState(profile);
        seedDatabaseIfEmpty(session.user.id).then(() => {
          if (isMounted) fetchSupabaseData();
        });
      } else {
        setCurrentUserState({
          id: "",
          email: "",
          full_name: "",
          created_at: "",
        });
      }
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (!isMounted) return;
      if (session?.user) {
        const uEmail = session.user.email || "";
        const profile: UserProfile = {
          id: session.user.id,
          email: uEmail,
          full_name: session.user.user_metadata?.full_name || uEmail.split("@")[0],
          avatar_url: session.user.user_metadata?.avatar_url || undefined,
        };
        setCurrentUserState(profile);
        await seedDatabaseIfEmpty(session.user.id);
        fetchSupabaseData();
      } else {
        setCurrentUserState({
          id: "",
          email: "",
          full_name: "",
          created_at: "",
        });
      }
      setAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchSupabaseData, seedDatabaseIfEmpty]);

  // Subscribe to Realtime update channels on Supabase PostgreSQL tables
  useEffect(() => {
    if (!IS_SUPABASE_CONNECTED) return;

    const channel = supabase
      .channel("planforge_realtime_sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => fetchSupabaseData())
      .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, () => fetchSupabaseData())
      .on("postgres_changes", { event: "*", schema: "public", table: "goals" }, () => fetchSupabaseData())
      .on("postgres_changes", { event: "*", schema: "public", table: "milestones" }, () => fetchSupabaseData())
      .on("postgres_changes", { event: "*", schema: "public", table: "workspace_members" }, () => fetchSupabaseData())
      .on("postgres_changes", { event: "*", schema: "public", table: "workspaces" }, () => fetchSupabaseData())
      .on("postgres_changes", { event: "*", schema: "public", table: "subtasks" }, () => fetchSupabaseData())
      .on("postgres_changes", { event: "*", schema: "public", table: "activity_events" }, () => fetchSupabaseData())
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, () => fetchSupabaseData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSupabaseData]);

  // Set Profile Helper
  const setCurrentUser = async (profile: UserProfile) => {
    setCurrentUserState(profile);
    if (IS_SUPABASE_CONNECTED && profile.id) {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          console.warn("Unauthenticated state: No active Supabase Auth user found for profile sync.");
          return;
        }

        if (profile.id !== user.id) {
          console.error("Profile sync user ID mismatch.");
          return;
        }

        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: profile.full_name,
            avatar_url: profile.avatar_url || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (error) {
          console.error("Failed to sync profile update to Supabase:", {
            message: error?.message,
            code: error?.code,
            details: error?.details,
            hint: error?.hint,
          });
        }
      } catch (err: any) {
        console.error("Failed to sync profile update to Supabase:", {
          message: err?.message || String(err),
        });
      }
    }
  };

  // Authenticate login via Supabase Auth (with auto-provision fallbacks)
  const login = async (email: string, password?: string) => {
    const defaultPassword = password || "password123";
    if (IS_SUPABASE_CONNECTED) {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: defaultPassword,
        });
        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Supabase sign in failed:", err);
        throw err;
      }
    }

    // Local Storage Mock Auth
    const existing = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      return true;
    }
    const newUser: UserProfile = {
      id: "u-" + Math.random().toString(36).substring(2, 9),
      email,
      full_name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
      created_at: new Date().toISOString(),
    };
    setAllUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const signup = async (fullName: string, email: string, password?: string) => {
    const defaultPassword = password || "password123";
    if (IS_SUPABASE_CONNECTED) {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password: defaultPassword,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        
        // Auto sign in after sign up
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: defaultPassword,
        });
        if (signInError) throw signInError;
        
        return true;
      } catch (err) {
        console.error("Supabase sign up failed:", err);
        throw err;
      }
    }

    const newUser: UserProfile = {
      id: "u-" + Math.random().toString(36).substring(2, 9),
      email,
      full_name: fullName,
      created_at: new Date().toISOString(),
    };
    setAllUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = async () => {
    if (IS_SUPABASE_CONNECTED) {
      await supabase.auth.signOut();
      setCurrentUserState({
        id: "",
        email: "",
        full_name: "",
        created_at: "",
      });
    } else {
      setCurrentUser(CURRENT_USER);
    }
  };

  // Activity logger helper
  const logActivity = useCallback(
    async (workspaceId: string, actionType: string, entityType: ActivityEvent["entity_type"], entityTitle: string, metadata?: any) => {
      const newEvent = {
        workspace_id: workspaceId,
        user_id: currentUser.id,
        action_type: actionType,
        entity_type: entityType,
        entity_title: entityTitle,
        metadata: metadata || {},
      };

      if (IS_SUPABASE_CONNECTED) {
        await supabase.from("activity_events").insert(newEvent as any);
        return;
      }

      const localEvent: ActivityEvent = {
        id: "act-" + Math.random().toString(36).substring(2, 9),
        created_at: new Date().toISOString(),
        user: currentUser,
        ...newEvent,
      };
      setActivities((prev) => [localEvent, ...prev]);
    },
    [currentUser]
  );

  // Workspaces CRUD operations
  const createWorkspace = async (
    name: string,
    description: string,
    type: WorkspaceType,
    deadline?: string,
    template: "none" | "hackathon" | "learning" = "none"
  ) => {
    const wsData = {
      name,
      description,
      type,
      deadline: deadline || null,
      created_by: currentUser.id,
    };

    if (IS_SUPABASE_CONNECTED) {
      const { data: dbWs, error } = await supabase.from("workspaces").insert(wsData as any).select().single() as { data: any | null; error: any };
      if (error || !dbWs) throw error || new Error("Failed to insert workspace");

      // Add owner member record
      await supabase.from("workspace_members").insert({
        workspace_id: dbWs.id,
        user_id: currentUser.id,
        role: "owner",
      } as any);

      await logActivity(dbWs.id, "workspace_created", "workspace", dbWs.name);

      if (template === "hackathon" || type === "hackathon") {
        await applyWorkspaceTemplate(dbWs.id, "hackathon");
      } else if (template === "learning" || type === "learning") {
        await applyWorkspaceTemplate(dbWs.id, "learning");
      }

      await fetchSupabaseData();
      return dbWs as Workspace;
    }

    // Local Storage Fallback
    const newWs: Workspace = {
      id: "ws-" + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...wsData,
    };

    const newMember: WorkspaceMember = {
      id: "wm-" + Math.random().toString(36).substring(2, 9),
      workspace_id: newWs.id,
      user_id: currentUser.id,
      role: "owner",
      joined_at: new Date().toISOString(),
      profile: currentUser,
    };

    setWorkspaces((prev) => [newWs, ...prev]);
    setMembers((prev) => [newMember, ...prev]);
    setActiveWorkspaceId(newWs.id);
    logActivity(newWs.id, "workspace_created", "workspace", newWs.name);

    if (template === "hackathon" || type === "hackathon") {
      await applyWorkspaceTemplate(newWs.id, "hackathon");
    } else if (template === "learning" || type === "learning") {
      await applyWorkspaceTemplate(newWs.id, "learning");
    }

    return newWs;
  };

  const updateWorkspace = async (id: string, updates: Partial<Workspace>) => {
    if (IS_SUPABASE_CONNECTED) {
      await supabase.from("workspaces").update(updates as any).eq("id", id);
      await fetchSupabaseData();
      return;
    }

    setWorkspaces((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates, updated_at: new Date().toISOString() } : w))
    );
  };

  const deleteWorkspace = async (id: string) => {
    if (IS_SUPABASE_CONNECTED) {
      await supabase.from("workspaces").delete().eq("id", id);
      await fetchSupabaseData();
      return;
    }

    setWorkspaces((prev) => prev.filter((w) => w.id !== id));
    setMembers((prev) => prev.filter((m) => m.workspace_id !== id));
    setGoals((prev) => prev.filter((g) => g.workspace_id !== id));
    setMilestones((prev) => prev.filter((m) => m.workspace_id !== id));
    setTasks((prev) => prev.filter((t) => t.workspace_id !== id));
  };

  // Workspace Members
  const getWorkspaceMembers = useCallback(
    (workspaceId: string) => {
      return members.filter((m) => m.workspace_id === workspaceId);
    },
    [members]
  );

  const addMember = async (workspaceId: string, emailOrUserId: string, role: WorkspaceRole = "member") => {
    const existingUser = allUsers.find(
      (u) => u.id === emailOrUserId || u.email.toLowerCase() === emailOrUserId.toLowerCase()
    );

    if (IS_SUPABASE_CONNECTED) {
      if (existingUser) {
        const { error } = await supabase.from("workspace_members").insert({
          workspace_id: workspaceId,
          user_id: existingUser.id,
          role,
        } as any);
        if (error) {
          console.error("Failed to add workspace member:", {
            message: error?.message,
            code: error?.code,
            details: error?.details,
            hint: error?.hint,
          });
          return false;
        }

        // Add Notification
        await supabase.from("notifications").insert({
          user_id: existingUser.id,
          workspace_id: workspaceId,
          title: "Workspace Invitation",
          message: `You were added to workspace as ${role}`,
          type: "workspace_invitation",
        } as any);

        await logActivity(workspaceId, "member_joined", "member", `${existingUser.full_name || existingUser.email} joined as ${role}`);
        await fetchSupabaseData();
        return true;
      } else {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) return false;

        const { data: invite, error } = await supabase.from("invitations").insert({
          workspace_id: workspaceId,
          email: emailOrUserId.toLowerCase(),
          role,
          invited_by: user.id,
        }).select().single() as { data: any | null; error: any };

        if (error || !invite) {
          console.error("Failed to create workspace invitation:", {
            message: error?.message,
            code: error?.code,
            details: error?.details,
            hint: error?.hint,
          });
          return false;
        }

        // Output invite link to console for testing/production deployment mapping
        const inviteLink = `${window.location.origin}/accept-invitation?code=${invite.id}`;
        console.log("Workspace invitation link generated:", inviteLink);

        await logActivity(workspaceId, "member_invited", "member", `${emailOrUserId} invited as ${role}`);
        await fetchSupabaseData();
        return true;
      }
    }

    // Local Storage Fallback
    const targetUser: UserProfile = existingUser || {
      id: "u-" + Math.random().toString(36).substring(2, 9),
      email: emailOrUserId.includes("@") ? emailOrUserId : `${emailOrUserId}@team.dev`,
      full_name: emailOrUserId.includes("@") ? emailOrUserId.split("@")[0] : emailOrUserId,
    };

    const isAlreadyMember = members.some((m) => m.workspace_id === workspaceId && m.user_id === targetUser.id);
    if (isAlreadyMember) return false;

    const newMember: WorkspaceMember = {
      id: "wm-" + Math.random().toString(36).substring(2, 9),
      workspace_id: workspaceId,
      user_id: targetUser.id,
      role,
      joined_at: new Date().toISOString(),
      profile: targetUser,
    };

    setMembers((prev) => [...prev, newMember]);
    logActivity(workspaceId, "member_joined", "member", `${targetUser.full_name || targetUser.email} joined as ${role}`);

    const notif: Notification = {
      id: "notif-" + Math.random().toString(36).substring(2, 9),
      user_id: targetUser.id,
      workspace_id: workspaceId,
      title: "Workspace Invitation",
      message: `You were added to workspace as ${role}`,
      type: "workspace_invitation",
      is_read: false,
      link_url: `/workspaces/${workspaceId}`,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);
    return true;
  };

  const removeMember = async (workspaceId: string, userId: string) => {
    if (IS_SUPABASE_CONNECTED) {
      await supabase.from("workspace_members").delete().eq("workspace_id", workspaceId).eq("user_id", userId);
      await logActivity(workspaceId, "member_removed", "member", `Teammate removed`);
      await fetchSupabaseData();
      return;
    }

    setMembers((prev) => prev.filter((m) => !(m.workspace_id === workspaceId && m.user_id === userId)));
  };

  const updateMemberRole = async (workspaceId: string, userId: string, role: WorkspaceRole) => {
    if (IS_SUPABASE_CONNECTED) {
      await supabase.from("workspace_members").update({ role } as any).eq("workspace_id", workspaceId).eq("user_id", userId);
      await fetchSupabaseData();
      return;
    }

    setMembers((prev) =>
      prev.map((m) => (m.workspace_id === workspaceId && m.user_id === userId ? { ...m, role } : m))
    );
  };

  // Goals CRUD
  const createGoal = async (
    workspaceId: string,
    title: string,
    description = "",
    priority: PriorityLevel = "medium",
    targetDate?: string
  ) => {
    if (IS_SUPABASE_CONNECTED) {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        alert("Please log in again.");
        throw new Error("Unauthenticated user: Please log in again.");
      }

      const goalData = {
        workspace_id: workspaceId,
        title,
        description,
        status: "not_started" as const,
        priority,
        target_date: targetDate || null,
        created_by: user.id,
      };

      const { data: dbGoal, error } = await supabase.from("goals").insert(goalData as any).select().single() as { data: any | null; error: any };
      if (error || !dbGoal) {
        console.error("Failed to sync goal creation to Supabase:", {
          message: error?.message,
          code: error?.code,
          details: error?.details,
          hint: error?.hint,
        });
        throw error || new Error("Failed to insert goal");
      }
      await logActivity(workspaceId, "goal_created", "goal", title);
      await fetchSupabaseData();
      return dbGoal as Goal;
    }

    const goalData = {
      workspace_id: workspaceId,
      title,
      description,
      status: "not_started" as const,
      priority,
      target_date: targetDate || null,
      created_by: currentUser.id,
    };

    const newGoal: Goal = {
      id: "goal-" + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...goalData,
    };
    setGoals((prev) => [...prev, newGoal]);
    logActivity(workspaceId, "goal_created", "goal", title);
    return newGoal;
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    if (IS_SUPABASE_CONNECTED) {
      await supabase.from("goals").update(updates as any).eq("id", id);
      await fetchSupabaseData();
      return;
    }

    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates, updated_at: new Date().toISOString() } : g))
    );
  };

  const deleteGoal = async (id: string) => {
    if (IS_SUPABASE_CONNECTED) {
      await supabase.from("goals").delete().eq("id", id);
      await fetchSupabaseData();
      return;
    }

    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Milestones CRUD
  const createMilestone = async (goalId: string, workspaceId: string, title: string, description = "", dueDate?: string) => {
    const msData = {
      goal_id: goalId,
      workspace_id: workspaceId,
      title,
      description,
      due_date: dueDate || null,
      status: "pending" as const,
      order_index: milestones.filter((m) => m.goal_id === goalId).length,
    };

    if (IS_SUPABASE_CONNECTED) {
      const { data: dbMs, error } = await supabase.from("milestones").insert(msData as any).select().single() as { data: any | null; error: any };
      if (error || !dbMs) throw error || new Error("Failed to insert milestone");
      await logActivity(workspaceId, "milestone_created", "milestone", title);
      await fetchSupabaseData();
      return dbMs as Milestone;
    }

    const newMilestone: Milestone = {
      id: "ms-" + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...msData,
    };
    setMilestones((prev) => [...prev, newMilestone]);
    logActivity(workspaceId, "milestone_created", "milestone", title);
    return newMilestone;
  };

  const updateMilestone = async (id: string, updates: Partial<Milestone>) => {
    if (IS_SUPABASE_CONNECTED) {
      await supabase.from("milestones").update(updates as any).eq("id", id);
      await fetchSupabaseData();
      return;
    }

    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates, updated_at: new Date().toISOString() } : m))
    );
  };

  const deleteMilestone = async (id: string) => {
    if (IS_SUPABASE_CONNECTED) {
      await supabase.from("milestones").delete().eq("id", id);
      await fetchSupabaseData();
      return;
    }

    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  // Tasks Engine
  const createTask = async (taskData: {
    workspace_id: string;
    title: string;
    description?: string;
    goal_id?: string | null;
    milestone_id?: string | null;
    priority?: PriorityLevel;
    status?: TaskStatus;
    due_date?: string | null;
    estimated_hours?: number | null;
    assigned_to?: string | null;
    tags?: { name: string; color: string }[];
  }) => {
    const rawTask = {
      workspace_id: taskData.workspace_id,
      goal_id: taskData.goal_id || null,
      milestone_id: taskData.milestone_id || null,
      title: taskData.title,
      description: taskData.description || "",
      priority: taskData.priority || "medium",
      status: taskData.status || "todo",
      due_date: taskData.due_date || null,
      estimated_hours: taskData.estimated_hours || 2,
      assigned_to: taskData.assigned_to || null,
      created_by: currentUser.id,
      order_index: tasks.filter((t) => t.workspace_id === taskData.workspace_id).length,
    };

    if (IS_SUPABASE_CONNECTED) {
      const { data: dbTask, error } = await supabase.from("tasks").insert(rawTask as any).select().single() as { data: any | null; error: any };
      if (error || !dbTask) throw error || new Error("Failed to insert task");

      if (taskData.assigned_to && taskData.assigned_to !== currentUser.id) {
        await supabase.from("notifications").insert({
          user_id: taskData.assigned_to,
          workspace_id: taskData.workspace_id,
          title: "Task Assigned",
          message: `${currentUser.full_name} assigned you to "${dbTask.title}"`,
          type: "task_assigned",
          link_url: `/workspaces/${taskData.workspace_id}/kanban`,
        } as any);
      }

      await logActivity(taskData.workspace_id, "task_created", "task", dbTask.title);
      await fetchSupabaseData();
      return dbTask as Task;
    }

    // Local Storage Fallback
    const newTask: Task = {
      id: "task-" + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      subtasks: [],
      tags: (taskData.tags || []).map((t) => ({ id: "tag-" + Math.random().toString(36).substring(2, 7), workspace_id: taskData.workspace_id, ...t })),
      ...rawTask,
    };

    setTasks((prev) => [newTask, ...prev]);
    logActivity(taskData.workspace_id, "task_created", "task", newTask.title);
    return newTask;
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    // Exclude relations not matching Postgres columns directly
    const { subtasks, tags, comments: c, assignee, creator, ...dbUpdates } = updates as any;

    if (IS_SUPABASE_CONNECTED) {
      await supabase.from("tasks").update(dbUpdates as any).eq("id", id);

      if (updates.assigned_to && updates.assigned_to !== currentUser.id) {
        const taskObj = tasks.find((t) => t.id === id);
        if (taskObj && taskObj.assigned_to !== updates.assigned_to) {
          await supabase.from("notifications").insert({
            user_id: updates.assigned_to,
            workspace_id: taskObj.workspace_id,
            title: "Task Assigned",
            message: `You were assigned to "${taskObj.title}"`,
            type: "task_assigned",
            link_url: `/workspaces/${taskObj.workspace_id}/kanban`,
          } as any);
        }
      }

      await fetchSupabaseData();
      return;
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t))
    );
  };

  const moveTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    const taskObj = tasks.find((t) => t.id === taskId);
    const oldStatus = taskObj?.status;

    if (IS_SUPABASE_CONNECTED && taskObj) {
      await supabase.from("tasks").update({ status: newStatus } as any).eq("id", taskId);
      if (oldStatus !== newStatus) {
        await logActivity(
          taskObj.workspace_id,
          newStatus === "done" ? "task_completed" : "status_changed",
          "task",
          taskObj.title,
          { from: oldStatus, to: newStatus }
        );
      }
      await fetchSupabaseData();
      return;
    }

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          if (oldStatus !== newStatus) {
            logActivity(
              t.workspace_id,
              newStatus === "done" ? "task_completed" : "status_changed",
              "task",
              t.title,
              { from: oldStatus, to: newStatus }
            );
          }
          return { ...t, status: newStatus, updated_at: new Date().toISOString() };
        }
        return t;
      })
    );
  };

  const deleteTask = async (id: string) => {
    const taskObj = tasks.find((t) => t.id === id);

    if (IS_SUPABASE_CONNECTED && taskObj) {
      await supabase.from("tasks").delete().eq("id", id);
      await logActivity(taskObj.workspace_id, "task_deleted", "task", taskObj.title);
      await fetchSupabaseData();
      return;
    }

    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Subtasks
  const addSubtask = async (taskId: string, title: string) => {
    if (IS_SUPABASE_CONNECTED) {
      await supabase.from("subtasks").insert({
        task_id: taskId,
        title,
        is_completed: false,
      } as any);
      await fetchSupabaseData();
      return;
    }

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newSubtask = {
            id: "st-" + Math.random().toString(36).substring(2, 9),
            task_id: taskId,
            title,
            is_completed: false,
            order_index: (t.subtasks || []).length,
            created_at: new Date().toISOString(),
          };
          return { ...t, subtasks: [...(t.subtasks || []), newSubtask] };
        }
        return t;
      })
    );
  };

  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    const taskObj = tasks.find((t) => t.id === taskId);
    const sub = taskObj?.subtasks?.find((s) => s.id === subtaskId);

    if (IS_SUPABASE_CONNECTED && sub) {
      await supabase.from("subtasks").update({ is_completed: !sub.is_completed } as any).eq("id", subtaskId);
      await fetchSupabaseData();
      return;
    }

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = (t.subtasks || []).map((st) =>
            st.id === subtaskId ? { ...st, is_completed: !st.is_completed } : st
          );
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
  };

  const deleteSubtask = async (taskId: string, subtaskId: string) => {
    if (IS_SUPABASE_CONNECTED) {
      await supabase.from("subtasks").delete().eq("id", subtaskId);
      await fetchSupabaseData();
      return;
    }

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return { ...t, subtasks: (t.subtasks || []).filter((st) => st.id !== subtaskId) };
        }
        return t;
      })
    );
  };

  // Comments
  const addComment = async (taskId: string, content: string) => {
    const task = tasks.find((t) => t.id === taskId);

    if (IS_SUPABASE_CONNECTED && task) {
      const { data: dbCom, error } = await supabase
        .from("comments")
        .insert({
          task_id: taskId,
          user_id: currentUser.id,
          content,
        } as any)
        .select()
        .single() as { data: any | null; error: any };

      if (error || !dbCom) throw error || new Error("Failed to post comment");

      await logActivity(task.workspace_id, "comment_added", "comment", `Commented on "${task.title}"`);
      await fetchSupabaseData();
      return dbCom as Comment;
    }

    const newComment: Comment = {
      id: "com-" + Math.random().toString(36).substring(2, 9),
      task_id: taskId,
      user_id: currentUser.id,
      content,
      created_at: new Date().toISOString(),
      user: currentUser,
    };
    setComments((prev) => [...prev, newComment]);

    if (task) {
      logActivity(task.workspace_id, "comment_added", "comment", `Commented on "${task.title}"`);
    }

    return newComment;
  };

  // Notifications
  const markNotificationRead = async (id: string) => {
    if (IS_SUPABASE_CONNECTED) {
      await supabase.from("notifications").update({ is_read: true } as any).eq("id", id);
      await fetchSupabaseData();
      return;
    }

    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const markAllNotificationsRead = async () => {
    if (IS_SUPABASE_CONNECTED) {
      await supabase.from("notifications").update({ is_read: true } as any).eq("user_id", currentUser.id);
      await fetchSupabaseData();
      return;
    }

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  // Templates
  const applyWorkspaceTemplate = async (workspaceId: string, templateType: "hackathon" | "learning") => {
    if (templateType === "learning") {
      const g = await createGoal(
        workspaceId,
        "Master Machine Learning & AI Engineering",
        "Comprehensive roadmap covering mathematical foundations, deep learning, and real-world deployment.",
        "high"
      );

      const m1 = await createMilestone(g.id, workspaceId, "1. Python & Linear Algebra Foundations");
      const m2 = await createMilestone(g.id, workspaceId, "2. NumPy, Pandas & Feature Engineering");
      const m3 = await createMilestone(g.id, workspaceId, "3. Classical Supervised & Unsupervised ML");
      const m4 = await createMilestone(g.id, workspaceId, "4. PyTorch Deep Learning & Neural Nets");
      const m5 = await createMilestone(g.id, workspaceId, "5. Large Language Models & RAG Systems");
      const m6 = await createMilestone(g.id, workspaceId, "6. Capstone Production Project");

      await createTask({ workspace_id: workspaceId, goal_id: g.id, milestone_id: m1.id, title: "Review Matrix Multiplications & Eigenvalues", priority: "high", status: "done" });
      await createTask({ workspace_id: workspaceId, goal_id: g.id, milestone_id: m2.id, title: "Build Exploratory Data Analysis Pipeline", priority: "medium", status: "todo" });
      await createTask({ workspace_id: workspaceId, goal_id: g.id, milestone_id: m4.id, title: "Implement Multi-layer Perceptron in PyTorch", priority: "urgent", status: "backlog" });
    } else if (templateType === "hackathon") {
      const g1 = await createGoal(workspaceId, "Core Product Architecture & Backend Engine", "High-performance API and database design", "urgent");
      const g2 = await createGoal(workspaceId, "Interactive Client Application & UX", "Sleek frontend dashboard and demo workflow", "high");
      const g3 = await createGoal(workspaceId, "Pitch Presentation & Live Deployment", "Slide deck, benchmark proof, and cloud deployment", "medium");

      const m1 = await createMilestone(g1.id, workspaceId, "1. Problem Definition & Schema Design");
      const m2 = await createMilestone(g1.id, workspaceId, "2. AI Pipeline & Core Backend API");
      const m3 = await createMilestone(g2.id, workspaceId, "3. UI Design System & Component Library");
      const m4 = await createMilestone(g2.id, workspaceId, "4. Full Client-Server Integration");
      const m5 = await createMilestone(g3.id, workspaceId, "5. Cloud Deploy & Live Demo Deck");

      await createTask({ workspace_id: workspaceId, goal_id: g1.id, milestone_id: m1.id, title: "Draft Data Contracts and System Diagram", priority: "urgent", status: "done", assigned_to: currentUser.id });
      await createTask({ workspace_id: workspaceId, goal_id: g1.id, milestone_id: m2.id, title: "Implement Core Vector Extraction Endpoint", priority: "urgent", status: "in_progress", assigned_to: currentUser.id });
      await createTask({ workspace_id: workspaceId, goal_id: g2.id, milestone_id: m3.id, title: "Build Interactive App Shell & Navigation", priority: "high", status: "todo" });
      await createTask({ workspace_id: workspaceId, goal_id: g3.id, milestone_id: m5.id, title: "Record 2-Minute Demo Video & Deck", priority: "medium", status: "backlog" });
    }
  };

  // AI Roadmap Application
  const applyAIRoadmap = async (workspaceId: string, roadmap: AIRoadmapPlan) => {
    for (const goalData of roadmap.goals) {
      const createdG = await createGoal(workspaceId, goalData.title, goalData.description, goalData.priority);
      for (const milestoneData of goalData.milestones) {
        const createdM = await createMilestone(createdG.id, workspaceId, milestoneData.title, milestoneData.description);
        for (const taskData of milestoneData.tasks) {
          await createTask({
            workspace_id: workspaceId,
            goal_id: createdG.id,
            milestone_id: createdM.id,
            title: taskData.title,
            description: taskData.description,
            priority: taskData.priority,
            estimated_hours: taskData.estimated_hours,
            status: "todo",
            tags: taskData.tags.map((tag) => ({ name: tag, color: "#6366f1" })),
          });
        }
      }
    }
    await logActivity(workspaceId, "ai_roadmap_applied", "workspace", `Applied AI Roadmap`);
  };

  // Computed Helpers
  const getWorkspaceStats = useCallback(
    (workspaceId: string) => {
      const wsTasks = tasks.filter((t) => t.workspace_id === workspaceId);
      const totalTasks = wsTasks.length;
      const completedTasks = wsTasks.filter((t) => t.status === "done").length;
      const activeTasks = wsTasks.filter((t) => t.status === "in_progress" || t.status === "todo" || t.status === "review").length;
      const overdueTasks = wsTasks.filter((t) => {
        if (t.status === "done" || !t.due_date) return false;
        return new Date(t.due_date).getTime() < Date.now();
      }).length;

      const hoursRemaining = wsTasks
        .filter((t) => t.status !== "done")
        .reduce((sum, t) => sum + (t.estimated_hours || 0), 0);

      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        progress,
        totalTasks,
        completedTasks,
        activeTasks,
        overdueTasks,
        hoursRemaining,
      };
    },
    [tasks]
  );

  const getGlobalStats = useCallback(() => {
    const activeWorkspaces = workspaces.length;
    const nowTime = new Date();
    const todayStr = nowTime.toISOString().split("T")[0];

    const tasksDueToday = tasks.filter(
      (t) => t.status !== "done" && t.due_date && t.due_date.startsWith(todayStr)
    ).length;

    const overdueTasks = tasks.filter(
      (t) => t.status !== "done" && t.due_date && new Date(t.due_date).getTime() < nowTime.getTime() && !t.due_date.startsWith(todayStr)
    ).length;

    const completedTasks = tasks.filter((t) => t.status === "done").length;

    return {
      activeWorkspaces,
      tasksDueToday,
      overdueTasks,
      completedTasks,
    };
  }, [workspaces, tasks]);

  const getMemberWorkload = useCallback(
    (workspaceId: string) => {
      const wsMembers = members.filter((m) => m.workspace_id === workspaceId);
      const wsTasks = tasks.filter((t) => t.workspace_id === workspaceId);

      return wsMembers.map((m) => {
        const user = allUsers.find((u) => u.id === m.user_id) || m.profile || {
          id: m.user_id,
          email: "member@planforge.dev",
          full_name: "Team Member",
        };

        const assigned = wsTasks.filter((t) => t.assigned_to === m.user_id);
        const completed = assigned.filter((t) => t.status === "done").length;
        const active = assigned.filter((t) => t.status !== "done").length;
        const overdue = assigned.filter((t) => {
          if (t.status === "done" || !t.due_date) return false;
          return new Date(t.due_date).getTime() < Date.now();
        }).length;

        return {
          user,
          role: m.role,
          assignedCount: assigned.length,
          completedCount: completed,
          activeCount: active,
          overdueCount: overdue,
        };
      });
    },
    [members, tasks, allUsers]
  );

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.is_read && (n.user_id === currentUser.id || !n.user_id)).length;
  }, [notifications, currentUser.id]);

  const contextValue = useMemo<PlanForgeContextType>(
    () => ({
      currentUser,
      allUsers,
      workspaces,
      members,
      goals,
      milestones,
      tasks,
      comments,
      activities,
      notifications,
      activeWorkspaceId,
      unreadNotificationsCount,
      isSupabaseMode: Boolean(IS_SUPABASE_CONNECTED),
      fetchSupabaseData,
      setCurrentUser,
      login,
      signup,
      logout,
      setActiveWorkspaceId,
      createWorkspace,
      updateWorkspace,
      deleteWorkspace,
      addMember,
      removeMember,
      updateMemberRole,
      getWorkspaceMembers,
      createGoal,
      updateGoal,
      deleteGoal,
      createMilestone,
      updateMilestone,
      deleteMilestone,
      createTask,
      updateTask,
      moveTaskStatus,
      deleteTask,
      addSubtask,
      toggleSubtask,
      deleteSubtask,
      addComment,
      markNotificationRead,
      markAllNotificationsRead,
      applyWorkspaceTemplate,
      applyAIRoadmap,
      getWorkspaceStats,
      getGlobalStats,
      getMemberWorkload,
    }),
    [
      currentUser,
      allUsers,
      workspaces,
      members,
      goals,
      milestones,
      tasks,
      comments,
      activities,
      notifications,
      activeWorkspaceId,
      unreadNotificationsCount,
      fetchSupabaseData,
      getWorkspaceMembers,
      getWorkspaceStats,
      getGlobalStats,
      getMemberWorkload,
    ]
  );

  // Guard production mode against missing database variables
  const isProduction = process.env.NODE_ENV === "production";
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("sample-planforge") &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("sample_anon_key");

  if (isProduction && !isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-[#080B11] text-foreground flex items-center justify-center p-4">
        <div className="max-w-md w-full border border-red-500/30 bg-red-500/5 p-6 rounded-2xl text-center space-y-4">
          <div className="h-12 w-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-red-400">Database Configuration Missing</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            PlanForge is running in production mode but the connection credentials for Supabase are missing or misconfigured.
          </p>
          <div className="text-[11px] bg-[#0d121c] border border-border p-3 rounded-lg text-left font-mono space-y-1 text-muted-foreground">
            <div>NEXT_PUBLIC_SUPABASE_URL = missing / invalid</div>
            <div>NEXT_PUBLIC_SUPABASE_ANON_KEY = missing / invalid</div>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Please define these variables in your environment to start.
          </p>
        </div>
      </div>
    );
  }

  if (authLoading && IS_SUPABASE_CONNECTED) {
    return (
      <div className="min-h-screen bg-[#080B11] text-foreground flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[10px] text-muted-foreground tracking-wider uppercase font-semibold">Loading PlanForge...</p>
        </div>
      </div>
    );
  }

  return <PlanForgeContext.Provider value={contextValue}>{children}</PlanForgeContext.Provider>;
}

export function usePlanForge() {
  const context = useContext(PlanForgeContext);
  if (!context) {
    throw new Error("usePlanForge must be used within a PlanForgeProvider");
  }
  return context;
}
