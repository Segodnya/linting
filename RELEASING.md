# Releasing

Step-by-step runbook for cutting a new version of any publishable package in this monorepo to the public npm registry. The push of an annotated tag is the only thing the publish workflow needs — everything else is hygiene.

Each package is versioned and released **independently**: it owns its `package.json`, `CHANGELOG.md`, and tag. The publishable packages today are `@kommo-crm/eslint-config` and `@kommo-crm/eslint-plugin`, and the same flow applies to every workspace under `packages/`. Note that `@kommo-crm/eslint-config` depends on `@kommo-crm/eslint-plugin` (via `workspace:*`), so when a config change also needs new plugin behaviour, release the plugin first and bump the config's dependency to the published version.

The commands below use a `PKG` variable so they work for whichever package you are releasing — set it once per session (the directory name under `packages/`):

```sh
PKG=eslint-config
```

The package version lives in `packages/$PKG/package.json` (not the workspace root), so version bumps run from that directory. Tags are namespaced per package as `<package>@vX.Y.Z` (e.g. `eslint-config@v0.1.1`); the release workflow resolves which package to publish from the tag prefix, so each package releases on its own cadence from shared history. The workflow validates the tag against a strict contract — the `<package>` part must be the kebab-case directory name under `packages/` (no `@`), and the version must be semver — so a malformed tag fails fast instead of publishing the wrong thing.

## Prerequisites (one-time)

- A trusted publisher registered on npm for the package — see below.
- An npm account with publish rights for the `@kommo-crm` scope (only for the manual fallback and for bootstrapping brand-new packages).
- The CI workflow (`.github/workflows/ci.yml`) is green on `main`.
- The release workflow (`.github/workflows/release.yml`) exists and is enabled.

### Trusted publisher setup (one-time per package)

Publishing runs on **trusted publishing (OIDC)**: the workflow mints a short-lived OIDC token, npm exchanges it for an ephemeral publish token, and the package goes out. There is no `NPM_TOKEN` secret and no long-lived credential to leak or rotate. As a bonus, npm generates [provenance attestations](https://docs.npmjs.com/generating-provenance-statements/) automatically, so published versions carry a "Built and signed on GitHub Actions" badge.

Register the publisher at npmjs.com → the package → **Settings** → **Trusted Publisher**:

| Field             | Value                                                  |
| ----------------- | ------------------------------------------------------ |
| Publisher         | GitHub Actions                                         |
| Organization      | `kommo-crm`                                            |
| Repository        | `linting`                                              |
| Workflow filename | `release.yml` — filename only, no path, case-sensitive |
| Environment       | leave empty                                            |

npm does **not** validate this on save, so a typo only surfaces as a `404` at publish time.

> **A brand-new package cannot bootstrap itself.** The Trusted Publisher settings page only appears once the package exists on the registry, so the very first version of a new package has to be published by hand via the [manual fallback](#manual-fallback) — then register the publisher and every subsequent release is credential-free. This is a known npm limitation, tracked in [npm/cli#8544](https://github.com/npm/cli/issues/8544).

## Routine release (every version)

1. **Verify `main` is clean.** All PRs merged, CI green, no untracked changes locally:

   ```sh
   git checkout main
   git pull --ff-only
   git status
   ```

2. **Update `CHANGELOG.md` first.** Move entries from `## [Unreleased]` under a new `## [X.Y.Z] - YYYY-MM-DD` section, then stage the file:

   ```sh
   $EDITOR CHANGELOG.md
   git add CHANGELOG.md
   ```

3. **Bump the version.** Run `npm version` from the package directory with the package-namespaced
   tag prefix — it rewrites `packages/$PKG/package.json`, folds the staged `CHANGELOG.md` into the
   same commit, and tags `<package>@vX.Y.Z` locally:

   ```sh
   cd "packages/$PKG"
   npm version patch --tag-version-prefix "$PKG@v"   # 0.1.0 → 0.1.1 (bug fix)
   npm version minor --tag-version-prefix "$PKG@v"   # 0.1.x → 0.2.0 (additive feature)
   npm version major --tag-version-prefix "$PKG@v"   # 0.x.y → 1.0.0 (breaking change)
   cd ../..
   ```

   > Set the prefix on every bump (or persist it in `packages/$PKG/.npmrc` with the literal package
   > name, e.g. `tag-version-prefix=eslint-config@v`) — without it `npm version` creates a bare
   > `vX.Y.Z` tag that the release workflow no longer listens to.
   > **Why this order matters.** `npm version` creates the bump commit and tag in one shot. If you bump first and amend the CHANGELOG afterwards, the tag will point at the original (now-orphaned) commit and CI will publish a tarball that does not match the tagged tree.

4. **Push commit + tag together.** `--follow-tags` ensures the new tag is shipped, which triggers the release workflow:

   ```sh
   git push --follow-tags
   ```

5. **Watch the release workflow.** GitHub → Actions → "Release". On success it resolves the package from the tag, runs `make verify`, publishes to npm, and creates a GitHub Release with auto-generated notes. Verify the new version at `https://www.npmjs.com/package/@kommo-crm/$PKG` before announcing.

### If you forgot to update CHANGELOG before `npm version`

If you bumped the version and only then realised CHANGELOG was not updated, recover by amending and forcing the tag onto the new commit:

```sh
$EDITOR CHANGELOG.md
git add CHANGELOG.md
git commit --amend --no-edit
git tag -f "$PKG@v$(node -p "require('./packages/$PKG/package.json').version")" HEAD
git push --follow-tags --force-with-lease
```

Prefer the routine order (CHANGELOG → stage → `npm version`) — it avoids this dance entirely.

## Rolling back a bad release

npm versions are immutable — you cannot re-publish the same `X.Y.Z` (and even unpublishing within 72h carries restrictions). Two options:

- **Hot-fix forward (preferred).** Bump a patch version with the fix and ship through the normal flow. Existing installs auto-update on the next dependency upgrade.

- **Deprecate the bad version.** `npm deprecate @kommo-crm/$PKG@X.Y.Z "do not use — see X.Y.Z+1"` makes installs print a warning. Users on the bad version still keep working until they upgrade.

Avoid `git tag -d` + force-push gymnastics on a public tag. The tag is the audit trail — do not rewrite it once it has been pushed.

## Manual fallback

Two cases need this: the release workflow is unavailable (CI down), or you are publishing the **first ever** version of a new package, which trusted publishing cannot do.

```sh
npm login # interactive, 2FA
pnpm install --frozen-lockfile
make verify
pnpm publish --filter "@kommo-crm/$PKG" --access public --no-git-checks --otp <YOUR_OTP>
```

Publish from `pnpm`, not `npm` — `pnpm` rewrites `workspace:*` dependencies to real versions when packing, whereas `npm` would ship the literal string and break installs.

`--no-git-checks` is required, not optional: this path is normally run from a checked-out release tag, and `pnpm publish` otherwise refuses on a detached `HEAD` ("branch is not on main") before it ever reaches the registry.

Use only as an emergency path; CI publishing is the source of truth. After bootstrapping a new package this way, register its [trusted publisher](#trusted-publisher-setup-one-time-per-package) so later releases go through CI.

## What can go wrong

- **`npm publish` rejects with `404 Not Found`** — almost always authentication, not a missing package: npm answers `404` rather than `403` so it does not leak which packages exist. Check, in order: the package has a trusted publisher registered; the workflow filename there matches `release.yml` byte for byte; the job still declares `id-token: write`; `repository.url` in `packages/$PKG/package.json` still points at this repo; no `registry-url:` crept back into a `setup-node` step (see below).
- **The `setup-node` step in `.github/actions/setup/action.yml` regained `registry-url:`** — this silently breaks trusted publishing. `registry-url` writes an `.npmrc` line `//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}`, and npm does **not** drop that line when the variable is unset: it sends `Authorization: Bearer ${NODE_AUTH_TOKEN}` verbatim, so the OIDC exchange never runs and the registry answers `404`. npmjs.org is the default registry, so publishing needs no `.npmrc` at all — leave `registry-url` off.
- **`npm publish` rejects with `EOTP`** — the OIDC exchange did not happen and npm fell back to interactive auth. Most likely `.nvmrc` was downgraded below Node 24 so the runner is on npm < 11.5.1 (the `Assert npm supports trusted publishing` step in `.github/actions/setup` should have caught this on the PR that downgraded it), or the package has no trusted publisher yet — a brand-new package needs the [manual fallback](#manual-fallback) first.
- **`npm publish` rejects with `cannot publish over previous version`** — tag re-used (npm versions are immutable). Bump to the next patch and re-tag.
- **Release workflow fails on `Resolve package and version from tag`** — tag pushed without bumping the package's `package.json`, or before the bump. Re-run `npm version X.Y.Z --tag-version-prefix "$PKG@v"` in `packages/$PKG` and push again.
- **Release workflow does not trigger at all** — tag is a bare `vX.Y.Z` (missing the `<package>@` prefix the trigger needs). Re-tag as `<package>@vX.Y.Z` (set `--tag-version-prefix`) and push again.
- **Release workflow fails with `no package at packages/<name>`** — tag prefix does not match a directory under `packages/`. Use the directory name (e.g. `eslint-config`), not the npm scope, as the prefix.
- **Release triggered from a fork** — OIDC claims carry the fork's repository, which will not match the trusted publisher. Releases must run from `kommo-crm/linting`.
- **`make verify` fails in CI but passes locally** — coverage/lint drift on a different Node version. Match `.nvmrc` locally (`nvm use`) and re-run `make verify`.
