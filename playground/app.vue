<template>
  <div>
    <Block :name="block">
      <div>
        Nuxt module playground!
      </div>
    </Block>

    <select v-model="block">
      <option default>
        Nothing
      </option>
      <option value="test-block-1">
        Block 1
      </option>
      <option value="test-block-2">
        Block 2
      </option>
    </select>

    <button @click="state = !state">
      Toggle condition for block 1
    </button>
  </div>
</template>

<script setup>
const block = ref('test-block-1')
const state = useState('test-block-condition', () => true)
</script>
