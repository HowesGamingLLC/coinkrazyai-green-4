import { defineConfig, Plugin } from "vite";
// Disabled react-swc plugin to use TypeScript JSX compilation instead
// import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";
import { setupSocketIO } from "./server/socket";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: true,
    fs: {
      allow: [".", "./client", "./shared"],

    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [expressPlugin()],
  esbuild: {
    loader: "tsx",
    include: /src\/.*\.tsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".ts": "tsx",
        ".tsx": "tsx",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();

      if (server.httpServer) {
        setupSocketIO(server.httpServer as any);
      }

      // Add middleware that runs BEFORE SPA handler to intercept /api routes
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          console.log(`[ViteProxy] Intercepting: ${req.url}`);
          app(req, res);
        } else {
          next();
        }
      });
    },
  };
}
