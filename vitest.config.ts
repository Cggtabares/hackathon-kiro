import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
  test: {
    include: ["src/**/*.test.ts", "src/**/*.property.ts"],
    coverage: {
      provider: "v8",
      include: ["src/domain/**", "src/application/**", "src/infrastructure/**"],
    },
  },
});
