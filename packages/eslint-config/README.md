# @kommo-crm/eslint-config

Shared ESLint configuration for Kommo projects, widgets, and open-source repositories.

> **Status: 0.x (beta, skeleton).** Package layout, build, and release pipeline are ready; rule content is being added in follow-up iterations.

## Contents

The package ships the following exports:

| Subpath                           | Purpose                                                              | Status   |
| --------------------------------- | -------------------------------------------------------------------- | -------- |
| `@kommo-crm/eslint-config`        | ESLint flat-config presets (`base`, `typescript`, `react`, `plugin`) | skeleton |
| `@kommo-crm/eslint-config/legacy` | Legacy entry for `.eslintrc` (ESLint 8)                              | skeleton |
| `@kommo-crm/eslint-config/types`  | Global TypeScript types (`DistributiveOmit` etc.)                    | skeleton |

## Installation

```bash
pnpm add -D @kommo-crm/eslint-config eslint typescript
```

`eslint` and `typescript` are peer dependencies — the package does not pull them in.

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

## Usage — ESLint 8 (`.eslintrc`)

```js
// .eslintrc.js
module.exports = {
  extends: ['@kommo-crm/eslint-config/legacy'],
};
```

The legacy entry is auto-generated from the flat-config presets on every build. It will be
deprecated once all projects migrate to flat config.

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
├── index.ts           # public API: base, typescript, react, plugin
├── presets/
│   ├── base.ts
│   ├── typescript.ts
│   └── react.ts
├── plugin/
│   ├── index.ts       # ESLint.Plugin: { meta, rules }
│   └── rules/         # custom rules live here
└── types/
    └── global.d.ts    # DistributiveOmit
```

`dist/legacy.cjs` (the ESLint 8 entry) is generated at build time by `scripts/build-legacy.mjs`.

Planned follow-up iterations:

1. Fill presets with rules from `core_backend/frontend/eslint.config.mjs`
2. Snapshot + RuleTester tests
3. `fsd` / `widget` presets with `import-x` pathGroups
4. A separate `@kommo-crm/stylelint-config` package

## License

MIT — see [LICENSE](./LICENSE).
