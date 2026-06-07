# Releasing

Step-by-step runbook for cutting a new version of any publishable package in this monorepo to the public npm registry. The push of an annotated tag is the only thing the publish workflow needs — everything else is hygiene.

Each package is versioned and released **independently**: it owns its `package.json`, `CHANGELOG.md`, and tag. `@kommo-crm/eslint-config` is the only package today, but the same flow applies to every workspace under `packages/`.

The commands below use a `PKG` variable so they work for whichever package you are releasing — set it once per session (the directory name under `packages/`):

```sh
PKG=eslint-config
```

The package version lives in `packages/$PKG/package.json` (not the workspace root), so version bumps run from that directory. Tags are namespaced per package as `<package>@vX.Y.Z` (e.g. `eslint-config@v0.1.1`); the release workflow resolves which package to publish from the tag prefix, so each package releases on its own cadence from shared history. The workflow validates the tag against a strict contract — the `<package>` part must be the kebab-case directory name under `packages/` (no `@`), and the version must be semver — so a malformed tag fails fast instead of publishing the wrong thing.

## Prerequisites (one-time)

- An npm account with publish rights for the `@kommo-crm` scope.
- An npm **Automation** access token stored as the `NPM_TOKEN` repository secret.
- The CI workflow (`.github/workflows/ci.yml`) is green on `main`.
- The release workflow (`.github/workflows/release.yml`) exists and is enabled.

### First-time token setup

1. Generate a token at <https://www.npmjs.com/settings/~/tokens> → **Generate New Token** → **Automation**.
   - **Important:** the token type must be **Automation**, not **Publish** or **Read & Publish**. The latter two require a 2FA OTP at publish time and will fail in CI.
   - The token is shown only once — copy it to a password manager immediately.
2. In GitHub: **Settings → Secrets and variables → Actions → New repository secret** → name `NPM_TOKEN`, value the token.

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

If the release workflow is unavailable (CI down, secrets rotated):

```sh
pnpm install --frozen-lockfile
make verify
pnpm publish --filter "@kommo-crm/$PKG" --access public --otp <YOUR_OTP>
```

Use only as an emergency path; CI publishing is the source of truth.

## What can go wrong

- **`npm publish` rejects with `EOTP`** — token is `Publish`/`Read & Publish` (2FA-required), not `Automation`. Regenerate the token as **Automation** and update the `NPM_TOKEN` secret.
- **`npm publish` rejects with `403 Forbidden`** — token does not have publish rights for the `@kommo-crm` scope. Ensure it is owned by an account with maintainer access on the scope.
- **`npm publish` rejects with `cannot publish over previous version`** — tag re-used (npm versions are immutable). Bump to the next patch and re-tag.
- **Release workflow fails on `Resolve package and version from tag`** — tag pushed without bumping the package's `package.json`, or before the bump. Re-run `npm version X.Y.Z --tag-version-prefix "$PKG@v"` in `packages/$PKG` and push again.
- **Release workflow does not trigger at all** — tag is a bare `vX.Y.Z` (missing the `<package>@` prefix the trigger needs). Re-tag as `<package>@vX.Y.Z` (set `--tag-version-prefix`) and push again.
- **Release workflow fails with `no package at packages/<name>`** — tag prefix does not match a directory under `packages/`. Use the directory name (e.g. `eslint-config`), not the npm scope, as the prefix.
- **Release workflow can't find `NPM_TOKEN`** — secret missing or scoped to a fork. Add it under repository **Settings → Secrets and variables → Actions**.
- **`make verify` fails in CI but passes locally** — coverage/lint drift on a different Node version. Match `.nvmrc` locally (`nvm use`) and re-run `make verify`.
