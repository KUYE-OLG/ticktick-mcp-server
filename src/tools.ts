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
          content: [{ type: 'text', text: JSON.stringify(projects, null, 2) }],
        };
      } catch (error: any) {
        return { content: [{ type: 'text', text: `Error fetching projects: ${error.message}` }], isError: true };
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
        const tasks = await api.getTasksByProject(projectId || 'inbox');
        return {
          content: [{ type: 'text', text: JSON.stringify(tasks, null, 2) }],
        };
      } catch (error: any) {
        return { content: [{ type: 'text', text: `Error fetching tasks: ${error.message}` }], isError: true };
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
      isAllDay: z.boolean().optional().describe('Whether the task is an all-day event'),
      tags: z.array(z.string()).optional().describe('Array of tag names to attach to the task'),
    },
    async ({ title, projectId, content, priority, dueDate, isAllDay, tags }) => {
      try {
        const task = await api.createTask({
          title,
          projectId: projectId || 'inbox',
          content,
          priority,
          dueDate,
          isAllDay,
          tags,
        });
        return {
          content: [{ type: 'text', text: `Task created successfully:\n${JSON.stringify(task, null, 2)}` }],
        };
      } catch (error: any) {
        return { content: [{ type: 'text', text: `Error creating task: ${error.message}` }], isError: true };
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
          content: [{ type: 'text', text: `Task ${taskId} marked as completed.` }],
        };
      } catch (error: any) {
        return { content: [{ type: 'text', text: `Error completing task: ${error.message}` }], isError: true };
      }
    }
  );

  // 5. Update Task
  server.tool(
    'dida_update_task',
    'Update an existing task in Dida365/TickTick',
    {
      taskId: z.string().describe('The ID of the task to update'),
      title: z.string().optional().describe('The new title of the task'),
      content: z.string().optional().describe('The new description or content'),
      priority: z.number().optional().describe('Task priority: 0 (None), 1 (Low), 3 (Medium), 5 (High)'),
      dueDate: z.string().optional().describe('Due date in format "YYYY-MM-DDTHH:mm:ss+0000"'),
      isAllDay: z.boolean().optional().describe('Whether the task is an all-day event'),
      tags: z.array(z.string()).optional().describe('Array of tag names to attach to the task'),
      status: z.number().optional().describe('Task status: 0 (Incomplete), 2 (Completed)'),
    },
    async ({ taskId, title, content, priority, dueDate, isAllDay, tags, status }) => {
      try {
        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        if (priority !== undefined) updateData.priority = priority;
        if (dueDate !== undefined) updateData.dueDate = dueDate;
        if (isAllDay !== undefined) updateData.isAllDay = isAllDay;
        if (tags !== undefined) updateData.tags = tags;
        if (status !== undefined) updateData.status = status;

        const task = await api.updateTask(taskId, updateData);
        return {
          content: [{ type: 'text', text: `Task updated successfully:\n${JSON.stringify(task, null, 2)}` }],
        };
      } catch (error: any) {
        return { content: [{ type: 'text', text: `Error updating task: ${error.message}` }], isError: true };
      }
    }
  );

  // 6. Delete Task
  server.tool(
    'dida_delete_task',
    'Delete a task permanently',
    {
      taskId: z.string().describe('The ID of the task to delete'),
      projectId: z.string().describe('The project ID the task belongs to'),
    },
    async ({ taskId, projectId }) => {
      try {
        await api.deleteTask(projectId, taskId);
        return {
          content: [{ type: 'text', text: `Task ${taskId} deleted successfully.` }],
        };
      } catch (error: any) {
        return { content: [{ type: 'text', text: `Error deleting task: ${error.message}` }], isError: true };
      }
    }
  );

  // 7. Get Tags
  server.tool(
    'dida_get_tags',
    'Get all tags from Dida365/TickTick',
    {},
    async () => {
      try {
        const tags = await api.getTags();
        return {
          content: [{ type: 'text', text: JSON.stringify(tags, null, 2) }],
        };
      } catch (error: any) {
        return { content: [{ type: 'text', text: `Error fetching tags: ${error.message}` }], isError: true };
      }
    }
  );
}
