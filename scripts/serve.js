import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const PUBLIC_DIR = join(ROOT, 'public');
const REPORTS_DIR = join(ROOT, 'reports');
const PORT = Number(process.env.PORT ?? 5173);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
};

function resolveSafe(rootDir, urlPath) {
  const decoded = decodeURIComponent(urlPath);
  const cleaned = normalize(decoded).replace(/^([/\\])+/, '');
  const full = resolve(rootDir, cleaned);
  if (!full.startsWith(rootDir)) return null;
  return full;
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname === '/' ? '/index.html' : url.pathname;

    let rootDir = PUBLIC_DIR;
    let relative = pathname;

    if (pathname.startsWith('/reports/')) {
      rootDir = REPORTS_DIR;
      relative = pathname.slice('/reports'.length);
    }

    const filePath = resolveSafe(rootDir, relative);
    if (!filePath) {
      res.writeHead(400);
      res.end('Bad request');
      return;
    }

    const info = await stat(filePath).catch(() => null);
    if (!info || !info.isFile()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const data = await readFile(filePath);
    const type = MIME[extname(filePath)] ?? 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  } catch (err) {
    res.writeHead(500);
    res.end(`Server error: ${err.message}`);
  }
});

server.listen(PORT, () => {
  console.log(`HTML-отчёт доступен: http://localhost:${PORT}/`);
  console.log(`Отчёты отдаются по адресу: http://localhost:${PORT}/reports/<filename>`);
});