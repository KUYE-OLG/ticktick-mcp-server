#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { DidaApi } from './dida-api.js';
import { registerTools } from './tools.js';

async function main() {
  const token = process.env.DIDA_TOKEN;
  
  if (!token) {
    console.error('Error: DIDA_TOKEN environment variable is required.');
    process.exit(1);
  }

  // Determine domain based on service type (Dida365 vs TickTick)
  const service = (process.env.SERVICE || 'dida').toLowerCase();
  const domain = service === 'ticktick' ? 'api.ticktick.com' : 'api.dida365.com';

  const api = new DidaApi(token, domain);

  // Initialize the MCP server
  const server = new McpServer({
    name: 'dida365-mcp-server',
    version: '1.0.0',
  });

  // Register tools
  registerTools(server, api);

  // Start the server with Stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Note: StdioServerTransport handles stderr mapping automatically in most cases,
  // but we can log initialization to stderr if needed so it doesn't pollute stdout.
  console.error(`Dida365/TickTick MCP Server running on stdio (domain: ${domain})`);
}

main().catch((error) => {
  console.error('Server encountered an error:', error);
  process.exit(1);
});
