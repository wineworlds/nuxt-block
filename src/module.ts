import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { camelCase } from 'scule'

import {
  addComponent,
  addTemplate,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'

export interface NuxtBlockModuleOptions {
  /**
   * Path to the config.json file to resolve the blocks from the directory.
   */
  blocks: string[]
}

interface BlockDefinition {
  key: string
  component: string
  conditionPath: string | null
  conditionImport: string | null
}

export default defineNuxtModule<NuxtBlockModuleOptions>({
  meta: {
    name: 'nuxt-block',
    configKey: 'block',
  },
  defaults: {
    blocks: [],
  },
  async setup(options) {
    const { resolve } = createResolver(import.meta.url)

    const blockDefinitions: BlockDefinition[] = options.blocks.flatMap((path) => {
      try {
        const mapping: Record<string, {
          component: string
          condition?: string
        }> = JSON.parse(readFileSync(join(path, 'mapping.json'), 'utf8'))

        return Object.entries(mapping).map(([key, value]) => {
          const component = join(path, value.component)
          const conditionPath = value.condition ? join(path, value.condition) : null

          return {
            key,
            component,
            conditionPath,
            conditionImport: conditionPath ? camelCase(`${key}-condition`) : null,
          }
        })
      }
      catch (error) {
        console.log(error)
        return []
      }
    })

    const conditionImports = blockDefinitions
      .filter(definition => definition.conditionPath && definition.conditionImport)
      .map(definition => `import ${definition.conditionImport} from ${JSON.stringify(definition.conditionPath)}`)

    const registryEntries = blockDefinitions.map((definition) => {
      const condition = definition.conditionImport ? `, condition: ${definition.conditionImport}` : ''
      return `  ${JSON.stringify(definition.key)}: { component: () => import(${JSON.stringify(definition.component)})${condition} },`
    })

    addTemplate({
      filename: 'block-registry.mjs',
      getContents: () => [
        ...conditionImports,
        conditionImports.length ? '' : null,
        'export default {',
        ...registryEntries,
        '}',
      ].filter(Boolean).join('\n'),
      write: true,
    })

    addComponent({
      filePath: resolve('./runtime/components/Block.vue'),
      name: 'Block',
    })
  },
})
