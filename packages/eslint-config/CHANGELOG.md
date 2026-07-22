# Changelog

All notable changes to this package are documented in this file. Format follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Peer-dependency ranges now match what the bundled plugins actually support. The previous `eslint: ">=9.0.0"` contradicted bundled `typescript-eslint@7` and `eslint-plugin-react-hooks@4` (both capped at ESLint 8), so npm consumers hit a hard `ERESOLVE` on every ESLint version. `eslint` is now `^8.57.0 || ^9.7.0`, and `typescript` is `>=4.8.4 <6.1.0` — the previous unbounded `>=5.0.0` allowed unsupported TypeScript (e.g. 7.x), which crashed ESLint at startup.

### Changed

- Bumped `typescript-eslint` 7.17.0 → 8.64.0 (ESLint 9 support). This renames `@typescript-eslint/ban-types` → `no-empty-object-type` and switches to the type-aware `@typescript-eslint/no-unused-expressions`.
- Bumped `eslint-plugin-react-hooks` 4.6.2 → 5.2.0 and `eslint-plugin-react` 7.35.0 → 7.37.5 for ESLint 9 / `typescript-eslint@8` parser compatibility (restores `react/boolean-prop-naming` on typed props).
- `react` preset: `react/boolean-prop-naming` now accepts `asChild` — the Radix/Slot escape hatch prop, whose name is dictated by the pattern ([#6](https://github.com/kommo-crm/linting/issues/6)).

### Deprecated

- The `./legacy` (`.eslintrc`) entry is deprecated and will be removed in a future release. Its plugins are resolved by name from the consumer's project root, which breaks whenever the consumer's tree conflicts on a bundled plugin (e.g. `eslint-plugin-prettier`). ESLint 8.57+ users should use flat config via `ESLINT_USE_FLAT_CONFIG` — see the README.

## [0.1.0] 16/07/26

### Added

- Initial release of `@kommo-crm/eslint-config` — shared ESLint flat-config for Kommo CRM, built with tsup and shipped from a turborepo monorepo under `packages/eslint-config`.
- `@kommo-crm/eslint-config` (root export) — flat-config presets (`base`, `typescript`, `react`). The custom rules are provided by `@kommo-crm/eslint-plugin` (registered under the `kommo` namespace) and are not re-exported from this package.
- `@kommo-crm/eslint-config/legacy` — ESLint 8 (`.eslintrc`) entry.
- `@kommo-crm/eslint-config/types` — ambient TypeScript types.
