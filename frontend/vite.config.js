import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@assets": path.resolve(import.meta.dirname, "./src/assets"),
      "@components": path.resolve(import.meta.dirname, "./src/components"),
      "@constants": path.resolve(import.meta.dirname, "./src/constants"),
      "@context": path.resolve(import.meta.dirname, "./src/context"),
      "@hooks": path.resolve(import.meta.dirname, "./src/hooks"),
      "@pages": path.resolve(import.meta.dirname, "./src/pages"),
      "@services": path.resolve(import.meta.dirname, "./src/services"),
      "@store": path.resolve(import.meta.dirname, "./src/store"),
      "@utils": path.resolve(import.meta.dirname, "./src/utils"),
    },
  },
});
