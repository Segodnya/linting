# Changelog

All notable changes to this package are documented in this file. Format follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial release of `@kommo-crm/eslint-config` — shared ESLint flat-config for Kommo CRM, built with tsup and shipped from a turborepo monorepo under `packages/eslint-config`.
- `@kommo-crm/eslint-config` (root export) — flat-config presets (`base`, `typescript`, `react`). The custom rules are provided by `@kommo-crm/eslint-plugin` (registered under the `kommo` namespace) and are not re-exported from this package.
- `@kommo-crm/eslint-config/legacy` — ESLint 8 (`.eslintrc`) entry.
- `@kommo-crm/eslint-config/types` — ambient TypeScript types.
