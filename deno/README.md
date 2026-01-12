# Deno API Server for Letter Project

> A Deno-based API server for the "致粉丝的信" (Letter for Fans) project using Oak framework.

## 🚀 Quick Start

### Prerequisites
- Install [Deno](https://deno.land/) (v1.37 or higher)

```bash
# macOS/Linux
curl -fsSL https://deno.land/x/install/install.sh | sh

# Windows
irm https://deno.land/install.ps1 | iex
```

### Run the Server

```bash
# Navigate to the deno directory
cd deno

# Run with permissions
deno run --allow-net --allow-read main.tsx

# Or use the watch mode for development
deno run --allow-net --allow-read --watch main.tsx
```

The server will start on `http://localhost:8000`

## 📡 API Endpoints

### `GET /`
Get API information and available endpoints.

**Response:**
```json
{
  "result": "Hello, Devs for Yinyuke!",
  "message": "致粉丝的信 API Server",
  "endpoints": {
    "/": "API info",
    "/api/letter": "Get letter content",
    "/api/open": "Increment open count (POST)",
    "/api/stats": "Get statistics"
  }
}
```

### `GET /api/letter`
Get the complete letter content configuration.

**Response:**
```json
{
  "success": true,
  "data": {
    "artistName": "尹毓恪",
    "title": "致粉丝的信",
    "subtitle": "A Letter For You",
    "paragraphs": [...],
    "signaturePrefix": "爱你们的",
    "signatureDate": "2025.12.30"
  }
}
```

### `POST /api/open`
Increment the letter open counter.

**Response:**
```json
{
  "success": true,
  "count": 42,
  "message": "信件打开次数 +1"
}
```

### `GET /api/stats`
Get server statistics.

**Response:**
```json
{
  "success": true,
  "stats": {
    "openCount": 42,
    "serverStartTime": "2025-12-30T12:00:00.000Z",
    "artistName": "尹毓恪"
  }
}
```

### `GET /health`
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-30T12:00:00.000Z"
}
```

## 🧪 Testing the API

### Using cURL

```bash
# Get API info
curl http://localhost:8000/

# Get letter content
curl http://localhost:8000/api/letter

# Increment open count
curl -X POST http://localhost:8000/api/open

# Get statistics
curl http://localhost:8000/api/stats

# Health check
curl http://localhost:8000/health
```

### Using JavaScript Fetch

```javascript
// Get letter content
const response = await fetch('http://localhost:8000/api/letter');
const data = await response.json();
console.log(data);

// Increment open count
await fetch('http://localhost:8000/api/open', {
  method: 'POST'
});
```

## 🛠️ Development

### Project Structure

```
deno/
├── main.tsx          # Main server file
└── README.md         # This file
```

### Key Features

- ✅ **Oak Framework**: Express-like middleware for Deno
- ✅ **CORS Enabled**: Cross-Origin Resource Sharing for all routes
- ✅ **Error Handling**: Graceful error catching and logging
- ✅ **Request Logging**: Automatic logging of all requests with timing
- ✅ **Type Safety**: Using TypeScript with Deno

### Modifying Letter Content

Edit the `LETTER_CONFIG` object in `main.tsx`:

```typescript
const LETTER_CONFIG = {
  artistName: "尹毓恪",
  title: "致粉丝的信",
  // ... modify as needed
};
```

## 🚀 Deployment

### Deno Deploy (Recommended)

1. **Install Deno Deploy CLI**:
   ```bash
   deno install --allow-read --allow-write --allow-env --allow-net --allow-run --no-check -r -f https://deno.land/x/deploy/deployctl.ts
   ```

2. **Deploy**:
   ```bash
   deployctl deploy --project=letter-yinyuke main.tsx
   ```

3. **Get URL**: You'll receive a `.deno.dev` URL

### Deno Deploy with GitHub

1. Push code to GitHub
2. Visit [dash.deno.com](https://dash.deno.com)
3. Create new project
4. Link GitHub repository
5. Set entry point to `deno/main.tsx`
6. Deploy automatically on every push

### Custom Server

If you have a VPS with Deno installed:

```bash
# Install as a service (systemd example)
sudo nano /etc/systemd/system/letter-api.service
```

```ini
[Unit]
Description=Letter API Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/letter/deno
ExecStart=/usr/local/bin/deno run --allow-net --allow-read main.tsx
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable letter-api
sudo systemctl start letter-api
```

## 🔒 Security Notes

### Required Permissions

- `--allow-net`: Network access for HTTP server
- `--allow-read`: Read access for static files (if added)

### Environment Variables

For production, consider using environment variables:

```bash
# Set custom port
PORT=3000 deno run --allow-net --allow-read main.tsx
```

Update `main.tsx`:
```typescript
const port = parseInt(Deno.env.get("PORT") || "8000");
```

## 📊 Persistent Storage

The current implementation uses in-memory storage for the open counter, which resets on server restart.

### Option 1: Deno KV (Recommended)

```typescript
// Add to main.tsx
const kv = await Deno.openKv();

// Save open count
router.post("/api/open", async (context) => {
  const result = await kv.atomic()
    .sum(["open_count"], 1n)
    .commit();
  
  const count = await kv.get(["open_count"]);
  context.response.body = {
    success: true,
    count: Number(count.value) || 0,
  };
});
```

### Option 2: External Database

Connect to PostgreSQL, MongoDB, or any database using Deno-compatible libraries.

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

### Permission Denied

Ensure you're running with required permissions:
```bash
deno run --allow-net --allow-read main.tsx
```

## 📝 License

This API server is part of the Letter for Fans project. See main project LICENSE file.

---

**Built with** ❤️ **using Deno and Oak**

