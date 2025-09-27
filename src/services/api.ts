// API service layer for backend integration

import { 
  Project, List, Task, ProjectWithLists, ApiResponse,
  ProjectRequest, ProjectUpdateRequest,
  ListRequest, ListUpdateRequest,
  TaskRequest, TaskUpdateRequest
} from '@/types';

const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || '8080';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://localhost:${BACKEND_PORT}/api`;

class ApiService {
  private log(level: 'info' | 'error' | 'warn', message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const prefix = `[API Service] ${timestamp} [${level.toUpperCase()}]`;
    
    if (level === 'error') {
      console.error(prefix, message, data || '');
    } else if (level === 'warn') {
      console.warn(prefix, message, data || '');
    } else {
      console.log(prefix, message, data || '');
    }
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const method = options?.method || 'GET';
    
    this.log('info', `Making ${method} request to ${url}`, {
      headers: options?.headers,
      body: options?.body ? JSON.parse(options.body as string) : undefined
    });

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      this.log('info', `Response received from ${url}`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.log('error', `API Error: ${response.status} ${response.statusText}`, {
          url,
          method,
          errorBody: errorText
        });
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      this.log('info', `Successful response from ${url}`, data);
      return data;
    } catch (error) {
      this.log('error', `Request failed to ${url}`, {
        error: error instanceof Error ? error.message : String(error),
        method,
        body: options?.body
      });
      throw error;
    }
  }

  // Projects
  async getProjects(): Promise<ApiResponse<Project[]>> {
    return this.request('/projects');
  }

  async getProject(id: string): Promise<ApiResponse<ProjectWithLists>> {
    return this.request(`/projects/${id}`);
  }

  async createProject(project: ProjectRequest): Promise<ApiResponse<Project>> {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(id: string, project: ProjectRequest): Promise<ApiResponse<Project>> {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  }

  async partialUpdateProject(id: string, updates: ProjectUpdateRequest): Promise<ApiResponse<Project>> {
    return this.request(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteProject(id: string): Promise<ApiResponse<void>> {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Lists
  async createList(listData: ListRequest): Promise<ApiResponse<List>> {
    return this.request('/lists', {
      method: 'POST',
      body: JSON.stringify(listData),
    });
  }

  async updateList(uid: string, listData: ListRequest): Promise<ApiResponse<List>> {
    return this.request(`/lists/${uid}`, {
      method: 'PUT',
      body: JSON.stringify(listData),
    });
  }

  async partialUpdateList(uid: string, updates: ListUpdateRequest): Promise<ApiResponse<List>> {
    return this.request(`/lists/${uid}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteList(uid: string): Promise<ApiResponse<void>> {
    return this.request(`/lists/${uid}`, {
      method: 'DELETE',
    });
  }

  // Tasks
  async createTask(taskData: TaskRequest): Promise<ApiResponse<Task>> {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(uid: string, taskData: TaskRequest): Promise<ApiResponse<Task>> {
    return this.request(`/tasks/${uid}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async partialUpdateTask(uid: string, updates: TaskUpdateRequest): Promise<ApiResponse<Task>> {
    return this.request(`/tasks/${uid}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(uid: string): Promise<ApiResponse<void>> {
    return this.request(`/tasks/${uid}`, {
      method: 'DELETE',
    });
  }

  async moveTask(taskUid: string, listUid: string): Promise<ApiResponse<any>> {
    return this.request(`/tasks/${taskUid}/move`, {
      method: 'POST',
      body: JSON.stringify({ list_uid: listUid }),
    });
  }
}

export const apiService = new ApiService();