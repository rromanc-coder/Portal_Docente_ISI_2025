import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// 🚀 Añadimos un "buildVersion" único basado en timestamp
const buildVersion = new Date().toISOString().replace(/[-:.TZ]/g, "");

export default defineConfig({
  plugins: [react()],
  root: ".",
  build: {
    outDir: "dist",
    sourcemap: false,
  },
  base: "/", // mantiene rutas correctas
  define: {
    __BUILD_VERSION__: JSON.stringify(buildVersion),
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
