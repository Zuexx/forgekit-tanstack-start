import { defineConfig } from 'vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'

import stylex from '@stylexjs/unplugin'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    stylex.vite({
      useCSSLayers: true,
      devMode: 'full',
      unstable_moduleResolution: {
        type: 'commonJS',
        rootDir: import.meta.dirname,
      },
      // StyleX's babel plugin resolves theme-file imports (defineVars/create
      // consumers) itself, independent of Vite's bundler resolution — so the
      // `#/*` (package.json "imports") alias used elsewhere in this repo
      // needs to be spelled out here too, or any aliased import inside a
      // `stylex.create()` call site fails to resolve.
      aliases: {
        '#/*': ['/ROOT/src/*'],
      },
    }),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
