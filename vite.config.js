import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    fs: {
      allow: [
        '/Users/limonene/MyProject/vrm-js/bocchi-vrm-v2/src',
        '/Users/limonene/MyProject/vrm-js/bocchi-vrm-v2/public',
      ],
    },
  },
    optimizeDeps: {
        include: ["tsparticles"]
    },
});
