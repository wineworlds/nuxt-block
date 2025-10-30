export default function () {
  const state = useState('test-block-condition', () => true)
  return computed(() => toValue(state))
}
