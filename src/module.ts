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
  order: number
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

    const aggregatedMapping = options.blocks.reduce((accumulator, path) => {
      try {
        const mapping: Record<string, {
          component: string
          condition?: string
        } | Array<{
          component: string
          condition?: string
        }>> = JSON.parse(readFileSync(join(path, 'mapping.json'), 'utf8'))

        Object.entries(mapping).forEach(([key, rawValue]) => {
          const entries = Array.isArray(rawValue) ? rawValue : [rawValue]

          if (!accumulator[key]) {
            accumulator[key] = []
          }

          entries.forEach((value) => {
            accumulator[key].push({
              component: join(path, value.component),
              conditionPath: value.condition ? join(path, value.condition) : null,
            })
          })
        })
      }
      catch (error) {
        console.log(error)
      }

      return accumulator
    }, {} as Record<string, Array<{
      component: string
      conditionPath: string | null
    }>>)

    const blockDefinitions: BlockDefinition[] = Object.entries(aggregatedMapping).flatMap(([key, definitions]) => {
      return definitions.map((definition, index) => {
        const conditionImport = definition.conditionPath ? camelCase(`${key}-condition-${index}`) : null

        return {
          key,
          component: definition.component,
          conditionPath: definition.conditionPath,
          conditionImport,
          order: index,
        }
      })
    })

    const conditionImports = blockDefinitions
      .filter(definition => definition.conditionPath && definition.conditionImport)
      .map(definition => `import ${definition.conditionImport} from ${JSON.stringify(definition.conditionPath)}`)

    const groupedDefinitions = blockDefinitions.reduce((accumulator, definition) => {
      const group = accumulator[definition.key] || []
      group.push(definition)
      accumulator[definition.key] = group
      return accumulator
    }, {} as Record<string, BlockDefinition[]>)

    const registryEntries = Object.entries(groupedDefinitions).map(([key, definitions]) => {
      const layers = definitions
        .sort((a, b) => a.order - b.order)
        .map((definition) => {
          const condition = definition.conditionImport ? `, conditionFactory: ${definition.conditionImport}` : ''
          return `    { component: () => import(${JSON.stringify(definition.component)})${condition} },`
        })

      return [
        `  ${JSON.stringify(key)}: [`,
        ...layers,
        '  ],',
      ].join('\n')
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
