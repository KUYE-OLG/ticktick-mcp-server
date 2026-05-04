import axios, { AxiosInstance } from 'axios';

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
}

export interface Project {
  id: string;
  name: string;
  color: string;
  sortOrder: number;
  closed: boolean;
  groupId: string;
}

export interface Tag {
  name: string;
  color: string;
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

  async getTasksByProject(projectId: string): Promise<Task[]> {
    const response = await this.client.get(`/project/${projectId}/data`);
    return response.data.tasks || [];
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
    await this.client.delete(`/project/${projectId}/task/${taskId}`);
  }

  async getTags(): Promise<Tag[]> {
    const response = await this.client.get('/tag');
    return response.data;
  }
}
