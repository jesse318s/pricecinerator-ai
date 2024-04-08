import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "https://jesse318s.github.io/pricecinerator-ai",
  plugins: [react()],
});
