import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const SHEET_ID = '15RviumsJn4heZneTbaJj3XNs02zH0RyEn_Nv16413UA';
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

let cachedCsv = '';
let lastFetchTime = 0;

// Preload local fallback CSV if available
try {
  if (fs.existsSync('sample_sheet.csv')) {
    cachedCsv = fs.readFileSync('sample_sheet.csv', 'utf8');
  }
} catch (e) {
  console.warn('Could not read local sample_sheet.csv', e);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Google Sheet Data proxy route with caching
  app.get('/api/health-data', async (req, res) => {
    const now = Date.now();
    const force = req.query.force === 'true';

    // Cache for 30 seconds unless forced
    if (!force && cachedCsv && now - lastFetchTime < 30000) {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('X-Data-Source', 'cache');
      return res.send(cachedCsv);
    }

    try {
      const response = await fetch(SHEET_CSV_URL, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      });

      if (response.ok) {
        const text = await response.text();
        if (text && text.includes('รหัสบุคคล')) {
          cachedCsv = text;
          lastFetchTime = now;
          res.setHeader('Content-Type', 'text/csv; charset=utf-8');
          res.setHeader('X-Data-Source', 'google-sheet-live');
          return res.send(cachedCsv);
        }
      }
    } catch (err) {
      console.error('Error fetching Google Sheet:', err);
    }

    // Fallback to cached or local data
    if (cachedCsv) {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('X-Data-Source', 'local-fallback');
      return res.send(cachedCsv);
    }

    res.status(500).json({ error: 'Failed to retrieve health data' });
  });

  // Vite middleware for development vs static files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
