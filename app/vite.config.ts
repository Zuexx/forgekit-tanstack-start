import { defineConfig } from 'vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'

import stylex from '@stylexjs/unplugin'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    stylex.vite({ useCSSLayers: true, devMode: 'full' }),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
