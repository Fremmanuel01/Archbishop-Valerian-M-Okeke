import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    globals: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(dirname, "src"),
      // `server-only` is a Next.js sentinel that throws if imported in a
      // client bundle. In vitest we run server modules directly, so map
      // the import to a no-op shim that lets the import succeed.
      "server-only": path.resolve(dirname, "src/test/server-only-shim.ts"),
    },
  },
});
