import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    allowedHosts: [
      "d1f1-2600-4040-e0d6-c700-1144-9db0-9b1b-69a8.ngrok-free.app",
    ],
  },
});
