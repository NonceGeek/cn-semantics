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
    const limit = queryParams.get("limit") || "1000";
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
      // Requirement:
      // - match: "打1", "打2", "打3"... (word + digits)
      // - NOT match: "打手" (word + non-digits)
      //
      // Supabase query builder doesn't expose a direct regex operator for column filtering,
      // so we fetch prefix matches and then filter server-side to keep only:
      // - exact word
      // - word + digits only

      const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const wordDigitsOnly = new RegExp(`^${escapeRegExp(word)}\\d+$`);

      const batchSize = Math.min(1000, Math.max(limitNum * 5, 200));
      const cursorNum = cursor ? parseInt(cursor, 10) : null;
      let scanCursor = cursorNum;

      // Collect one extra item to determine hasMore reliably.
      const collected: any[] = [];

      while (collected.length < limitNum + 1) {
        let query = supabase
          .from("vocabulary_difficulty_levels")
          .select("*")
          .ilike("word", `${word}%`)
          .order("id", { ascending: true })
          .limit(batchSize);

        if (scanCursor != null && !isNaN(scanCursor)) {
          query = query.gt("id", scanCursor);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Database error:", error);
          context.response.status = 500;
          context.response.body = { error: "Database query failed" };
          return;
        }

        if (!data || data.length === 0) break;

        // Move scan cursor forward (regardless of whether items are filtered out)
        scanCursor = data[data.length - 1].id;

        // Keep only exact match or word + digits
        for (const item of data) {
          if (item.word === word || wordDigitsOnly.test(item.word)) {
            collected.push(item);
            if (collected.length >= limitNum + 1) break;
          }
        }

        // No more rows available in this prefix range
        if (data.length < batchSize) break;
      }

      const limited = collected.slice(0, limitNum);
      const hasMore = collected.length > limitNum;
      const nextCursor = hasMore && limited.length > 0 ? limited[limited.length - 1].id : null;

      context.response.body = {
        data: limited,
        pagination: {
          limit: limitNum,
          cursor: cursor || null,
          nextCursor,
          hasMore,
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
    const limit = queryParams.get("limit") || "1000";
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
      // Use RPC function with PGroonga &@~ operator for prefix search
      // This searches across level_1, level_2, level_3, and level_4 columns
      const cursorNum = cursor ? parseInt(cursor, 10) : null;
      
      const { data, error } = await supabase.rpc('search_by_level_pgroonga', {
        search_term: level,
        cursor_id: cursorNum,
        limit_count: limitNum
      });

      if (error) {
        console.error("Database error:", error);
        context.response.status = 500;
        context.response.body = { error: "Database query failed" };
        return;
      }

      const limitedData = data || [];

      // Calculate next cursor for pagination
      let nextCursor = null;
      const hasMore = limitedData.length === limitNum;
      if (hasMore && limitedData.length > 0) {
        nextCursor = limitedData[limitedData.length - 1].id;
      }

      context.response.body = {
        data: limitedData,
        pagination: {
          limit: limitNum,
          cursor: cursor || null,
          nextCursor,
          hasMore,
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

// CORS middleware
app.use(oakCors());

// Router middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Error handling middleware
app.use(async (context, next) => {
  try {
    await next();
  } catch (err) {
    console.error("Unhandled error:", err);
    context.response.status = 500;
    context.response.body = {
      error: "Internal server error",
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
});

// 404 handler
app.use((context) => {
  context.response.status = 404;
  context.response.body = {
    error: "Not found",
    path: context.request.url.pathname,
  };
});

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
