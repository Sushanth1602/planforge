export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workspaces: {
        Row: {
          id: string
          name: string
          description: string | null
          type: 'hackathon' | 'learning' | 'project' | 'competition' | 'personal'
          deadline: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type?: 'hackathon' | 'learning' | 'project' | 'competition' | 'personal'
          deadline?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: 'hackathon' | 'learning' | 'project' | 'competition' | 'personal'
          deadline?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workspace_members: {
        Row: {
          id: string
          workspace_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          joined_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'member'
          joined_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member'
          joined_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          workspace_id: string
          title: string
          description: string | null
          status: 'not_started' | 'in_progress' | 'completed'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          target_date: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          title: string
          description?: string | null
          status?: 'not_started' | 'in_progress' | 'completed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          target_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          title?: string
          description?: string | null
          status?: 'not_started' | 'in_progress' | 'completed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          target_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      milestones: {
        Row: {
          id: string
          goal_id: string
          workspace_id: string
          title: string
          description: string | null
          due_date: string | null
          status: 'pending' | 'in_progress' | 'completed'
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          goal_id: string
          workspace_id: string
          title: string
          description?: string | null
          due_date?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          goal_id?: string
          workspace_id?: string
          title?: string
          description?: string | null
          due_date?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          workspace_id: string
          goal_id: string | null
          milestone_id: string | null
          title: string
          description: string | null
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done'
          due_date: string | null
          estimated_hours: number | null
          created_by: string | null
          assigned_to: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          goal_id?: string | null
          milestone_id?: string | null
          title: string
          description?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done'
          due_date?: string | null
          estimated_hours?: number | null
          created_by?: string | null
          assigned_to?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          goal_id?: string | null
          milestone_id?: string | null
          title?: string
          description?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done'
          due_date?: string | null
          estimated_hours?: number | null
          created_by?: string | null
          assigned_to?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      subtasks: {
        Row: {
          id: string
          task_id: string
          title: string
          is_completed: boolean
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          title: string
          is_completed?: boolean
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          title?: string
          is_completed?: boolean
          order_index?: number
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          workspace_id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          color?: string
          created_at?: string
        }
      }
      task_tags: {
        Row: {
          task_id: string
          tag_id: string
        }
        Insert: {
          task_id: string
          tag_id: string
        }
        Update: {
          task_id?: string
          tag_id?: string
        }
      }
      comments: {
        Row: {
          id: string
          task_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      activity_events: {
        Row: {
          id: string
          workspace_id: string
          user_id: string
          action_type: string
          entity_type: string
          entity_id: string | null
          entity_title: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id: string
          action_type: string
          entity_type: string
          entity_id?: string | null
          entity_title: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          user_id?: string
          action_type?: string
          entity_type?: string
          entity_id?: string | null
          entity_title?: string
          metadata?: Json | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          workspace_id: string | null
          title: string
          message: string
          type: 'task_assigned' | 'deadline_approaching' | 'task_overdue' | 'comment_mention' | 'workspace_invitation' | 'milestone_completed'
          is_read: boolean
          link_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workspace_id?: string | null
          title: string
          message: string
          type?: 'task_assigned' | 'deadline_approaching' | 'task_overdue' | 'comment_mention' | 'workspace_invitation' | 'milestone_completed'
          is_read?: boolean
          link_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workspace_id?: string | null
          title?: string
          message?: string
          type?: 'task_assigned' | 'deadline_approaching' | 'task_overdue' | 'comment_mention' | 'workspace_invitation' | 'milestone_completed'
          is_read?: boolean
          link_url?: string | null
          created_at?: string
        }
      }
    }
  }
}
