import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import webfontDownload from "vite-plugin-webfont-dl";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    webfontDownload(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    // Remove console.log e debugger em produção
    drop: mode === "production" ? ["console", "debugger"] : [],
  },
  build: {
    minify: "esbuild",
    emptyOutDir: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      maxParallelFileOps: 2,
      output: {
        manualChunks: (id) => {
          if (!id.includes("node_modules")) return;
          if (id.includes("/framer-motion/"))   return "framer";
          if (id.includes("/@radix-ui/"))       return "radix";
          if (id.includes("/react-dom/") ||
              id.includes("/react-router") ||
              id.includes("/react/"))            return "react-core";
          if (id.includes("/@supabase/"))        return "supabase";
          return "vendor"; // tudo mais vai para vendor
        },
      },
    },
  },
}));
