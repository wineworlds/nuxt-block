<script setup lang="ts">
import { defineAsyncComponent, shallowRef, watchEffect } from 'vue'
import registry from '#build/block-registry'

const props = defineProps<{
  name?: string
  context?: any
}>()

interface RegistryEntry {
  component: () => Promise<any>
  condition?: (context: any) => any
}

type AsyncComponent = ReturnType<typeof defineAsyncComponent>

const mappedBlocks = Object.entries(registry as Record<string, RegistryEntry>).reduce((accumulator, [key, value]) => {
  accumulator[key] = {
    component: defineAsyncComponent(value.component),
    condition: value.condition ?? null,
  }
  return accumulator
}, {} as Record<string, { component: AsyncComponent; condition: RegistryEntry['condition'] | null }>)

const selectedComponent = shallowRef<AsyncComponent | null>(null)

const check = async () => {
  if (props.name && props.name in mappedBlocks) {
    const block = mappedBlocks[props.name]

    if (block.condition) {
      const conditionResult = await block.condition(props.context ?? {})
      if (!conditionResult) {
        selectedComponent.value = null
        return
      }
    }

    selectedComponent.value = block.component
  }
  else {
    selectedComponent.value = null
  }
}

await check()
watchEffect(check)
</script>

<template>
  <component :is="selectedComponent" v-if="selectedComponent" :context="context" />
  <slot v-else />
</template>
