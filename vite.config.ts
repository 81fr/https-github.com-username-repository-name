import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/arabic-resignation-form/",
  build: {
    rollupOptions: {
      external: [
        '@radix-ui/react-tooltip',
        '@radix-ui/react-checkbox',
        '@radix-ui/react-label',
        '@radix-ui/react-popover',
        '@radix-ui/react-separator',
        '@radix-ui/react-tabs',
        '@radix-ui/react-toast'
      ]
    }
  }
}));
