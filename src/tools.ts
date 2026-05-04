import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { DidaApi } from './dida-api.js';

export function registerTools(server: McpServer, api: DidaApi) {
  // 1. Get Projects
  server.tool(
    'dida_get_projects',
    'Get all projects/lists from Dida365/TickTick',
    {},
    async () => {
      try {
        const projects = await api.getProjects();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(projects, null, 2),
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [{ type: 'text', text: `Error fetching projects: ${error.message}` }],
          isError: true,
        };
      }
    }
  );

  // 2. Get Tasks
  server.tool(
    'dida_get_tasks',
    'Get uncompleted tasks from a specific project/list. If projectId is not provided, defaults to inbox.',
    {
      projectId: z.string().optional().describe('The ID of the project to get tasks from. Defaults to "inbox"'),
    },
    async ({ projectId }) => {
      try {
        const id = projectId || 'inbox';
        const tasks = await api.getTasksByProject(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(tasks, null, 2),
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [{ type: 'text', text: `Error fetching tasks: ${error.message}` }],
          isError: true,
        };
      }
    }
  );

  // 3. Create Task
  server.tool(
    'dida_create_task',
    'Create a new task in Dida365/TickTick',
    {
      title: z.string().describe('The title of the task'),
      projectId: z.string().optional().describe('The project ID to add the task to. Defaults to inbox.'),
      content: z.string().optional().describe('The description or content of the task'),
      priority: z.number().optional().describe('Task priority: 0 (None), 1 (Low), 3 (Medium), 5 (High)'),
      dueDate: z.string().optional().describe('Due date in format "YYYY-MM-DDTHH:mm:ss+0000"'),
    },
    async ({ title, projectId, content, priority, dueDate }) => {
      try {
        const task = await api.createTask({
          title,
          projectId: projectId || 'inbox',
          content,
          priority,
          dueDate,
        });
        return {
          content: [
            {
              type: 'text',
              text: `Task created successfully:\n${JSON.stringify(task, null, 2)}`,
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [{ type: 'text', text: `Error creating task: ${error.message}` }],
          isError: true,
        };
      }
    }
  );

  // 4. Complete Task
  server.tool(
    'dida_complete_task',
    'Mark a task as completed',
    {
      taskId: z.string().describe('The ID of the task to complete'),
      projectId: z.string().describe('The project ID the task belongs to (required by API)'),
    },
    async ({ taskId, projectId }) => {
      try {
        await api.completeTask(projectId, taskId);
        return {
          content: [
            {
              type: 'text',
              text: `Task ${taskId} marked as completed.`,
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [{ type: 'text', text: `Error completing task: ${error.message}` }],
          isError: true,
        };
      }
    }
  );
}
