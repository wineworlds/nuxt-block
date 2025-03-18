import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { camelCase } from 'scule'

import {
  addComponent,
  addImports,
  addTemplate,
  createResolver,
  defineNuxtModule,
} from 'nuxt/kit'

export interface NuxtBlockModuleOptions {
  /**
   * Path to the config.json file to resolve the blocks from the directory.
   */
  blocks: string[]
}

export default defineNuxtModule<NuxtBlockModuleOptions>({
  meta: {
    name: 'nuxt-block',
    configKey: 'block',
  },
  defaults: {
    blocks: [],
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    const blocks = options.blocks.map((path) => {
      try {
        const mapping: Record<string, {
          component: string
          condition?: string
        }> = JSON.parse(readFileSync(join(path, 'mapping.json'), 'utf8'))
        return Object.entries(mapping).map(([k, v]) => {
          const component = join(path, v.component)
          const condition = v.condition ? join(path, v.condition) : null
          const conditionName = camelCase(`${k}-condition`)

          if (condition) {
            addImports({
              name: 'default',
              as: conditionName,
              from: condition,
            })
          }

          return {
            [k]: {
              component,
              condition: condition ? conditionName : null,
            },
          }
        })
      }
      catch (error) {
        console.log(error)
        return {}
      }
    }).flat().reduce((accumulator, currentValue) => ({
      ...accumulator,
      ...currentValue,
    }), {})

    addTemplate({
      src: resolve('./runtime/components/Block.vue.template'),
      filename: 'Block.vue', // Place to .nuxt/
      // filename: resolve('./runtime/components/Block.vue'), // Place to Module
      options: {
        blocks,
      },
      write: true,
    })

    addComponent({
      filePath: join(nuxt.options.buildDir, 'Block.vue'), // Load from .nuxt/Block.vue
      // filePath: resolve('./runtime/components/Block.vue'), // Load from Module
      name: 'Block',
    })
  },
})
