# Nuxt Block Module

This module provides a way to define blocks in Nuxt templates, allowing them to be dynamically overridden elsewhere. It is fully compatible with **Nuxt Layers**.

## ✨ Features

- Define blocks in templates and override them dynamically.
- Use a **condition** (implemented as a composable) to determine whether a component should be loaded.
- Inspired by Twig's block system, bringing similar functionality to Nuxt.
- Future improvements:
  - Support for **nested block overrides** (currently, a block can only be overridden once).
  - **Dynamic lazy loading** of composables for better performance (if feasible).

## 🚀 Installation

Install the module to your Nuxt application with one command:

```sh
npx nuxi module add @wineworlds/nuxt-block
```

That's it! You can now use Nuxt Block in your Nuxt app ✨

## 🔧 Configuration

In your `nuxt.config.ts`, register the module and specify the block directory:

```ts
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  module: ['@wineworlds/nuxt-block'],
  block: {
    blocks: [
      join(currentDir, 'blocks'),
    ],
  },
})
```

## 📂 Block Mapping

Define your block mappings in a `mapping.json` file inside the `blocks/` directory. The **condition** property is optional:

```json
{
  "logo": {
    "component": "./Logo/logo.vue",
    "condition": "./Logo/condition.ts"
  }
}
```

The specified files should also be located within the `blocks/` directory.

## 🛠 Usage

Once configured, you can use the `<Block>` component anywhere in your templates:

```vue
<Block name="logo" />
```

or provide a fallback content:

```vue
<Block name="logo">
  <NuxtImg src="/logo.png" alt="Logo" />
</Block>
```

## 🏗 Future Enhancements

- **Nested overrides**: Allow blocks to be overridden multiple times in a hierarchy.
- **Lazy loading of composables**: Improve performance by dynamically loading only required composables.

## 🤝 Contributing

Contributions are welcome! If you’d like to improve this module, feel free to submit a pull request or open an issue on GitHub.

### Steps to Contribute:
1. Fork the repository.
2. Create a new branch (`feature/new-awesome-feature`).
3. Commit your changes with a meaningful message.
4. Push to your branch and create a pull request.

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  pnpm install
  
  # Generate type stubs
  pnpm dev:prepare
  
  # Develop with the playground
  pnpm dev
  
  # Build the playground
  pnpm dev:build
  
  # Run ESLint
  pnpm lint
  
  # Run Vitest
  pnpm test
  pnpm test:watch
  
  # Release new version
  pnpm release
  ```

</details>

## 📜 License

MIT

