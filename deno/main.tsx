/**
 * Deno Server for Letter Project
 * A simple Oak-based web server for the "致粉丝的信" project
 * Provides API endpoints and serves static content
 */

import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Initialize router
const router = new Router();

// API Routes
router
  .get("/", async (context) => {
    context.response.body = "Hello from cn semantics!";
  })
  .get("/search_by_word", async (context) => {
    console.log("search_by_word");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    const queryParams = context.request.url.searchParams;
    const word = queryParams.get("word");
    const limit = queryParams.get("limit") || "100";
    const cursor = queryParams.get("cursor");

    // Validate word parameter
    if (!word) {
      context.response.status = 400;
      context.response.body = { error: "word parameter is required" };
      return;
    }

    // Convert limit to number and validate
    const limitNum = parseInt(limit as string, 10);
    if (isNaN(limitNum) || limitNum <= 0 || limitNum > 1000) {
      context.response.status = 400;
      context.response.body = {
        error: "limit must be a positive number between 1 and 1000",
      };
      return;
    }

    try {
      // Build the query with pagination
      let query = supabase
        .from("vocabulary_difficulty_levels")
        .select("*")
        .ilike("word", `%${word}%`)
        .order("id", { ascending: true })
        .limit(limitNum);

      // Add cursor-based pagination if cursor is provided
      if (cursor) {
        const cursorNum = parseInt(cursor, 10);
        if (isNaN(cursorNum)) {
          context.response.status = 400;
          context.response.body = { error: "cursor must be a valid number" };
          return;
        }
        query = query.gt("id", cursorNum);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Database error:", error);
        context.response.status = 500;
        context.response.body = { error: "Database query failed" };
        return;
      }

      // Calculate next cursor for pagination
      let nextCursor = null;
      if (data && data.length === limitNum && data.length > 0) {
        // If we got exactly the limit, there might be more data
        nextCursor = data[data.length - 1].id;
      }

      context.response.body = {
        data,
        pagination: {
          limit: limitNum,
          cursor: cursor || null,
          nextCursor,
          hasMore: data && data.length === limitNum,
        },
      };
    } catch (err) {
      console.error("Unexpected error:", err);
      context.response.status = 500;
      context.response.body = { error: "Internal server error" };
    }
  })
  .get("/search_by_level", async (context) => {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    const queryParams = context.request.url.searchParams;
    const level = queryParams.get("level");
    const limit = queryParams.get("limit") || "100";
    const cursor = queryParams.get("cursor");

    // Validate level parameter
    if (!level) {
      context.response.status = 400;
      context.response.body = { error: "level parameter is required" };
      return;
    }

    // Convert limit to number and validate
    const limitNum = parseInt(limit as string, 10);
    if (isNaN(limitNum) || limitNum <= 0 || limitNum > 1000) {
      context.response.status = 400;
      context.response.body = {
        error: "limit must be a positive number between 1 and 1000",
      };
      return;
    }

    try {
      // Search across level_1, level_2, level_3, and level_4 columns
      // Build queries for each level column
      const levelColumns = ["level_1", "level_2", "level_3", "level_4"];
      const allQueries = levelColumns.map((col) => {
        let query = supabase
          .from("vocabulary_difficulty_levels")
          .select("*")
          .eq(col, level)
          .order("id", { ascending: true });

        // Add cursor-based pagination if cursor is provided
        if (cursor) {
          const cursorNum = parseInt(cursor, 10);
          if (!isNaN(cursorNum)) {
            query = query.gt("id", cursorNum);
          }
        }

        return query;
      });

      // Execute all queries in parallel
      const results = await Promise.all(allQueries);

      // Check for errors
      for (const result of results) {
        if (result.error) {
          console.error("Database error:", result.error);
          context.response.status = 500;
          context.response.body = { error: "Database query failed" };
          return;
        }
      }

      // Combine all results and remove duplicates (by id)
      const combinedData: any[] = [];
      const seenIds = new Set<number>();

      for (const result of results) {
        if (result.data) {
          for (const item of result.data) {
            if (!seenIds.has(item.id)) {
              seenIds.add(item.id);
              combinedData.push(item);
            }
          }
        }
      }

      // Sort combined results by id
      combinedData.sort((a, b) => a.id - b.id);

      // Apply limit and pagination
      let paginatedData = combinedData;
      if (cursor) {
        const cursorNum = parseInt(cursor, 10);
        if (!isNaN(cursorNum)) {
          paginatedData = combinedData.filter((item) => item.id > cursorNum);
        }
      }

      // Apply limit
      const limitedData = paginatedData.slice(0, limitNum);

      // Calculate next cursor for pagination
      let nextCursor = null;
      if (limitedData.length === limitNum && limitedData.length > 0) {
        // Check if there are more items after the current page
        const lastId = limitedData[limitedData.length - 1].id;
        const hasMore = paginatedData.length > limitNum;
        if (hasMore) {
          nextCursor = lastId;
        }
      }

      context.response.body = {
        data: limitedData,
        pagination: {
          limit: limitNum,
          cursor: cursor || null,
          nextCursor,
          hasMore: limitedData.length === limitNum && paginatedData.length > limitNum,
        },
      };
    } catch (err) {
      console.error("Unexpected error:", err);
      context.response.status = 500;
      context.response.body = { error: "Internal server error" };
    }
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

🚀 CORS-enabled web server listening on port ${port}
📝 API Endpoints:
   - GET  /                  → API info
   - GET  /search_by_word    → Search by word
   - GET  /search_by_level   → Search by level
   - GET  /health            → Health check

🌐 Visit: http://localhost:${port}
`);

await app.listen({ port });