import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
// import monacoEditorEsmPlugin from "vite-plugin-monaco-editor-esm";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // monacoEditorEsmPlugin({
    //   languageWorkers: ["editorWorkerService", "typescript"],
    // }),
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
