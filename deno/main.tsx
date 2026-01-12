/**
 * Deno Server for Letter Project
 * A simple Oak-based web server for the "致粉丝的信" project
 * Provides API endpoints and serves static content
 */

import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

// In-memory open counter (will reset on server restart)
// For production, consider using a database like Deno KV
let openCount = 0;

// Initialize router
const router = new Router();

// API Routes
router
  .get("/", async (context) => {
    context.response.body = {
      result: "Hello, Devs for Yinyuke!",
      message: "致粉丝的信 API Server",
      endpoints: {
        "/": "API info",
        "/api/letter": "Get letter content",
        "/api/open": "Increment open count (POST)",
        "/api/stats": "Get statistics",
      },
    };
  })
  .get("/api/letter", (context) => {
    // Return letter configuration
    context.response.body = {
      success: true,
      data: LETTER_CONFIG,
    };
  })
  .post("/api/open", async (context) => {
    // Increment open count
    openCount++;
    context.response.body = {
      success: true,
      count: openCount,
      message: "信件打开次数 +1",
    };
  })
  .get("/api/stats", (context) => {
    // Return statistics
    context.response.body = {
      success: true,
      stats: {
        openCount: openCount,
        serverStartTime: new Date().toISOString(),
        artistName: LETTER_CONFIG.artistName,
      },
    };
  })
  .get("/health", (context) => {
    // Health check endpoint
    context.response.body = {
      status: "healthy",
      timestamp: new Date().toISOString(),
    };
  });

// Initialize application
const app = new Application();

// Middleware: Error handling
app.use(async (context, next) => {
  try {
    await next();
  } catch (err) {
    console.error("Error:", err);
    context.response.status = 500;
    context.response.body = {
      success: false,
      error: "Internal server error",
    };
  }
});

// Middleware: Logger
app.use(async (context, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${context.request.method} ${context.request.url} - ${ms}ms`);
});

// Middleware: CORS for all routes
app.use(oakCors());

// Middleware: Router
app.use(router.routes());
app.use(router.allowedMethods());

// Start server
const port = 8000;
console.info(`
╔════════════════════════════════════════════════╗
║  致粉丝的信 - Letter API Server                ║
║  Artist: ${LETTER_CONFIG.artistName}                              ║
╚════════════════════════════════════════════════╝

🚀 CORS-enabled web server listening on port ${port}
📝 API Endpoints:
   - GET  /                  → API info
   - GET  /api/letter        → Letter content
   - POST /api/open          → Increment counter
   - GET  /api/stats         → Statistics
   - GET  /health            → Health check

🌐 Visit: http://localhost:${port}
`);

await app.listen({ port });