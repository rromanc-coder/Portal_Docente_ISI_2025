import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Configuración para despliegue en Nginx (rutas relativas)
export default defineConfig({
  plugins: [react()],
  base: "./", // ← importante para rutas relativas (evita /monitor mostrando el home)
  build: {
    outDir: "dist",
  },
});
