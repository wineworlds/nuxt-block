<script lang="ts">
import { computed, defineAsyncComponent, defineComponent, h, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import registry from '#build/block-registry'

interface RegistryLayer {
  component: () => Promise<any>
  conditionFactory?: (context: any) => MaybeRefOrGetter<boolean>
}

type AsyncComponent = ReturnType<typeof defineAsyncComponent>

interface PreparedLayer {
  component: AsyncComponent
  conditionFactory: RegistryLayer['conditionFactory'] | null
}

const preparedBlocks = Object.entries(registry as Record<string, RegistryLayer[]>).reduce((accumulator, [key, layers]) => {
  accumulator[key] = layers.map((layer) => ({
    component: defineAsyncComponent(layer.component),
    conditionFactory: layer.conditionFactory ?? null,
  }))
  return accumulator
}, {} as Record<string, PreparedLayer[]>)

export default defineComponent({
  name: 'Block',
  props: {
    name: {
      type: String,
      required: false,
    },
    context: {
      type: null,
      required: false,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const resolvedLayers = computed(() => {
      if (!props.name) {
        return []
      }

      const layers = preparedBlocks[props.name]
      if (!layers) {
        return []
      }

      const context = props.context ?? {}

      return layers.map(layer => ({
        component: layer.component,
        condition: layer.conditionFactory ? layer.conditionFactory(context) : null,
      }))
    })

    return () => {
      const layers = resolvedLayers.value
      const baseSlot = slots.default ?? (() => [])
      let render = baseSlot

      for (let index = layers.length - 1; index >= 0; index -= 1) {
        const layer = layers[index]

        if (layer.condition !== null && !toValue(layer.condition)) {
          continue
        }

        const previous = render
        render = () => [
          h(layer.component, { context: props.context }, {
            default: previous,
          }),
        ]
      }

      return render()
    }
  },
})
</script>
