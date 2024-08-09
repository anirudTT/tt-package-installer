import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Make Vite accessible from the host machine
    port: 3000, // The port Vite will use
    proxy: {
      "/api": {
        target: "http://tt-installer-backend:4000", // Proxy API requests to the backend
        changeOrigin: true,
        rewrite: (path) => path, // Preserve the `/api` prefix
      },
    },
  },
});
