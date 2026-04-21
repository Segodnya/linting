# Releasing

Step-by-step runbook for cutting a new version of `@kommo-crm/linting` to the public npm registry. The push of an annotated `vX.Y.Z` tag is the only thing the publish workflow needs — everything else is hygiene.

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

3. **Bump the version.** This rewrites `package.json`, folds the staged `CHANGELOG.md` into the same commit, and tags `vX.Y.Z` locally:

   ```sh
   npm version patch     # 0.1.0 → 0.1.1 (bug fix)
   npm version minor     # 0.1.x → 0.2.0 (additive feature)
   npm version major     # 0.x.y → 1.0.0 (breaking change)
   ```

   > **Why this order matters.** `npm version` creates the bump commit and tag in one shot. If you bump first and amend the CHANGELOG afterwards, the tag will point at the original (now-orphaned) commit and CI will publish a tarball that does not match the tagged tree.

4. **Push commit + tag together.** `--follow-tags` ensures the new tag is shipped, which triggers the release workflow:

   ```sh
   git push --follow-tags
   ```

5. **Watch the release workflow.** GitHub → Actions → "Release". On success it runs `make verify`, publishes to npm, and creates a GitHub Release with auto-generated notes. Verify the new version on <https://www.npmjs.com/package/@kommo-crm/linting> before announcing.

### If you forgot to update CHANGELOG before `npm version`

If you bumped the version and only then realised CHANGELOG was not updated, recover by amending and forcing the tag onto the new commit:

```sh
$EDITOR CHANGELOG.md
git add CHANGELOG.md
git commit --amend --no-edit
git tag -f v$(node -p "require('./package.json').version") HEAD
git push --follow-tags --force-with-lease
```

Prefer the routine order (CHANGELOG → stage → `npm version`) — it avoids this dance entirely.

## Rolling back a bad release

npm versions are immutable — you cannot re-publish the same `X.Y.Z` (and even unpublishing within 72h carries restrictions). Two options:

- **Hot-fix forward (preferred).** Bump a patch version with the fix and ship through the normal flow. Existing installs auto-update on `yarn upgrade`.

- **Deprecate the bad version.** `npm deprecate @kommo-crm/linting@X.Y.Z "do not use — see X.Y.Z+1"` makes installs print a warning. Users on the bad version still keep working until they upgrade.

Avoid `git tag -d` + force-push gymnastics on a public tag. The tag is the audit trail — do not rewrite it once it has been pushed.

## Manual fallback

If the release workflow is unavailable (CI down, secrets rotated):

```sh
yarn install --frozen-lockfile
make verify
npm publish --access public --otp <YOUR_OTP>
```

Use only as an emergency path; CI publishing is the source of truth.

## What can go wrong

| Symptom                                                             | Likely cause                                                                | Fix                                                                          |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `npm publish` rejects with `EOTP`                                   | Token is `Publish`/`Read & Publish` (2FA-required), not `Automation`        | Regenerate token as **Automation** and update the `NPM_TOKEN` secret.        |
| `npm publish` rejects with `403 Forbidden`                          | Token does not have publish rights for the `@kommo-crm` scope               | Ensure the token is owned by an account with maintainer access on the scope. |
| `npm publish` rejects with `cannot publish over previous version`   | Tag re-used (npm versions are immutable)                                    | Bump to the next patch and re-tag.                                           |
| Release workflow fails on `Verify tag matches package.json version` | Tag pushed without bumping `package.json`, or pushed before the bump commit | Re-run `npm version X.Y.Z` and push again.                                   |
| Release workflow can't find `NPM_TOKEN`                             | Secret missing or scoped to a fork                                          | Add it under repository **Settings → Secrets and variables → Actions**.      |
| `make verify` fails in CI but passes locally                        | Coverage/lint drift on a different Node version                             | Match `.nvmrc` locally (`nvm use`) and re-run `make verify`.                 |
