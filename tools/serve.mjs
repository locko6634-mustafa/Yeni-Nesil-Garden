import http from "node:http";
import fs from "node:fs";
import { realpath, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
export const DEFAULT_HOST = "127.0.0.1";
const publicDirectoryRoots = new Map([
  ["assets", path.resolve(rootDir, "assets")],
  ["media", path.resolve(rootDir, "storage", "public-media")]
]);
const publicRootFiles = new Set([
  "index.html",
  "styles.css",
  "garden-pages.css",
  "script.js",
  "robots.txt",
  "sitemap.xml",
  "hayal-bahce.html",
  "kale-bahce.html",
  "masal-bahce.html",
  "ruya-bahce.html"
]);
const cleanPageRoutes = new Map([
  ["hayal-bahce", "hayal-bahce.html"],
  ["kale-bahce", "kale-bahce.html"],
  ["masal-bahce", "masal-bahce.html"],
  ["ruya-bahce", "ruya-bahce.html"]
]);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

function notFound(res) {
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("404 Not Found");
}

function isInside(basePath, candidatePath) {
  const relativePath = path.relative(basePath, candidatePath);
  return (
    relativePath !== "" &&
    !relativePath.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relativePath)
  );
}

function resolvePublicPath(rawUrl) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(rawUrl, "http://localhost").pathname);
  } catch {
    return null;
  }

  if (pathname === "/") pathname = "/index.html";
  if (pathname.includes("\\") || pathname.includes("\0")) return null;

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0 || segments.some((segment) => segment.startsWith("."))) return null;

  if (segments.length === 1) {
    const rootFile = cleanPageRoutes.get(segments[0]) ?? segments[0];
    if (!publicRootFiles.has(rootFile)) return null;
    return { filePath: path.resolve(rootDir, rootFile), boundaryPath: rootDir, rootFile: true };
  }

  const boundaryPath = publicDirectoryRoots.get(segments[0]);
  if (!boundaryPath) return null;
  return {
    filePath: path.resolve(boundaryPath, ...segments.slice(1)),
    boundaryPath,
    rootFile: false
  };
}

async function serveRequest(req, res) {
  const target = resolvePublicPath(req.url ?? "/");
  if (!target) return notFound(res);

  try {
    const [realBoundaryPath, realFilePath] = await Promise.all([
      realpath(target.boundaryPath),
      realpath(target.filePath)
    ]);
    const fileStats = await stat(realFilePath);
    const relativeToRoot = path.relative(realBoundaryPath, realFilePath);
    const isAllowedRootFile =
      target.rootFile && !relativeToRoot.includes(path.sep) && publicRootFiles.has(relativeToRoot);

    if ((!isAllowedRootFile && !isInside(realBoundaryPath, realFilePath)) || !fileStats.isFile()) {
      return notFound(res);
    }

    const ext = path.extname(realFilePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff"
    });
    fs.createReadStream(realFilePath).pipe(res);
  } catch {
    notFound(res);
  }
}

export function createStaticServer() {
  return http.createServer((req, res) => {
    void serveRequest(req, res);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = process.argv[2] ? parseInt(process.argv[2], 10) : 8000;
  const host = process.argv[3] ?? DEFAULT_HOST;
  const server = createStaticServer();
  server.listen(port, host, () => {
    console.log(`Static server running on http://${host}:${port}`);
  });
}
