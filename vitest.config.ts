import { defineConfig } from "vitest/config";
import { transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    {
      name: "treat-js-as-jsx",
      async transform(code, id) {
        if (/\.js$/.test(id) && code.includes("<")) {
          return transformWithEsbuild(code, id + "?ext=.jsx", {
            loader: "jsx",
          });
        }
      },
    },
    react(),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
