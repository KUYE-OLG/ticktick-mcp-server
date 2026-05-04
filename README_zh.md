# TickTick / 滴答清单 MCP Server

[English](./README.md) | 简体中文

这是一个为 TickTick 和 滴答清单 (Dida365) 设计的 Model Context Protocol (MCP) 服务器，可与 OpenCode、Claude Desktop、Cherry Studio 等 MCP 客户端即插即用。

它作为你的 AI 助手与任务管理器之间稳定、本地的 `stdio` 桥梁，让 AI 可以无缝地读取、创建和完成任务。

## 功能特点
- **获取清单 (Get Projects)**：列出你所有的项目/清单文件夹。
- **获取任务 (Get Tasks)**：读取特定清单或收集箱中的待办任务。
- **创建任务 (Create Task)**：添加新任务，支持设置标签、优先级和截止日期。
- **更新任务 (Update Task)**：修改现有任务（标题、描述、标签、时间等）。
- **完成任务 (Complete Task)**：直接在 AI 对话中将任务标记为已完成。
- **删除任务 (Delete Task)**：永久删除不需要的任务。
- **获取标签 (Get Tags)**：列出你所有的标签。

## 安装指南

告别复杂的 OAuth 回调配置！本服务器直接使用你的个人 API Token（Bearer Token），提供真正的“开箱即用”体验。

1. 克隆或下载本仓库。
2. 安装依赖并构建：
   ```bash
   npm install
   npm run build
   ```

## 获取你的 Token
1. 打开 [TickTick](https://ticktick.com) 或 [滴答清单](https://dida365.com) 网页版。
2. 点击你的 **头像 -> 设置 -> 账户与安全 -> API 口令 (API Token)**。
3. 生成并复制你的个人访问 Token。

## 客户端配置

本服务器适用于任何兼容 MCP 的客户端。你只需要配置以下环境变量：
- `DIDA_TOKEN`: 你的 API Token（必填）
- `SERVICE`: `dida`（代表滴答清单，默认值）或 `ticktick`（代表国际版 TickTick）

### 1. OpenCode

OpenCode 支持通过 `stdio` 连接本地 MCP 服务器。在 OpenCode 的 MCP 设置中添加以下内容：

```json
{
  "mcpServers": {
    "dida365": {
      "command": "npx",
      "args": ["-y", "@kk_6426988/ticktick-mcp-server"],
      "env": {
        "DIDA_TOKEN": "你的_TOKEN_填在这里",
        "SERVICE": "dida"
      }
    }
  }
}
```
*注：如果你使用的是国际版，请将 `"SERVICE": "dida"` 改为 `"SERVICE": "ticktick"`。*

### 2. Cherry Studio

Cherry Studio 也能完美支持 MCP 配置：
1. 打开 Cherry Studio。
2. 进入 **设置** -> **MCP**。
3. 点击 **添加新服务**。
4. 填写以下信息：
   - **Type (类型)**: `stdio`
   - **Command (命令)**: `npx`
   - **Args (参数)**: `-y @kk_6426988/ticktick-mcp-server`
   - **Env (环境变量)**: 增加一行 `DIDA_TOKEN` 并填入你的 token；再增加一行 `SERVICE` 填入 `dida` 或 `ticktick`。

## 可用 MCP 工具 (Tools)

连接成功后，OpenCode（或其他 MCP 客户端）会自动识别并使用以下工具：
- `dida_get_projects`: 获取你所有的清单列表 ID。
- `dida_get_tasks`: 获取未完成的任务（默认获取收集箱任务）。
- `dida_create_task`: 创建一个新任务。
- `dida_update_task`: 更新现有任务。
- `dida_complete_task`: 将任务标记为已完成。
- `dida_delete_task`: 删除任务。
- `dida_get_tags`: 获取所有标签。

## 许可证
MIT
