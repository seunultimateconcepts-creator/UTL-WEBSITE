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
    legacy({
      // ✅ Was ['defaults', 'not IE 11']. "defaults" resolves to
      // "> 0.5%, last 2 versions, not dead" — which EXCLUDES Chrome
      // 109, the newest Chrome that Windows 7 can run (it's past
      // browserslist's "dead" cutoff). So the legacy bundle wasn't
      // actually being built for the machines that needed it.
      // Naming the floor explicitly removes that guesswork.
      targets: ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'],
      // ✅ The legacy plugin splits browsers purely by ES-module
      // support. Chrome 109 supports modules fine, so it loads the
      // MODERN bundle — and therefore never benefits from the legacy
      // polyfills at all. modernPolyfills injects the needed core-js
      // polyfills into the modern bundle too, which is what actually
      // covers "supports modules but lacks a recent built-in".
      modernPolyfills: true,
    }),
  ],
  // ⚠️ Note: build.target is deliberately NOT set here. plugin-legacy
  // overrides it and logs a warning when you do ("plugin-legacy
  // overrode 'build.target'"), so the es2020 value that used to sit
  // here was silently doing nothing. Browser support is controlled by
  // the plugin's `targets` above instead.
})