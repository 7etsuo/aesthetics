import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    {
      name: "trim-generated-lines",
      generateBundle(_options, bundle) {
        for (const output of Object.values(bundle)) {
          if (output.type === "chunk") {
            output.code = output.code
              .split("\n")
              .map((line) => line.replace(/^ +(?=\t)/, "").trimEnd())
              .join("\n");
          }
        }
      },
    },
  ],
  build: {
    target: "es2020",
    outDir: "assets",
    emptyOutDir: false,
    sourcemap: false,
    minify: "esbuild",
    lib: {
      entry: resolve(import.meta.dirname, "src/web/chamber-v5.js"),
      formats: ["es"],
      fileName: () => "chamber.js",
    },
    rollupOptions: {
      output: {
        codeSplitting: false,
      },
    },
  },
});
