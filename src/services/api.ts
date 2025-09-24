// API service layer for backend integration

import { Project, List, Task, ProjectWithLists, ApiResponse } from '@/types';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Projects
  async getProjects(): Promise<ApiResponse<Project[]>> {
    return this.request('/projects');
  }

  async getProject(id: string): Promise<ApiResponse<ProjectWithLists>> {
    return this.request(`/projects/${id}`);
  }

  async createProject(project: Omit<Project, 'id' | 'project_uid' | 'created_at'>): Promise<ApiResponse<Project>> {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(id: string, project: Partial<Project>): Promise<ApiResponse<Project>> {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  }

  async deleteProject(id: string): Promise<ApiResponse<void>> {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Lists
  async createList(list: Omit<List, 'id' | 'list_uid' | 'created_at'>): Promise<ApiResponse<List>> {
    return this.request('/lists', {
      method: 'POST',
      body: JSON.stringify(list),
    });
  }

  async updateList(id: string, list: Partial<List>): Promise<ApiResponse<List>> {
    return this.request(`/lists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(list),
    });
  }

  async deleteList(id: string): Promise<ApiResponse<void>> {
    return this.request(`/lists/${id}`, {
      method: 'DELETE',
    });
  }

  // Tasks
  async createTask(task: Omit<Task, 'id' | 'task_uid' | 'created_at'>): Promise<ApiResponse<Task>> {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: string, task: Partial<Task>): Promise<ApiResponse<Task>> {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  }

  async deleteTask(id: string): Promise<ApiResponse<void>> {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async moveTask(taskId: string, newListId: number, newPosition?: number): Promise<ApiResponse<Task>> {
    return this.request(`/tasks/${taskId}/move`, {
      method: 'POST',
      body: JSON.stringify({ list_id: newListId, position: newPosition }),
    });
  }
}

export const apiService = new ApiService();