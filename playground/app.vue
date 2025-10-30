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

      <button @click="state.value = !state.value">
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
  </div>
</template>

<script setup>
const block = ref('test-block-1')
const state = useState('test-block-condition', () => true)
const paymentMethod = ref('')

provide('checkout-payment-method', paymentMethod)
</script>
