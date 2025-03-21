// frontend/vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:5000", // Proxy backend API requests
                changeOrigin: true,
                secure: false,
            },
        },
    },
});