# @kommo-crm/eslint-config

Shared ESLint configuration for Kommo projects, widgets, and open-source repositories.

> **Status: 0.x (beta, skeleton).** Package layout, build, and release pipeline are ready; rule content is being added in follow-up iterations.

## Contents

The package ships the following exports:

| Subpath                           | Purpose                                                    | Status   |
| --------------------------------- | ---------------------------------------------------------- | -------- |
| `@kommo-crm/eslint-config`        | ESLint flat-config presets (`base`, `typescript`, `react`) | skeleton |
| `@kommo-crm/eslint-config/legacy` | Legacy entry for `.eslintrc` (ESLint 8)                    | skeleton |
| `@kommo-crm/eslint-config/types`  | Global TypeScript types (`DistributiveOmit` etc.)          | skeleton |

## Installation

```bash
pnpm add -D @kommo-crm/eslint-config eslint typescript
```

`eslint` and `typescript` are peer dependencies — the package does not pull them in.

### Requirements

| Peer         | Supported range       | Notes                                                         |
| ------------ | --------------------- | ------------------------------------------------------------- |
| `eslint`     | `^8.57.0 \|\| ^9.7.0` | 8.57+ via flat config (`ESLINT_USE_FLAT_CONFIG`); 9.7+ native |
| `typescript` | `>=4.8.4 <6.1.0`      | Upper bound follows bundled `typescript-eslint`               |

These ranges are the intersection of what the bundled plugins (`typescript-eslint`,
`eslint-plugin-react`, `eslint-plugin-react-hooks`, …) actually support.

## Usage — ESLint 9 (flat config)

```js
// eslint.config.mjs
import { base, typescript, react } from '@kommo-crm/eslint-config';

export default [
  ...base(),
  ...typescript(),
  ...react(),

  // project-specific overrides
  {
    rules: {
      'no-restricted-globals': ['error', 'RegExp', 'MutationObserver'],
    },
  },
];
```

Every preset accepts an options object with rule overrides:

```js
...base({ rules: { 'no-console': 'off' } }),
```

### TypeScript types

To pull in `DistributiveOmit` and other ambient types, add the `types` subpath to your `tsconfig.json`:

```jsonc
{
  "compilerOptions": {
    "types": ["@kommo-crm/eslint-config/types"],
  },
}
```

## Usage — ESLint 8

> **⚠️ On ESLint 8, use flat config, not `.eslintrc`.** ESLint 8.57+ supports flat
> config, and it is the only reliable way to consume this package on ESLint 8.

ESLint 8.57 can load a flat config via the `ESLINT_USE_FLAT_CONFIG` flag — same
config as ESLint 9:

```js
// eslint.config.mjs
import { base, typescript, react } from '@kommo-crm/eslint-config';

export default [...base(), ...typescript(), ...react()];
```

```bash
ESLINT_USE_FLAT_CONFIG=true eslint 'src/**/*.{ts,tsx}'
```

### `.eslintrc` (legacy, deprecated)

```js
// .eslintrc.js
module.exports = {
  extends: ['@kommo-crm/eslint-config/legacy'],
};
```

> **Known limitation.** The `/legacy` entry references its plugins by name, and
> ESLint's eslintrc engine resolves them from _your_ project root — not from
> inside this package. If your dependency tree conflicts on any bundled plugin
> (commonly `prettier` / `eslint-plugin-prettier`), the package manager nests our
> copy and ESLint fails with `couldn't find the plugin "..."`. This is fragile by
> design and not reliably fixable from your side — prefer the flat config above.
> The `/legacy` entry is deprecated and will be removed in a future release.

## Development

This package lives in a [turborepo](https://turbo.build/) monorepo. Run commands from the
repository root (they fan out via turbo) or scope them to this package with
`pnpm --filter @kommo-crm/eslint-config <script>`.

```bash
pnpm install
pnpm build       # tsup → dist/ (+ copy-assets + build-legacy)
pnpm typecheck   # tsc --noEmit
pnpm lint        # eslint .
pnpm test        # node --test with tsx loader
pnpm dev         # tsup --watch
```

### Releases

Releases are cut manually by maintainers and triggered by pushing an annotated `vX.Y.Z` tag. The release workflow then runs `make verify`, publishes to npm with `pnpm publish`, and creates a GitHub Release.

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `feat!:` (breaking), etc. — enforced by commitlint locally and in CI. The maintainer uses these types to choose the `patch`/`minor`/`major` bump and to hand-curate `CHANGELOG.md`, which is the source of truth for what shipped in each version.

The full runbook lives in [`RELEASING.md`](../../RELEASING.md).

## Structure

```text
src/
├── index.ts           # public API: base, typescript, react
├── presets/
│   ├── base.ts
│   ├── typescript.ts
│   └── react.ts
└── types/
    └── global.d.ts    # DistributiveOmit
```

The custom ESLint rules consumed by these presets live in a separate package,
[`@kommo-crm/eslint-plugin`](../eslint-plugin), and are registered under the
`kommo` namespace.

`dist/legacy.cjs` (the ESLint 8 entry) is generated at build time by `scripts/build-legacy.mjs`.

Planned follow-up iterations:

1. Fill presets with rules from `core_backend/frontend/eslint.config.mjs`
2. Snapshot + RuleTester tests
3. `fsd` / `widget` presets with `import-x` pathGroups
4. A separate `@kommo-crm/stylelint-config` package

## License

MIT — see [LICENSE](./LICENSE).
