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
  </div>
</template>

<script setup>
const block = ref('test-block-1')
</script>
