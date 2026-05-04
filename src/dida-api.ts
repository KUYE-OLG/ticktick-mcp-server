import axios, { AxiosError, AxiosInstance } from 'axios';

export interface ChecklistItem {
  id?: string;
  title: string;
  status?: number;
  sortOrder?: number;
  isAllDay?: boolean;
  startDate?: string;
  timeZone?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  content?: string;
  desc?: string;
  isAllDay?: boolean;
  startDate?: string;
  dueDate?: string;
  timeZone?: string;
  status: number;
  priority: number;
  tags?: string[];
  reminders?: string[];
  repeat?: string;
  items?: ChecklistItem[];
  sortOrder?: number;
  completedTime?: string;
}

export interface Project {
  id: string;
  name: string;
  color?: string;
  sortOrder?: number;
  closed?: boolean;
  groupId?: string;
  viewMode?: 'list' | 'kanban' | 'timeline' | string;
  kind?: 'TASK' | 'NOTE' | string;
}

export interface Tag {
  name: string;
  color?: string;
  sortOrder?: number;
}

export interface CompletedTasksQuery {
  projectIds?: string[];
  startDate?: string;
  endDate?: string;
}

export interface CreateProjectInput {
  name: string;
  color?: string;
  sortOrder?: number;
  viewMode?: 'list' | 'kanban' | 'timeline' | string;
  kind?: 'TASK' | 'NOTE' | string;
}

export interface UpdateProjectInput {
  name?: string;
  color?: string;
  sortOrder?: number;
  viewMode?: 'list' | 'kanban' | 'timeline' | string;
  kind?: 'TASK' | 'NOTE' | string;
  closed?: boolean;
}

export interface CreateTagInput {
  name: string;
  color?: string;
}

export interface UpdateTagInput {
  name?: string;
  color?: string;
}

export class DidaApi {
  private client: AxiosInstance;

  constructor(token: string, domain: string = 'api.dida365.com') {
    this.client = axios.create({
      baseURL: `https://${domain}/open/v1`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getProjects(): Promise<Project[]> {
    const response = await this.client.get('/project');
    return response.data;
  }

  async getProject(projectId: string): Promise<Project> {
    const response = await this.client.get(`/project/${projectId}`);
    return response.data;
  }

  async createProject(project: CreateProjectInput): Promise<Project> {
    const response = await this.client.post('/project', project);
    return response.data;
  }

  async updateProject(projectId: string, project: UpdateProjectInput): Promise<Project> {
    const response = await this.client.put(`/project/${projectId}`, project);
    return response.data;
  }

  async deleteProject(projectId: string): Promise<void> {
    await this.client.delete(`/project/${projectId}`);
  }

  async getTasksByProject(projectId: string): Promise<Task[]> {
    const response = await this.client.get(`/project/${projectId}/data`);
    return response.data.tasks || [];
  }

  async getTask(taskId: string): Promise<Task> {
    const response = await this.client.get(`/task/${taskId}`);
    return response.data;
  }

  async getCompletedTasks(query: CompletedTasksQuery = {}): Promise<Task[]> {
    const response = await this.client.post('/task/completed', query);
    return response.data ?? [];
  }

  async createTask(task: Partial<Task>): Promise<Task> {
    const response = await this.client.post('/task', task);
    return response.data;
  }

  async updateTask(taskId: string, task: Partial<Task>): Promise<Task> {
    const response = await this.client.post(`/task/${taskId}`, task);
    return response.data;
  }

  async completeTask(projectId: string, taskId: string): Promise<void> {
    await this.client.post(`/project/${projectId}/task/${taskId}/complete`);
  }

  async deleteTask(projectId: string, taskId: string): Promise<void> {
    try {
      await this.client.delete(`/task/${projectId}/${taskId}`);
    } catch (error) {
      if (this.shouldFallbackToLegacyPath(error)) {
        await this.client.delete(`/project/${projectId}/task/${taskId}`);
        return;
      }
      throw error;
    }
  }

  async getTags(): Promise<Tag[]> {
    const response = await this.client.get('/tag');
    return response.data;
  }

  async createTag(tag: CreateTagInput): Promise<Tag> {
    const response = await this.client.post('/tag', tag);
    return response.data;
  }

  async updateTag(tagIdentifier: string, tag: UpdateTagInput): Promise<Tag> {
    const response = await this.client.put(`/tag/${encodeURIComponent(tagIdentifier)}`, tag);
    return response.data;
  }

  async deleteTag(tagIdentifier: string): Promise<void> {
    await this.client.delete(`/tag/${encodeURIComponent(tagIdentifier)}`);
  }

  private shouldFallbackToLegacyPath(error: unknown): boolean {
    if (!axios.isAxiosError(error)) {
      return false;
    }

    const status = (error as AxiosError).response?.status;
    return status === 404 || status === 405;
  }
}
