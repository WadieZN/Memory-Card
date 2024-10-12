import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      minify: true,
    }),
  ],
  build: {
    minify: 'terser', 
    terserOptions: {
      compress: {
        drop_console: true,
        global_defs: {
          __REACT_DEVTOOLS_GLOBAL_HOOK__: 'undefined'
        },
      },
      mangle: true,
      format: {
        comments: false,
      },
    },
  },
});