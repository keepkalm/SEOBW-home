import express, { Request, Response } from "express";
import cors from "cors";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createMcpServer } from "./mcp/server.js";
import oauthRoutes from "./auth/oauth.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Store active transports by session ID
const transports = new Map<string, SSEServerTransport>();

// Middleware
app.use(cors({
  origin: ['https://seobandwagon.dev', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// OAuth routes
app.use("/auth", oauthRoutes);

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", service: "seobandwagon-mcp" });
});

// Home page with instructions
app.get("/", (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SEO Bandwagon MCP Server</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            line-height: 1.6;
          }
          h1 { color: #333; }
          code {
            background: #f5f5f5;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-size: 0.9em;
          }
          pre {
            background: #f5f5f5;
            padding: 1rem;
            border-radius: 8px;
            overflow-x: auto;
          }
          .endpoint {
            background: #e8f5e9;
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
          }
        </style>
      </head>
      <body>
        <h1>SEO Bandwagon MCP Server</h1>
        <p>This is an MCP server providing Google Search Console and Google Analytics 4 tools.</p>

        <h2>Setup</h2>
        <ol>
          <li>
            <strong>Authenticate:</strong> Visit
            <code>/auth/google?user_id=YOUR_USER_ID</code>
            to connect your Google account.
          </li>
          <li>
            <strong>Configure Claude Code:</strong> Add to your
            <code>~/.claude/settings.json</code>:
            <pre>{
  "mcpServers": {
    "seobandwagon": {
      "type": "sse",
      "url": "${process.env.BASE_URL || "http://localhost:3000"}/mcp?user_id=YOUR_USER_ID"
    }
  }
}</pre>
          </li>
        </ol>

        <h2>Endpoints</h2>
        <div class="endpoint">
          <strong>GET /auth/google?user_id=xxx</strong> - Start OAuth flow
        </div>
        <div class="endpoint">
          <strong>GET /auth/status?user_id=xxx</strong> - Check connection status
        </div>
        <div class="endpoint">
          <strong>GET /mcp?user_id=xxx</strong> - SSE connection for MCP
        </div>
        <div class="endpoint">
          <strong>POST /mcp?user_id=xxx</strong> - Send MCP messages
        </div>

        <h2>Available Tools</h2>
        <h3>Google Search Console</h3>
        <ul>
          <li><code>gsc_list_sites</code> - List verified sites</li>
          <li><code>gsc_search_performance</code> - Query search analytics</li>
          <li><code>gsc_url_inspection</code> - Inspect URL index status</li>
          <li><code>gsc_list_sitemaps</code> - List sitemaps</li>
          <li><code>gsc_submit_sitemap</code> - Submit a sitemap</li>
          <li><code>gsc_delete_sitemap</code> - Delete a sitemap</li>
          <li><code>gsc_index_coverage</code> - Get index coverage</li>
        </ul>
        <h3>Google Analytics 4</h3>
        <ul>
          <li><code>ga4_list_properties</code> - List GA4 properties</li>
          <li><code>ga4_page_report</code> - Page traffic data</li>
          <li><code>ga4_traffic_sources</code> - Traffic sources</li>
          <li><code>ga4_engagement_metrics</code> - Engagement data</li>
          <li><code>ga4_conversions</code> - Conversion events</li>
          <li><code>ga4_realtime</code> - Real-time users</li>
        </ul>
      </body>
    </html>
  `);
});

// MCP SSE endpoint - establish connection
app.get("/mcp", async (req: Request, res: Response) => {
  const userId = req.query.user_id as string;

  if (!userId) {
    res.status(400).json({
      error: "user_id query parameter is required",
      hint: "Add ?user_id=YOUR_USER_ID to the URL",
    });
    return;
  }

  console.log(`[MCP] New SSE connection for user: ${userId}`);

  // Create MCP server instance for this connection
  const mcpServer = createMcpServer();

  // Create SSE transport
  const transport = new SSEServerTransport("/mcp", res);

  // Store transport for message handling
  const sessionId = `${userId}-${Date.now()}`;
  transports.set(sessionId, transport);

  // Set session ID header for client to use
  res.setHeader("X-Session-Id", sessionId);

  // Clean up on connection close
  res.on("close", () => {
    console.log(`[MCP] SSE connection closed for user: ${userId}`);
    transports.delete(sessionId);
  });

  // Connect server to transport
  await mcpServer.connect(transport);
});

// MCP message endpoint - receive messages from client
app.post("/mcp", async (req: Request, res: Response) => {
  const sessionId = req.query.session_id as string;

  if (!sessionId) {
    res.status(400).json({
      error: "session_id query parameter is required",
    });
    return;
  }

  const transport = transports.get(sessionId);

  if (!transport) {
    res.status(404).json({
      error: "Session not found. Establish SSE connection first.",
    });
    return;
  }

  // Handle the incoming message
  await transport.handlePostMessage(req, res);
});

// Start server
app.listen(PORT, () => {
  console.log(`SEO Bandwagon MCP Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`OAuth: http://localhost:${PORT}/auth/google?user_id=test`);
  console.log(`MCP SSE: http://localhost:${PORT}/mcp?user_id=test`);
});
