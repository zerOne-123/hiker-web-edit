import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { features } from "monaco-editor/esm/metadata.js";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: "use-features",
      resolveId(id) {
        if (id === "use-features") {
          return id; // 标记这是一个虚拟模块
        }
      },
      load(id) {
        if (id === "use-features") {
          const prefix = "monaco-editor/esm/";
          const autoImport = features.map((feat) => {
            let entry =
              Object.prototype.toString.call(feat.entry) === "[object String]"
                ? [feat.entry]
                : feat.entry;
            entry = entry.map((val) => `import '${prefix}${val}'`);
            return `// ${feat.label}
          ${entry.join("\n")}`;
          });
          return autoImport.join("\n");
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    reportCompressedSize: false,
    outDir: "hiker-web-edit",
  },
});
