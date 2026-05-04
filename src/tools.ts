import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { DidaApi } from './dida-api.js';

const checklistItemSchema = z.object({
  id: z.string().optional().describe('Existing checklist item ID when updating'),
  title: z.string().describe('Checklist item title'),
  status: z.number().optional().describe('Checklist item status: 0 incomplete, 1 completed'),
  sortOrder: z.number().optional().describe('Checklist item sort order'),
  isAllDay: z.boolean().optional().describe('Whether the checklist item is all day'),
  startDate: z.string().optional().describe('Checklist item start date in format YYYY-MM-DDTHH:mm:ss+0000'),
  timeZone: z.string().optional().describe('Checklist item timezone'),
});

function createError(message: string) {
  return {
    content: [{ type: 'text' as const, text: message }],
    isError: true,
  };
}

function createSuccess(text: string) {
  return {
    content: [{ type: 'text' as const, text }],
  };
}

export function registerTools(server: McpServer, api: DidaApi) {
  server.tool('dida_get_projects', 'Get all projects/lists from Dida365/TickTick', {}, async () => {
    try {
      const projects = await api.getProjects();
      return createSuccess(JSON.stringify(projects, null, 2));
    } catch (error: any) {
      return createError(`Error fetching projects: ${error.message}`);
    }
  });

  server.tool(
    'dida_get_project',
    'Get a single project/list by ID from Dida365/TickTick',
    {
      projectId: z.string().describe('The ID of the project to retrieve'),
    },
    async ({ projectId }) => {
      try {
        const project = await api.getProject(projectId);
        return createSuccess(JSON.stringify(project, null, 2));
      } catch (error: any) {
        return createError(`Error fetching project: ${error.message}`);
      }
    }
  );

  server.tool(
    'dida_create_project',
    'Create a new project/list in Dida365/TickTick',
    {
      name: z.string().describe('Project name'),
      color: z.string().optional().describe('Project color, e.g. #F18181'),
      sortOrder: z.number().optional().describe('Sort order for the project'),
      viewMode: z.string().optional().describe('View mode, such as list, kanban, or timeline'),
      kind: z.string().optional().describe('Project kind, such as TASK or NOTE'),
    },
    async ({ name, color, sortOrder, viewMode, kind }) => {
      try {
        const project = await api.createProject({ name, color, sortOrder, viewMode, kind });
        return createSuccess(`Project created successfully:\n${JSON.stringify(project, null, 2)}`);
      } catch (error: any) {
        return createError(`Error creating project: ${error.message}`);
      }
    }
  );

  server.tool(
    'dida_update_project',
    'Update an existing project/list in Dida365/TickTick',
    {
      projectId: z.string().describe('The ID of the project to update'),
      name: z.string().optional().describe('New project name'),
      color: z.string().optional().describe('New project color'),
      sortOrder: z.number().optional().describe('New sort order'),
      viewMode: z.string().optional().describe('View mode, such as list, kanban, or timeline'),
      kind: z.string().optional().describe('Project kind, such as TASK or NOTE'),
      closed: z.boolean().optional().describe('Whether the project is closed'),
    },
    async ({ projectId, name, color, sortOrder, viewMode, kind, closed }) => {
      try {
        const project = await api.updateProject(projectId, {
          name,
          color,
          sortOrder,
          viewMode,
          kind,
          closed,
        });
        return createSuccess(`Project updated successfully:\n${JSON.stringify(project, null, 2)}`);
      } catch (error: any) {
        return createError(`Error updating project: ${error.message}`);
      }
    }
  );

  server.tool(
    'dida_delete_project',
    'Delete a project/list permanently from Dida365/TickTick',
    {
      projectId: z.string().describe('The ID of the project to delete'),
    },
    async ({ projectId }) => {
      try {
        await api.deleteProject(projectId);
        return createSuccess(`Project ${projectId} deleted successfully.`);
      } catch (error: any) {
        return createError(`Error deleting project: ${error.message}`);
      }
    }
  );

  server.tool(
    'dida_get_tasks',
    'Get uncompleted tasks from a specific project/list. If projectId is not provided, defaults to inbox.',
    {
      projectId: z.string().optional().describe('The ID of the project to get tasks from. Defaults to inbox'),
    },
    async ({ projectId }) => {
      try {
        const tasks = await api.getTasksByProject(projectId || 'inbox');
        return createSuccess(JSON.stringify(tasks, null, 2));
      } catch (error: any) {
        return createError(`Error fetching tasks: ${error.message}`);
      }
    }
  );

  server.tool(
    'dida_get_task',
    'Get a single task by ID from Dida365/TickTick',
    {
      taskId: z.string().describe('The ID of the task to retrieve'),
    },
    async ({ taskId }) => {
      try {
        const task = await api.getTask(taskId);
        return createSuccess(JSON.stringify(task, null, 2));
      } catch (error: any) {
        return createError(`Error fetching task: ${error.message}`);
      }
    }
  );

  server.tool(
    'dida_get_completed_tasks',
    'Get completed tasks from Dida365/TickTick, optionally filtered by projects and time range',
    {
      projectIds: z.array(z.string()).optional().describe('Optional list of project IDs to filter completed tasks'),
      startDate: z.string().optional().describe('Optional start date in format YYYY-MM-DDTHH:mm:ss+0000'),
      endDate: z.string().optional().describe('Optional end date in format YYYY-MM-DDTHH:mm:ss+0000'),
    },
    async ({ projectIds, startDate, endDate }) => {
      try {
        const tasks = await api.getCompletedTasks({ projectIds, startDate, endDate });
        return createSuccess(JSON.stringify(tasks, null, 2));
      } catch (error: any) {
        return createError(`Error fetching completed tasks: ${error.message}`);
      }
    }
  );

  server.tool(
    'dida_create_task',
    'Create a new task in Dida365/TickTick',
    {
      title: z.string().describe('The title of the task'),
      projectId: z.string().optional().describe('The project ID to add the task to. Defaults to inbox'),
      content: z.string().optional().describe('The description or content of the task'),
      priority: z.number().optional().describe('Task priority: 0 (None), 1 (Low), 3 (Medium), 5 (High)'),
      dueDate: z.string().optional().describe('Due date in format YYYY-MM-DDTHH:mm:ss+0000'),
      startDate: z.string().optional().describe('Start date in format YYYY-MM-DDTHH:mm:ss+0000'),
      isAllDay: z.boolean().optional().describe('Whether the task is an all-day event'),
      tags: z.array(z.string()).optional().describe('Array of tag names to attach to the task'),
      reminders: z.array(z.string()).optional().describe('Reminder trigger strings as expected by the API'),
      repeat: z.string().optional().describe('Repeat rule string, such as RRULE:FREQ=DAILY;INTERVAL=1'),
      sortOrder: z.number().optional().describe('Manual sort order for the task'),
      items: z.array(checklistItemSchema).optional().describe('Checklist or subtask items to attach'),
    },
    async ({ title, projectId, content, priority, dueDate, startDate, isAllDay, tags, reminders, repeat, sortOrder, items }) => {
      try {
        const task = await api.createTask({
          title,
          projectId: projectId || 'inbox',
          content,
          priority,
          dueDate,
          startDate,
          isAllDay,
          tags,
          reminders,
          repeat,
          sortOrder,
          items,
        });
        return createSuccess(`Task created successfully:\n${JSON.stringify(task, null, 2)}`);
      } catch (error: any) {
        return createError(`Error creating task: ${error.message}`);
      }
    }
  );

  server.tool(
    'dida_update_task',
    'Update an existing task in Dida365/TickTick',
    {
      taskId: z.string().describe('The ID of the task to update'),
      title: z.string().optional().describe('The new title of the task'),
      content: z.string().optional().describe('The new description or content'),
      priority: z.number().optional().describe('Task priority: 0 (None), 1 (Low), 3 (Medium), 5 (High)'),
      dueDate: z.string().optional().describe('Due date in format YYYY-MM-DDTHH:mm:ss+0000'),
      startDate: z.string().optional().describe('Start date in format YYYY-MM-DDTHH:mm:ss+0000'),
      isAllDay: z.boolean().optional().describe('Whether the task is an all-day event'),
      tags: z.array(z.string()).optional().describe('Array of tag names to attach to the task'),
      reminders: z.array(z.string()).optional().describe('Reminder trigger strings as expected by the API'),
      repeat: z.string().optional().describe('Repeat rule string, such as RRULE:FREQ=DAILY;INTERVAL=1'),
      sortOrder: z.number().optional().describe('Manual sort order for the task'),
      items: z.array(checklistItemSchema).optional().describe('Checklist or subtask items to attach'),
      status: z.number().optional().describe('Task status: 0 (Incomplete), 2 (Completed)'),
    },
    async ({ taskId, title, content, priority, dueDate, startDate, isAllDay, tags, reminders, repeat, sortOrder, items, status }) => {
      try {
        const updateData: Record<string, unknown> = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        if (priority !== undefined) updateData.priority = priority;
        if (dueDate !== undefined) updateData.dueDate = dueDate;
        if (startDate !== undefined) updateData.startDate = startDate;
        if (isAllDay !== undefined) updateData.isAllDay = isAllDay;
        if (tags !== undefined) updateData.tags = tags;
        if (reminders !== undefined) updateData.reminders = reminders;
        if (repeat !== undefined) updateData.repeat = repeat;
        if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
        if (items !== undefined) updateData.items = items;
        if (status !== undefined) updateData.status = status;

        const task = await api.updateTask(taskId, updateData);
        return createSuccess(`Task updated successfully:\n${JSON.stringify(task, null, 2)}`);
      } catch (error: any) {
        return createError(`Error updating task: ${error.message}`);
      }
    }
  );

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
        return createSuccess(`Task ${taskId} marked as completed.`);
      } catch (error: any) {
        return createError(`Error completing task: ${error.message}`);
      }
    }
  );

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
        return createSuccess(`Task ${taskId} deleted successfully.`);
      } catch (error: any) {
        return createError(`Error deleting task: ${error.message}`);
      }
    }
  );

  server.tool('dida_get_tags', 'Get all tags from Dida365/TickTick', {}, async () => {
    try {
      const tags = await api.getTags();
      return createSuccess(JSON.stringify(tags, null, 2));
    } catch (error: any) {
      return createError(`Error fetching tags: ${error.message}`);
    }
  });

  server.tool(
    'dida_create_tag',
    'Create a new tag in Dida365/TickTick',
    {
      name: z.string().describe('Tag name'),
      color: z.string().optional().describe('Tag color, e.g. #FF5733'),
    },
    async ({ name, color }) => {
      try {
        const tag = await api.createTag({ name, color });
        return createSuccess(`Tag created successfully:\n${JSON.stringify(tag, null, 2)}`);
      } catch (error: any) {
        return createError(`Error creating tag: ${error.message}`);
      }
    }
  );

  server.tool(
    'dida_update_tag',
    'Update an existing tag in Dida365/TickTick',
    {
      tagIdentifier: z.string().describe('The tag identifier used by the API, typically tag ID or name'),
      name: z.string().optional().describe('New tag name'),
      color: z.string().optional().describe('New tag color'),
    },
    async ({ tagIdentifier, name, color }) => {
      try {
        const tag = await api.updateTag(tagIdentifier, { name, color });
        return createSuccess(`Tag updated successfully:\n${JSON.stringify(tag, null, 2)}`);
      } catch (error: any) {
        return createError(`Error updating tag: ${error.message}`);
      }
    }
  );

  server.tool(
    'dida_delete_tag',
    'Delete a tag from Dida365/TickTick',
    {
      tagIdentifier: z.string().describe('The tag identifier used by the API, typically tag ID or name'),
    },
    async ({ tagIdentifier }) => {
      try {
        await api.deleteTag(tagIdentifier);
        return createSuccess(`Tag ${tagIdentifier} deleted successfully.`);
      } catch (error: any) {
        return createError(`Error deleting tag: ${error.message}`);
      }
    }
  );
}
