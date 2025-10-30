const PAYMENT_METHOD_KEY = 'checkout-payment-method'

export default function () {
  const paymentMethod = inject(PAYMENT_METHOD_KEY, ref(''))

  return () => {
    const method = toValue(paymentMethod)
    return method === 'paypal' || method === 'acdc'
  }
}
