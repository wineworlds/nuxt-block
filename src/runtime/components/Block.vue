<script setup lang="ts">
import { computed, defineAsyncComponent, toValue } from 'vue'
import registry from '#build/block-registry'

const props = defineProps<{
  name?: string
  context?: any
}>()

type ConditionEvaluator = import('vue').MaybeRefOrGetter<boolean>

interface RegistryEntry {
  component: () => Promise<any>
  conditionFactory?: (context: any) => ConditionEvaluator
}

type AsyncComponent = ReturnType<typeof defineAsyncComponent>

interface MappedBlock {
  component: AsyncComponent
  conditionFactory: RegistryEntry['conditionFactory'] | null
}

interface ResolvedBlock {
  component: AsyncComponent
  condition: ConditionEvaluator | null
}

const mappedBlocks = Object.entries(registry as Record<string, RegistryEntry>).reduce((accumulator, [key, value]) => {
  accumulator[key] = {
    component: defineAsyncComponent(value.component),
    conditionFactory: value.conditionFactory ?? null,
  }
  return accumulator
}, {} as Record<string, MappedBlock>)

const resolvedBlock = computed<ResolvedBlock | null>(() => {
  if (!props.name || !(props.name in mappedBlocks)) {
    return null
  }

  const block = mappedBlocks[props.name]
  const context = props.context ?? {}
  const condition = block.conditionFactory ? block.conditionFactory(context) : null

  return {
    component: block.component,
    condition,
  }
})

const selectedComponent = computed<AsyncComponent | null>(() => {
  const value = resolvedBlock.value

  if (!value) {
    return null
  }

  if (value.condition !== null) {
    const result = toValue(value.condition)
    if (!result) {
      return null
    }
  }

  return value.component
})
</script>

<template>
  <component :is="selectedComponent" v-if="selectedComponent" :context="context" />
  <slot v-else />
</template>
