import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const ReactCompilerConfig = {
  /* ... */
};

export default defineConfig({
  base: "https://jesse318s.github.io/pricecinerator-ai",
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
  ],
  resolve: {
    alias: {
      stream: "stream-browserify",
      events: "events",
      buffer: "buffer",
    },
  },
});
