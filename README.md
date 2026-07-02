# Kommo linting monorepo

Shared linting configuration for Kommo projects, managed as a [pnpm](https://pnpm.io/) +
[turborepo](https://turbo.build/) monorepo so each linter ships as its own package.

## Packages

- [`@kommo-crm/eslint-config`](./packages/eslint-config) — shared ESLint flat-config presets (`base`, `typescript`, `react`).
- [`@kommo-crm/eslint-plugin`](./packages/eslint-plugin) — the custom ESLint rules those presets consume, registered under the `kommo` namespace.

More packages (e.g. a Stylelint config) will be added as separate workspaces.

## Development

```bash
pnpm install
pnpm build       # turbo build across all packages
pnpm lint        # eslint . across the repo
pnpm typecheck   # turbo typecheck
pnpm test        # turbo test
pnpm knip        # turbo knip
make verify      # full CI gate: lint + knip + typecheck + build + coverage
```

Per-package commands: `pnpm --filter @kommo-crm/eslint-config <script>`.

Commits follow [Conventional Commits](https://www.conventionalcommits.org/), enforced by commitlint
via husky and CI. See [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md) and
[`RELEASING.md`](./RELEASING.md).

## License

MIT — see [LICENSE](./LICENSE).
