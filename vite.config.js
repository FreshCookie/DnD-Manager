import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        player: "./public/player.html",
        hexagonPlayer: "./public/hexagon-player.html",
      },
    },
  },
  server: {
    host: "0.0.0.0",
    hmr: {
      protocol: "wss",
      clientPort: 443,
    },
    allowedHosts: [
      "localhost",
      ".ngrok-free.app",
      ".ngrok.io",
      ".ngrok-free.dev",
      "lara-semimature-deloise.ngrok-free.dev",
    ],
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
