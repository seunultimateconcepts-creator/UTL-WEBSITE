import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // ✅ Builds a second, transpiled-and-polyfilled bundle for older
    // browsers, loaded automatically via <script nomodule> fallback —
    // capable browsers still get the fast modern bundle, unchanged.
    // This is what was missing: without it, a feature like `Iterator`
    // (genuinely recent JS) ships unprotected, and any browser that
    // doesn't support it fails to even start running the bundle —
    // no error shown to the visitor, just a permanently blank page.
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})