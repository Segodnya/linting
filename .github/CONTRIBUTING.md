# How to contribute

We want to make it as easy and transparent as possible to contribute. If we are missing anything or can make the process easier in any way, [please let us know](mailto:npm@kommo.com).

## Code of conduct

We expect all participants to read our [code of conduct](./CODE_OF_CONDUCT.md) to understand which actions are and aren’t tolerated.

## Open development

`@kommo-crm/eslint-config` is the ESLint configuration package in the Kommo linting monorepo (more linters, e.g. a Stylelint config, will ship as separate packages). All work happens directly on GitHub. Both team members and external contributors send pull requests which go through the same review process.

## Semantic versioning

`@kommo-crm/eslint-config` follows semantic versioning, with a special policy for the `0.x` beta phase (see [Versioning during 0.x](#versioning-during-0x) below). After `1.0.0`, we release [patch versions for bug fixes](#patch), [minor versions for new features](#minor), and [major versions for breaking changes](#major). When we make breaking changes, we introduce deprecation warnings in a minor version along with the upgrade path so that our users learn about the upcoming changes and migrate their code in advance.

The following sections detail what kinds of changes result in each of major, minor, and patch version bumps **after 1.0.0**:

### Major

- Breaking change to the public API of a preset (signature, return shape)
- Removal of a preset or a public subpath export
- Removal of a built-in rule from a preset
- Bumping the minimum supported version of a peer dependency (`eslint`, `typescript`)
- Bumping the minimum supported Node.js version
- Breaking change to the public TypeScript types (`@kommo-crm/eslint-config/types`)
- Renaming or removing a preset option

### Minor

- New preset (e.g. `fsd`, `widget`, `stylelint`)
- New rule added to an existing preset
- New option for a preset
- Deprecation of a preset, rule, or option (ahead of its removal in the next major version)
- Non-breaking bump of a bundled plugin (`@typescript-eslint/*`, `eslint-plugin-react`, …) that does not change reported violations on existing fixtures

### Patch

- Bug fix in a custom rule under `packages/eslint-plugin/src/rules/`
- Loosening a rule severity (e.g. `error` → `warn`)
- Documentation, README, or CHANGELOG fixes
- Internal refactor that does not change the rule output (verified by snapshot tests)
- Non-breaking bump of a bundled plugin patch version
- Build/tooling change that does not affect `dist/`

### Versioning during 0.x

Until `1.0.0` the package is in beta and is being filled with rules from our core projects at a high cadence. To keep that flow practical, **breaking changes are allowed in minor releases during 0.x**, including:

- adding a new rule with `error` severity,
- tightening an existing rule from `warn` to `error`,
- changing a preset’s public API.

Bump policy in 0.x:

- `0.x.0` — new rules (`warn` or `error`), new presets, API changes (including breaking).
- `0.x.y` — bugfix, severity decrease (`error` → `warn`).

`1.0.0` is cut once the ESLint part stabilises — when the main consumers are migrated and `@kommo-crm/eslint-config` carries the full ruleset. Adding sibling packages such as `@kommo-crm/stylelint-config` after `1.0.0` does not affect ESLint consumers and ships independently.

> If you’re unsure which bump applies, prefer the more conservative commit type (`fix:` over `feat:`) — a reviewer will adjust it before merge. The maintainer derives the version bump from the Conventional Commits accumulated since the last tag: `feat:` → minor, `fix:`/`perf:` → patch, `feat!:` or a `BREAKING CHANGE:` footer → major (during 0.x — minor).

## Branch organization

We do our best to keep `main` releasable at all times, with work for major releases happening in separate branches. [Breaking changes](./CONTRIBUTING.md#major) should never be merged directly to `main`. Otherwise, if you send a pull request please do it against the `main` branch. Continue reading for more about pull requests and breaking changes.

## Bugs

### Where to find known issues

We track all of our issues in GitHub and [bugs](https://github.com/kommo-crm/linting/labels/Bug) are labeled accordingly. If you are planning to work on an issue, avoid ones which already have an assignee or where someone has commented within the last two weeks they are working on it. We will do our best to communicate when an issue is being worked on internally.

### Reporting new issues

To reduce duplicates, look through open issues before filing one. When [opening an issue](https://github.com/kommo-crm/linting/issues/new?template=ISSUE.yml), complete as much of the template as possible. The best way to get your bug fixed is to provide a minimal reproduction — ideally a snippet of source plus the relevant fragment of `eslint.config.mjs` (or `.eslintrc`) and the exact ESLint output.

## Feature requests

Before requesting a feature, search the [existing feature requests](https://github.com/kommo-crm/linting/issues). You can [👍 upvote](https://help.github.com/articles/about-conversations-on-github/) feature requests to help our team set priorities. If a feature request is closed, you can still upvote! A closed feature request means it’s not something we’re currently working on, but we take all your input into account when planning what to work on next.

Otherwise, [request a feature](https://github.com/kommo-crm/linting/issues/new?labels=Feature+request&template=FEATURE_REQUEST.yml).

## Proposing a change

If you intend to add a new preset, change the public API of an existing preset, add or remove a rule from a preset, or make any other non-trivial changes, [we recommend filing an issue](https://github.com/kommo-crm/linting/issues/new?labels=Feature+request&template=FEATURE_REQUEST.yml). This lets us all discuss and reach an agreement on the proposal before you put in significant time and effort.

If you’re only fixing a bug, it’s okay to submit a pull request right away but we still recommend you file an issue detailing what you’re fixing. This is helpful in case we don’t accept that specific fix but want to keep track of the issue.

## Requirements

- Node.js 22+ (see `.nvmrc`) — required by `c8`-based coverage thresholds.
- pnpm 9.x (see `packageManager` in `package.json`) — enable via `corepack enable`.

## Quick start

```bash
nvm use
corepack enable
pnpm install
pnpm build
pnpm test
```

## Workflow

1. Fork this repository and branch off `main`: `feature/<issue-id>` or `hotfix/<issue-id>`.
2. Make your changes.
3. Use [Conventional Commits](https://www.conventionalcommits.org/) for every commit message:
   - `fix: …` — bug fix, severity downgrade
   - `feat: …` — new rule, new preset, new option
   - `feat!: …` or `BREAKING CHANGE:` footer — breaking change after 1.0.0
   - `docs:`, `chore:`, `refactor:`, `test:`, `build:`, `ci:` — non-release-bumping changes
4. Make sure CI is green (`lint`, `typecheck`, `build`, `test`, `knip`, `commitlint`).

The `commitlint` CI job validates that every commit in your PR follows Conventional Commits — a husky `commit-msg` hook enforces it locally as well. Commits that don’t match a release-bumping type (`feat`/`fix`/`perf`) are still allowed; they simply don’t influence the next version bump and typically aren’t called out in `CHANGELOG.md`.

## Scripts

All scripts run from the repository root.

| Script                                                        | Purpose                                         |
| ------------------------------------------------------------- | ----------------------------------------------- |
| `pnpm build`                                                  | Build all packages via turbo (tsup + assets)    |
| `pnpm dev`                                                    | tsup watch mode for the eslint-config package   |
| `pnpm lint`                                                   | Self-lint the repo with our own ESLint config   |
| `pnpm lint:fix`                                               | Same, with autofix                              |
| `pnpm typecheck`                                              | `tsc --noEmit` (via turbo)                      |
| `pnpm test`                                                   | Run tests via `node --test` + tsx (via turbo)   |
| `pnpm test:coverage`                                          | Same, under `c8` with 90/85/90 thresholds       |
| `pnpm --filter @kommo-crm/eslint-config test:snapshot:update` | Regenerate `*.errors.json` baseline             |
| `pnpm format`                                                 | Prettier across the repository                  |
| `pnpm commitlint`                                             | Validate commit messages (used by husky and CI) |

## Updating lint snapshots

`packages/eslint-config/__tests__/fixtures/invalid.js.errors.json` and `invalid.tsx.errors.json` are ground-truth snapshots of what ESLint reports when the full preset (`base + typescript + react`) runs against the broad fixtures ported from our core projects. `snapshot.test.ts` fails on any diff.

Regenerate them whenever you intentionally change a preset or bump a plugin version:

```bash
pnpm --filter @kommo-crm/eslint-config test:snapshot:update
```

Review the diff, commit it together with the preset change.

## Sending a pull request

We’ll review your pull request and either merge it, request changes to it, or close it with an explanation. We’ll do our best to provide updates and feedback throughout the process.

**Before submitting a pull request**, please:

1. Fork the repository and create your branch from `main`.
2. Run `pnpm install` in the repository root.
3. Make sure your code lints and types check: `pnpm lint && pnpm typecheck`.
4. Make sure tests pass, including snapshots: `pnpm test`.
5. Make sure your commits follow [Conventional Commits](https://www.conventionalcommits.org/) — husky and CI will reject anything else.

## Releasing

Releases are cut manually by maintainers. The full runbook lives in [`RELEASING.md`](../RELEASING.md). In short:

1. Maintainer updates `CHANGELOG.md` (`[Unreleased]` → `[X.Y.Z] - YYYY-MM-DD`), stages it, runs `npm version patch|minor|major --tag-version-prefix "$PKG@v"` in the target package (`PKG` being its npm name, so the tag is `<package>@vX.Y.Z`), and pushes the resulting commit and tag with `git push --follow-tags`.
2. The `Release` workflow (`.github/workflows/release.yml`) triggers on the `<package>@vX.Y.Z` tag, runs `make verify`, publishes the package to npm (requires the `NPM_TOKEN` secret — must be an npm **Automation** token), and creates a GitHub Release with auto-generated notes.

## Breaking changes

If your pull request contains breaking changes, please target the `next` branch for the next major release. Also, open a pull request against `main` that introduces the deprecation warnings and upgrade path.

If you are unsure if the changes are considered breaking or not, open your pull request against the `main` branch and let us know. We understand it can be uncomfortable asking for help and this is why we have a [code of conduct](./CODE_OF_CONDUCT.md) to ensure the community is positive, encouraging, and helpful.
