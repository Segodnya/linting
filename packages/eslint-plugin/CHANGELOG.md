# Changelog

All notable changes to this package are documented in this file. Format follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Corrected peer-dependency ranges that were declared as `eslint: ">=9.0.0"` / `typescript: ">=5.0.0"` without matching what the plugin supports. They are now `eslint: "^8.57.0 || ^9.7.0"` and `typescript: ">=4.8.4 <6.1.0"`, consistent with `@kommo-crm/eslint-config`, so bundling the two no longer produces a peer conflict on ESLint 8.

## [0.1.0] 16/07/26

### Added

- Initial release of `@kommo-crm/eslint-plugin` — the custom ESLint rules for Kommo CRM, extracted from `@kommo-crm/eslint-config` into a standalone plugin package.
- Custom rules: `no-export-all`, `no-incorrect-jsdoc-comments`, `no-dynamic-imports`, plus thin re-exports of the built-in `no-restricted-syntax` and `no-restricted-imports`.
- `plugin` (`ESLint.Plugin`) and `PLUGIN_NAME` exports for consumption by `@kommo-crm/eslint-config`.
