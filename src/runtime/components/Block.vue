<script setup lang="ts">
import { defineAsyncComponent, shallowRef, watchEffect } from 'vue'
import registry from '#build/block-registry'

const props = defineProps<{
  name?: string
  context?: any
}>()

interface RegistryEntry {
  component: () => Promise<any>
  conditionFactory?: (context: any) => (() => Promise<boolean> | boolean)
}

type AsyncComponent = ReturnType<typeof defineAsyncComponent>

interface MappedBlock {
  component: AsyncComponent
  conditionFactory: RegistryEntry['conditionFactory'] | null
}

const mappedBlocks = Object.entries(registry as Record<string, RegistryEntry>).reduce((accumulator, [key, value]) => {
  accumulator[key] = {
    component: defineAsyncComponent(value.component),
    conditionFactory: value.conditionFactory ?? null,
  }
  return accumulator
}, {} as Record<string, MappedBlock>)

const selectedComponent = shallowRef<AsyncComponent | null>(null)

const check = async () => {
  if (props.name && props.name in mappedBlocks) {
    const block = mappedBlocks[props.name]

    if (block.conditionFactory) {
      const conditionResult = block.conditionFactory(props.context ?? {})

      const evaluateCondition = typeof conditionResult === 'function'
        ? conditionResult
        : async () => await conditionResult

      const result = await evaluateCondition()

      if (!result) {
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
