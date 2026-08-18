export type WorkspaceType = 'hackathon' | 'learning' | 'project' | 'competition' | 'personal';

export type WorkspaceRole = 'owner' | 'admin' | 'member';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export type GoalStatus = 'not_started' | 'in_progress' | 'completed';

export type MilestoneStatus = 'pending' | 'in_progress' | 'completed';

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';

export type NotificationType = 
  | 'task_assigned' 
  | 'deadline_approaching' 
  | 'task_overdue' 
  | 'comment_mention' 
  | 'workspace_invitation' 
  | 'milestone_completed';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at?: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  joined_at: string;
  profile?: UserProfile;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  type: WorkspaceType;
  deadline?: string | null;
  created_by?: string;
  created_at: string;
  updated_at: string;
  members?: WorkspaceMember[];
  goals_count?: number;
  milestones_count?: number;
  tasks_count?: number;
  completed_tasks_count?: number;
  progress_percent?: number;
}

export interface Goal {
  id: string;
  workspace_id: string;
  title: string;
  description?: string;
  status: GoalStatus;
  priority: PriorityLevel;
  target_date?: string | null;
  created_by?: string;
  created_at: string;
  updated_at: string;
  milestones?: Milestone[];
  progress_percent?: number;
  total_tasks?: number;
  completed_tasks?: number;
}

export interface Milestone {
  id: string;
  goal_id: string;
  workspace_id: string;
  title: string;
  description?: string;
  due_date?: string | null;
  status: MilestoneStatus;
  order_index: number;
  created_at: string;
  updated_at: string;
  tasks?: Task[];
  total_tasks?: number;
  completed_tasks?: number;
  progress_percent?: number;
}

export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  is_completed: boolean;
  order_index: number;
  created_at: string;
}

export interface Tag {
  id: string;
  workspace_id: string;
  name: string;
  color: string;
}

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: UserProfile;
}

export interface Task {
  id: string;
  workspace_id: string;
  goal_id?: string | null;
  milestone_id?: string | null;
  title: string;
  description?: string;
  priority: PriorityLevel;
  status: TaskStatus;
  due_date?: string | null;
  estimated_hours?: number | null;
  created_by?: string | null;
  assigned_to?: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
  subtasks?: Subtask[];
  tags?: Tag[];
  comments?: Comment[];
  assignee?: UserProfile;
  creator?: UserProfile;
  workspace_name?: string;
  goal_title?: string;
  milestone_title?: string;
}

export interface ActivityEvent {
  id: string;
  workspace_id: string;
  user_id: string;
  action_type: string;
  entity_type: 'task' | 'goal' | 'milestone' | 'workspace' | 'comment' | 'member';
  entity_id?: string;
  entity_title: string;
  metadata?: Record<string, any>;
  created_at: string;
  user?: UserProfile;
}

export interface Notification {
  id: string;
  user_id: string;
  workspace_id?: string | null;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  link_url?: string | null;
  created_at: string;
}

export interface AIRoadmapPlan {
  summary: string;
  estimated_duration_days: number;
  goals: {
    title: string;
    description: string;
    priority: PriorityLevel;
    milestones: {
      title: string;
      description: string;
      tasks: {
        title: string;
        description: string;
        priority: PriorityLevel;
        estimated_hours: number;
        suggested_role: string;
        tags: string[];
      }[];
    }[];
  }[];
}

export interface AIRiskAnalysis {
  health_score: number; // 0 - 100
  overall_status: 'On Track' | 'At Risk' | 'Critical Delay';
  summary: string;
  risk_factors: {
    category: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    affected_tasks_or_milestones: string[];
  }[];
  recommendations: string[];
}
