# TickTick / Dida365 MCP Server

A Model Context Protocol (MCP) server for TickTick and 滴答清单 (Dida365), designed to work instantly with OpenCode, Claude Desktop, Cherry Studio, and other MCP clients. 

This server acts as a stable, local `stdio` bridge between your AI assistant and your task manager, allowing your AI to read, create, and complete tasks seamlessly.

## Features
- **Get Projects**: List all your projects/folders.
- **Get Tasks**: Read tasks from your inbox or a specific project.
- **Create Task**: Add new tasks with priority and due dates.
- **Complete Task**: Mark tasks as done directly from the AI chat.

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
      "command": "node",
      "args": ["/ABSOLUTE_PATH_TO_YOUR_FOLDER/ticktick-mcp-server/dist/index.js"],
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
   - **Command**: `node`
   - **Args**: `/ABSOLUTE_PATH_TO_YOUR_FOLDER/ticktick-mcp-server/dist/index.js`
   - **Env**: Add `DIDA_TOKEN` with your token, and `SERVICE` with either `dida` or `ticktick`.

## Available MCP Tools

Once connected, OpenCode (or any MCP client) will automatically discover these tools:
- `dida_get_projects`: Retrieves all your project IDs.
- `dida_get_tasks`: Gets uncompleted tasks (defaults to Inbox).
- `dida_create_task`: Creates a new task.
- `dida_complete_task`: Marks a task as done.

## License
MIT
