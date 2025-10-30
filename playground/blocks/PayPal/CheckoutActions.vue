<template>
  <component v-if="selectedComponent" :is="selectedComponent" />
</template>

<script setup lang="ts">
import AcdcCheckoutAction from './AcdcCheckoutAction.vue'
import PayPalCheckoutAction from './PayPalCheckoutAction.vue'

const PAYMENT_METHOD_KEY = 'checkout-payment-method'

const paymentMethod = inject(PAYMENT_METHOD_KEY, ref(''))

const selectedComponent = computed(() => {
  switch (toValue(paymentMethod)) {
    case 'paypal':
      return PayPalCheckoutAction
    case 'acdc':
      return AcdcCheckoutAction
    default:
      return null
  }
})
</script>
