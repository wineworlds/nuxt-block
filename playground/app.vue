<template>
  <div>
    <div>
      <h2>Example 1</h2>

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

    <div>
      <h2>Example 2</h2>

      <Block name="checkout.review.actions">
        <div>
          Default checkout actions
        </div>
      </Block>

      <select v-model="paymentMethod">
        <option default value="">
          Default
        </option>
        <option value="acdc">
          Credit card
        </option>
        <option value="paypal">
          PayPal
        </option>
      </select>
    </div>

    <div>
      <h2>Example 3</h2>

      <div class="stack">
        <label>
          <input v-model="layer1" type="checkbox">
          Enable layer 1
        </label>
        <label>
          <input v-model="layer2" type="checkbox">
          Enable layer 2
        </label>
        <label>
          <input v-model="layer3" type="checkbox">
          Enable layer 3
        </label>
      </div>

      <Block name="test-block-3">
        <div>
          <em>Default content for block 3</em>
        </div>
      </Block>
    </div>
  </div>
</template>

<script setup>
const block = ref('test-block-1')
const state = useState('test-block-condition', () => true)
const paymentMethod = ref('')

provide('checkout-payment-method', paymentMethod)

const layer1 = useState('test-block-3-layer-1', () => true)
const layer2 = useState('test-block-3-layer-2', () => true)
const layer3 = useState('test-block-3-layer-3', () => true)
</script>
