# @kommo-crm/eslint-plugin

Custom ESLint rules for Kommo projects, widgets, and open-source repositories.

> **Status: 0.x (beta).** This package ships the custom rules that back
> [`@kommo-crm/eslint-config`](../eslint-config). The config is the intended entry
> point for most consumers; install this package directly only if you wire the
> rules into a flat config yourself.

## Contents

The package exposes an ESLint flat-config plugin object plus its rule map:

| Export        | Purpose                                                      |
| ------------- | ------------------------------------------------------------ |
| `plugin`      | `ESLint.Plugin` — `{ meta, rules }`, ready to register       |
| `rules`       | Rule map keyed by rule name                                  |
| `PLUGIN_NAME` | The namespace under which the rules are registered (`kommo`) |

### Rules

| Rule                          | Description                                                                |
| ----------------------------- | -------------------------------------------------------------------------- |
| `no-export-all`               | Disallow `export * from` syntax                                            |
| `no-incorrect-jsdoc-comments` | Disallow malformed JSDoc block comments                                    |
| `no-dynamic-imports`          | Disallow dynamic `import()` of consumer-supplied paths                     |
| `no-restricted-syntax`        | Namespaced re-export of ESLint's built-in `no-restricted-syntax` (opt-in)  |
| `no-restricted-imports`       | Namespaced re-export of ESLint's built-in `no-restricted-imports` (opt-in) |

## Installation

```bash
pnpm add -D @kommo-crm/eslint-plugin eslint typescript
```

`eslint` and `typescript` are peer dependencies — the package does not pull them in.

## Usage — ESLint 9 (flat config)

```js
// eslint.config.mjs
import { plugin, PLUGIN_NAME } from '@kommo-crm/eslint-plugin';

export default [
  {
    plugins: {
      [PLUGIN_NAME]: plugin,
    },
    rules: {
      [`${PLUGIN_NAME}/no-export-all`]: 'error',
    },
  },
];
```

Most consumers should use [`@kommo-crm/eslint-config`](../eslint-config) instead,
which registers these rules for you.

## Development

This package lives in a [turborepo](https://turbo.build/) monorepo. Run commands
from the repository root (they fan out via turbo) or scope them to this package
with `pnpm --filter @kommo-crm/eslint-plugin <script>`.

```bash
pnpm install
pnpm build       # tsup → dist/
pnpm typecheck   # tsc --noEmit
pnpm lint        # eslint .
pnpm test        # node --test with tsx loader
pnpm dev         # tsup --watch
```

## License

MIT — see [LICENSE](./LICENSE).
