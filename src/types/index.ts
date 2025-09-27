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
  name: string;
  description?: string;
  status: string;
  color: string;
  position?: number;
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
  color: string;
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
  color: string;
  position?: number;
  is_completed: boolean;
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

// Request Types for API calls
export interface ProjectRequest {
  name: string;
  description?: string;
  status?: string;
  color?: string;
  position?: number;
  start_date?: string;
  end_date?: string;
}

export interface ProjectUpdateRequest {
  name?: string;
  description?: string;
  status?: string;
  color?: string;
  position?: number;
  start_date?: string;
  end_date?: string;
}

export interface ListRequest {
  project_uid: string;
  name: string;
  color?: string;
  position?: number;
}

export interface ListUpdateRequest {
  name?: string;
  color?: string;
  position?: number;
}

export interface TaskRequest {
  list_uid: string;
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  color?: string;
  position?: number;
  is_completed?: boolean;
  due_date?: string;
}

export interface TaskUpdateRequest {
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
  color?: string;
  position?: number;
  is_completed?: boolean;
  due_date?: string;
}

// Color constants
export const COLORS = {
  WHITE: '#FFFFFF',
  RED: '#EF4444',
  BLUE: '#3B82F6',
  GREEN: '#10B981',
  YELLOW: '#F59E0B',
  ORANGE: '#F97316',
  PURPLE: '#8B5CF6',
} as const;

export const COLOR_OPTIONS = [
  { name: 'White', value: COLORS.WHITE },
  { name: 'Red', value: COLORS.RED },
  { name: 'Blue', value: COLORS.BLUE },
  { name: 'Green', value: COLORS.GREEN },
  { name: 'Yellow', value: COLORS.YELLOW },
  { name: 'Orange', value: COLORS.ORANGE },
  { name: 'Purple', value: COLORS.PURPLE },
] as const;