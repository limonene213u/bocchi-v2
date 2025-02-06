import { defineConfig, searchForWorkspaceRoot } from 'vite'
import path from 'path'

export default defineConfig({
  server: {
    fs: {
      allow: [
        // Unix系パス（Mac/Linux用）
        path.resolve('/Users/limonene/MyProject/vrm-js/bocchi-vrm-v2/src'),
        // Windowsパス（正規化済み）
        path.resolve('C:/Users/limonene/MyProject/vrm-js/bocchi-vrm-v2/public'),
        // ワークスペースルート検出（マルチOS対応）
        searchForWorkspaceRoot(process.cwd())
      ]
    }
  },
  optimizeDeps: {
    include: ["tsparticles", 'gsap']
  }
})
