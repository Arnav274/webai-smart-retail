import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from /public
app.use(
  express.static(path.join(__dirname, 'public'), {
    etag: false,
    setHeaders: res => {
      res.set('Cache-Control', 'no-store');
    }
  })
);

// Simple health endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Fallback 404
app.use((_req, res) => {
  res.status(404).send('Not found');
});

app.listen(PORT, () => {
  console.log(`WebAI dev server running on http://localhost:${PORT}`);
});
