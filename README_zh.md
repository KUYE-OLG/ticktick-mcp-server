# TickTick / 滴答清单 MCP Server

[English](./README.md) | 简体中文

这是一个为 TickTick 和 滴答清单 (Dida365) 设计的 Model Context Protocol (MCP) 服务器，可与 OpenCode、Claude Desktop、Cherry Studio 等 MCP 客户端即插即用。

它作为你的 AI 助手与任务管理器之间稳定、本地的 `stdio` 桥梁，让 AI 可以无缝地管理项目、任务、标签以及已完成任务历史。

## 功能特点
- **项目 CRUD**：列出、查看、创建、更新和删除项目/清单。
- **任务查询**：读取收集箱或指定项目下的任务、获取单个任务详情、查询已完成任务历史。
- **任务 CRUD**：创建、更新、完成和删除任务。
- **丰富任务字段**：支持标签、优先级、截止时间、开始时间、提醒、重复规则、排序和清单项。
- **标签 CRUD**：列出、创建、更新和删除标签。

## 本项目的优势
- **无需复杂 OAuth 流程**：直接使用个人 API Token，不需要浏览器回调、重定向地址和额外的 token 刷新逻辑。
- **同时支持 TickTick 与滴答清单**：通过一个 `SERVICE` 环境变量即可在国际版和国内版之间切换。
- **更贴近日常使用场景**：除了基础的项目/任务操作外，还提供标签 CRUD 和已完成任务历史查询。
- **本地优先的 MCP 集成方式**：作为简单的 `stdio` 服务运行，适合 OpenCode、Claude Desktop、Cherry Studio 等客户端接入。
- **双语文档更容易上手**：同时提供英文和简体中文文档。

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
      "args": ["-y", "dida-mcp-server"],
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
   - **Args (参数)**: `-y dida-mcp-server`
   - **Env (环境变量)**: 增加一行 `DIDA_TOKEN` 并填入你的 token；再增加一行 `SERVICE` 填入 `dida` 或 `ticktick`。

## 可用 MCP 工具 (Tools)

连接成功后，OpenCode（或其他 MCP 客户端）会自动识别并使用以下工具：
- `dida_get_projects`: 获取所有项目/清单。
- `dida_get_project`: 根据 ID 获取单个项目/清单详情。
- `dida_create_project`: 创建新的项目/清单。
- `dida_update_project`: 更新现有项目/清单。
- `dida_delete_project`: 删除项目/清单。
- `dida_get_tasks`: 获取某个项目中的活动任务（默认收集箱）。
- `dida_get_task`: 根据 ID 获取单个任务详情。
- `dida_get_completed_tasks`: 按项目或时间范围获取已完成任务。
- `dida_create_task`: 创建带有丰富时间/清单字段的新任务。
- `dida_update_task`: 更新现有任务。
- `dida_complete_task`: 将任务标记为已完成。
- `dida_delete_task`: 删除任务。
- `dida_get_tags`: 获取所有标签。
- `dida_create_tag`: 创建标签。
- `dida_update_tag`: 更新标签。
- `dida_delete_tag`: 删除标签。

## 许可证
MIT
