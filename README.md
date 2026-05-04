# TickTick / Dida365 MCP Server

English | [简体中文](./README_zh.md)

A Model Context Protocol (MCP) server for TickTick and 滴答清单 (Dida365), designed to work instantly with OpenCode, Claude Desktop, Cherry Studio, and other MCP clients. 

This server acts as a stable, local `stdio` bridge between your AI assistant and your task manager, allowing your AI to manage projects, tasks, tags, and completed-task history seamlessly.

## Features
- **Project CRUD**: List, inspect, create, update, and delete projects/lists.
- **Task Query**: Read tasks from inbox or a specific project, fetch a single task, and query completed-task history.
- **Task CRUD**: Create, update, complete, and delete tasks.
- **Rich Task Fields**: Support tags, priorities, due dates, start dates, reminders, recurrence, sort order, and checklist items.
- **Tag CRUD**: List, create, update, and delete tags.

## Installation

You don't need to configure complex OAuth callbacks. This server uses your personal API Token (Bearer Token) for a true "out-of-the-box" experience.

1. Clone or download this repository.
2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

## Obtaining Your Token
1. Open the web version of [TickTick](https://ticktick.com) or [滴答清单](https://dida365.com).
2. Click your **Avatar -> Settings -> Security -> API Token** (API 口令).
3. Generate and copy your Personal Access Token.

## Client Configuration

This server can be used in any MCP-compatible client. You only need to configure the environment variables:
- `DIDA_TOKEN`: Your API token (Required)
- `SERVICE`: `dida` (for 滴答清单, default) or `ticktick` (for international TickTick)

### 1. OpenCode

OpenCode supports local MCP servers via `stdio`. Add the following to your OpenCode MCP settings:

```json
{
  "mcpServers": {
    "dida365": {
      "command": "npx",
      "args": ["-y", "dida-mcp-server"],
      "env": {
        "DIDA_TOKEN": "YOUR_BEARER_TOKEN_HERE",
        "SERVICE": "dida" 
      }
    }
  }
}
```
*Note: If you use the international version, change `"SERVICE": "dida"` to `"SERVICE": "ticktick"`.*

### 2. Cherry Studio

Cherry Studio also supports MCP configurations seamlessly.
1. Open Cherry Studio.
2. Go to **Settings** (设置) -> **MCP**.
3. Click **Add New Server** (添加新服务).
4. Fill in the details:
   - **Type**: `stdio`
   - **Command**: `npx`
   - **Args**: `-y dida-mcp-server`
   - **Env**: Add `DIDA_TOKEN` with your token, and `SERVICE` with either `dida` or `ticktick`.

## Available MCP Tools

Once connected, OpenCode (or any MCP client) will automatically discover these tools:
- `dida_get_projects`: Retrieve all projects/lists.
- `dida_get_project`: Retrieve a single project/list by ID.
- `dida_create_project`: Create a new project/list.
- `dida_update_project`: Update an existing project/list.
- `dida_delete_project`: Delete a project/list.
- `dida_get_tasks`: Retrieve active tasks from a project (defaults to Inbox).
- `dida_get_task`: Retrieve a single task by ID.
- `dida_get_completed_tasks`: Retrieve completed tasks with optional project/time filtering.
- `dida_create_task`: Create a new task with rich scheduling and checklist fields.
- `dida_update_task`: Update an existing task.
- `dida_complete_task`: Mark a task as done.
- `dida_delete_task`: Delete a task.
- `dida_get_tags`: Retrieve all tags.
- `dida_create_tag`: Create a new tag.
- `dida_update_tag`: Update an existing tag.
- `dida_delete_tag`: Delete a tag.

## License
MIT
