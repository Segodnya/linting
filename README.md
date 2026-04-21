# @kommo-crm/linting

Umbrella npm package with shared linter configuration for Kommo projects, widgets, and open-source repositories.

> **Status: 0.x (beta, skeleton).** Package layout, build, and release pipeline are ready; rule content is being added in follow-up iterations.

## Contents

The package ships several subpath exports:

| Subpath                            | Purpose                                                              | Status   |
| ---------------------------------- | -------------------------------------------------------------------- | -------- |
| `@kommo-crm/linting/eslint`        | ESLint flat-config presets (`base`, `typescript`, `react`, `plugin`) | skeleton |
| `@kommo-crm/linting/eslint/legacy` | Legacy entry for `.eslintrc` (ESLint 8)                              | skeleton |
| `@kommo-crm/linting/eslint/types`  | Global TypeScript types (`DistributiveOmit` etc.)                    | skeleton |
| `@kommo-crm/linting/stylelint`     | Stylelint configuration                                              | planned  |

## Installation

```bash
yarn add -D @kommo-crm/linting eslint typescript
```

`eslint` and `typescript` are peer dependencies — the package does not pull them in.

## Usage — ESLint 9 (flat config)

```js
// eslint.config.mjs
import { base, typescript, react } from '@kommo-crm/linting/eslint';

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
    "types": ["@kommo-crm/linting/eslint/types"],
  },
}
```

## Usage — ESLint 8 (`.eslintrc`)

```js
// .eslintrc.js
module.exports = {
  extends: ['@kommo-crm/linting/eslint/legacy'],
};
```

The legacy entry is a hand-maintained CJS module. It will be deprecated once all projects migrate to flat config.

## Development

```bash
yarn install
yarn build       # tsup → dist/
yarn typecheck   # tsc --noEmit
yarn lint        # eslint .
yarn test        # node --test with tsx loader
yarn dev         # tsup --watch
```

### Releases

Releases are cut manually by maintainers and triggered by pushing an annotated `vX.Y.Z` tag. The release workflow then runs `make verify`, publishes to npm, and creates a GitHub Release.

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `feat!:` (breaking), etc. — enforced by commitlint locally and in CI. The maintainer uses these types to choose the `patch`/`minor`/`major` bump and to hand-curate `CHANGELOG.md`, which is the source of truth for what shipped in each version.

The full runbook lives in [`RELEASING.md`](./RELEASING.md).

## Structure

```text
src/
└── eslint/
    ├── index.ts           # public API: base, typescript, react, plugin
    ├── presets/
    │   ├── base.ts
    │   ├── typescript.ts
    │   └── react.ts
    ├── plugin/
    │   ├── index.ts       # ESLint.Plugin: { meta, rules }
    │   └── rules/         # custom rules live here
    ├── legacy.cjs         # ESLint 8 entry
    └── types/
        └── global.d.ts    # DistributiveOmit
```

Planned follow-up iterations:

1. Fill presets with rules from `core_backend/frontend/eslint.config.mjs`
2. Snapshot + RuleTester tests
3. `fsd` / `widget` presets with `import-x` pathGroups
4. `@kommo-crm/linting/stylelint` subpath

## License

MIT — see [LICENSE](./LICENSE).
