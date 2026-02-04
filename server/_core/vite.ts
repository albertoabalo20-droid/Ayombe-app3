import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // In production build:
  // - Built server is at: dist/index.js (this file when running)
  // - Static files are at: dist/public/*
  // So from dist/index.js, public folder is at ./public
  
  const distPath = path.resolve(import.meta.dirname, "public");
  
  console.log(`[Static Files] NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`[Static Files] __dirname: ${import.meta.dirname}`);
  console.log(`[Static Files] Serving from: ${distPath}`);
  console.log(`[Static Files] Directory exists: ${fs.existsSync(distPath)}`);
  
  if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    console.log(`[Static Files] Files in directory:`, files);
  }
  
  if (!fs.existsSync(distPath)) {
    console.error(
      `[Static Files] ERROR: Could not find the build directory: ${distPath}`
    );
    console.error(`[Static Files] Make sure to run 'pnpm build' first`);
  }

  // Serve static files with proper MIME types
  app.use(express.static(distPath, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
  }));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    console.log(`[Static Files] Serving index.html from: ${indexPath}`);
    res.sendFile(indexPath);
  });
}
