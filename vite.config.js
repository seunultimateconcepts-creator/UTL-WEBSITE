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
  build: {
    // ✅ The legacy plugin only splits browsers by ES-module support,
    // not by every individual feature — a browser can support modules
    // fine while still lacking something as recent as `Iterator`,
    // landing it on the "modern" bundle anyway. Explicitly targeting
    // es2020 tells esbuild not to rely on anything newer than that in
    // the main bundle at all, closing that specific gap directly.
    target: 'es2020',
  },
})