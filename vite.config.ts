import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
    {
      name: "mock-module",
      enforce: "pre",
      resolveId(id) {
        if (id === "module") {
          return "virtual:module";
        }
      },
      load(id) {
        if (id === "virtual:module") {
          return "export const createRequire = () => () => {}; export default { createRequire };";
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
