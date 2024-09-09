import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/": "http://localhost:8000",
      "/uploads/": "http://localhost:8000",
    },
    fs: {
      allow: [
        'C:/Users/SHREYA CHAVAN/Documents/heritageIndia/node_modules',
        'C:/Users/SHREYA CHAVAN/Documents/heritageIndia/frontend'
      ]
    }
  },
});
