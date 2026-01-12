/**
 * Deno Server for Letter Project
 * A simple Oak-based web server for the "致粉丝的信" project
 * Provides API endpoints and serves static content
 */

import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

// Letter configuration - same as in script.js
const LETTER_CONFIG = {
  artistName: "尹毓恪",
  title: "致粉丝的信",
  subtitle: "A Letter For You",
  paragraphs: [
    "各位我的听众们，你们好，如果你们有缘打开这封信，说明在这个漫天盖地频率世界里，你进入到了我的世界几分钟。",
    "当然，新年快乐，不过我不只想说这个。",
    "你们还愿意打开这封信，证明你们是留下来的人，像珍珠一般镶嵌在最中心的大海里，连同我这一座小岛,都被你们映衬得闪闪发亮。",
    "就像你们写很多信给我一样，我也想在这个上一年与下一年的交界处，用一个不一样的形式，送你们一封信，诉衷心肠。",
    "大家都说音乐是天堂的声音，它的确通过一些声波，让我在偶然间感受到，在这个三维空间里，无法形容的一种存在，而我把这种存在，再通过我的频率，输送给有缘的你们，好似这一切就像一个圆，闭环了。",
    {
      type: "quote",
      content: "旋律就算再优美，词藻就算再华丽，我觉得都不足以形容我们的关系和感情，这是一种别出心裁的交互，是一场最遥远的碰触，真相大白了，这就是爱。<br><br>不是小情小爱，而是最原始的爱，这就是地球唯一的终极答案。",
    },
    '"带着爱走下去"这是我对你们的第一个祝福，它可以帮你抵御一切刀山火海，让你在无论何时的尽头都不觉遗憾。',
    '"看向远方"这是我对你们的第二个祝福，它可以让你永远前行，抵达你心中的理想之地，希望是抵抗死亡的一剂良药。',
    '"看见周围的一切"这是我对你们的第三个祝福，它可以帮你把爱输送出去，相信我，爱很简单，你只要愿意真的擦亮眼睛看到大家，爱就出现了。',
    {
      type: "quote",
      content: '而我呢？<br>"我的爱是一阵徐徐暖风，分不清何处来，也不一定吹向哪里。<br>我会带走你的味道，偷偷吹散你的坏心情，笑了就不留痕迹的去下一个地方，不会怪你，因为我们都很自由，只剩若有似无的温度，抓不住的感受，没有形状，但你却知道它一定来过。"',
    },
    "ps. 2026马上要推出的第四张专辑，也是我第一次这么大刀阔斧的操刀自己的专辑，希望大家都能从中获得一些什么，也期待新的一年与你们多多见面，安好。",
  ],
  signaturePrefix: "爱你们的",
  signatureDate: "2025.12.30",
};

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