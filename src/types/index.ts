// API Types matching the database schema

export interface Workspace {
  id: number;
  workspace_uid: string;
  name: string;
  description?: string;
  created_at: string;
  created_by: string;
  updated_at?: string;
  updated_by?: string;
  is_active: boolean;
}

export interface Project {
  id: number;
  project_uid: string;
  workspace_id: number;
  name: string;
  description?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  created_by: string;
  updated_at?: string;
  updated_by?: string;
  is_active: boolean;
}

export interface List {
  id: number;
  list_uid: string;
  project_id: number;
  name: string;
  position: number;
  created_at: string;
  created_by: string;
  updated_at?: string;
  updated_by?: string;
  is_active: boolean;
}

export interface Task {
  id: number;
  task_uid: string;
  list_id: number;
  title: string;
  description?: string;
  priority?: string;
  status: string;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  created_by: string;
  updated_at?: string;
  updated_by?: string;
  is_active: boolean;
}

export interface TaskAssignee {
  id: number;
  task_id: number;
  user_id: string;
  assigned_at: string;
}

export interface WorkspaceMember {
  id: number;
  workspace_id: number;
  user_id: string;
  role: string;
  joined_at: string;
}

export interface ProjectMember {
  id: number;
  project_id: number;
  user_id: string;
  role: string;
  joined_at: string;
}

// Frontend UI Types
export interface ProjectWithLists extends Project {
  lists: ListWithTasks[];
}

export interface ListWithTasks extends List {
  tasks: Task[];
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}