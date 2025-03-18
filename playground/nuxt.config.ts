import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },

  compatibilityDate: '2025-03-18',

  block: {
    blocks: [
      join(currentDir, 'blocks'),
    ],
  },
})
