import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import path from "path"
import WindiCSS from "vite-plugin-windicss"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), WindiCSS()],
  base: "/assiut-chess/",
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "/src")
      }
    ]
  },
  server: {
    fs: {
      allow: [".."]
    }
  }
})
