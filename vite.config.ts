import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core React — most stable, cache indefinitely
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }
          // React Router
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }
          // TanStack Query
          if (id.includes('node_modules/@tanstack')) {
            return 'query';
          }
          // Radix UI — large but stable
          if (id.includes('node_modules/@radix-ui')) {
            return 'radix-ui';
          }
          // Lucide icons
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
          // Heavy utility libs rarely used
          if (id.includes('node_modules/recharts') || id.includes('node_modules/react-day-picker')) {
            return 'charts';
          }
          // Next-themes, sonner, vaul, embla, etc. — small UI utilities
          if (id.includes('node_modules/next-themes') ||
              id.includes('node_modules/sonner') ||
              id.includes('node_modules/vaul') ||
              id.includes('node_modules/embla-carousel')) {
            return 'ui-utils';
          }
        }
      }
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 800,
    minify: 'esbuild',
    target: 'es2018',
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
}));
