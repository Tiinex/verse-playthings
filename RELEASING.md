# Releasing @tiinex/playthings

This repository is prepared for npm trusted publishing from GitHub Actions. The package is not assumed to exist on npm until the one-time bootstrap below has been completed.

## Release model

- Source releases are created from local VS Code through `Tiinex: release @tiinex/playthings (auto)`.
- The release tool requires a clean `master`, verifies the Tiinex/playthings origin, fetches tags, runs package qualification, chooses a semantic-version bump, updates `package.json` and `package-lock.json`, creates one release commit and annotated `vX.Y.Z` tag, pushes commit+tag atomically, then creates a GitHub Release through GitHub CLI.
- Publishing is owned by `.github/workflows/publish.yml` after the GitHub Release is published.
- The publish workflow uses npm Trusted Publishing / GitHub OIDC. It contains no npm write token.
- `prepublishOnly` fails closed unless publication is either the one-time prerelease bootstrap or the qualified GitHub Release workflow.

## Automatic version policy

The release tool chooses the strongest applicable signal since the latest stable `vX.Y.Z` tag:

1. Explicit `[release:major]`, `[release:minor]`, `[release:patch]` or equivalent `release: ...` markers.
2. Breaking-change / `type!:` commit markers.
3. Public package-surface changes: removing or retargeting an export/file pattern or changing package/module/Node compatibility is breaking; adding a public export/file pattern is a feature.
4. `feat:` or `[feature]` commit markers are minor.
5. Otherwise the release is patch.

Before 1.0, an automatically detected breaking change advances the minor version instead of silently declaring 1.0.0. An explicit `[release:major]` marker or `npm run release -- --bump major` is required to opt into 1.0.0.

The first release is special: `0.1.0-dev.0` stabilizes to `0.1.0` after the npm registry bootstrap.

Use `Tiinex: preview @tiinex/playthings release bump` or `npm run release:preview` to inspect the recommendation without changing files, tags, remotes or releases.

## One-time npm registry bootstrap

npm requires the package to exist before a trusted publisher can be attached. While the source version is still a prerelease, sign in to npm with an account that can publish the `@tiinex` scope and run `npm run publish:bootstrap`.

That command runs the full package checks and publishes the current prerelease under the npm dist-tag `dev`; it does not claim the `latest` tag. npm may require 2FA. After that prerelease exists, configure the trusted publisher on npm and use the normal release task for `0.1.0` and later releases.

Do not use the bootstrap command after the package version becomes stable; the publish guard rejects it.

## GitHub setup

Create a repository Environment named exactly `npm`. Optional approval/protection rules can be added there. The workflow binds to that environment.

The GitHub CLI (`gh`) must be installed and authenticated on the developer machine used by the VS Code release task. `gh auth status` must pass.

GitHub Actions must be enabled for the repository. The workflow itself only requests `contents: read` and `id-token: write`.

## npm trusted publisher setup

After the bootstrap package exists, open the npm package settings and add a GitHub Actions trusted publisher with:

- GitHub organization/user: `Tiinex`
- Repository: `playthings`
- Workflow filename: `publish.yml`
- Environment: `npm`
- Allowed action: direct `npm publish`

The package `repository.url` uses npm's normalized GitHub form `git+https://github.com/Tiinex/playthings.git`, identifying the exact trusted repository without publish-time metadata correction.

After trusted publishing has successfully published at least one release, npm publishing access should be tightened to require 2FA and disallow traditional tokens. OIDC trusted publishing continues to work without a long-lived npm write secret.

## Normal release

1. Commit the intended Playthings source normally.
2. Ensure `master` is clean and not behind `origin/master`.
3. Run the VS Code task `Tiinex: preview @tiinex/playthings release bump` if you want a read-only recommendation.
4. Run `Tiinex: release @tiinex/playthings (auto)`.
5. Review the proposed bump and target tag in the terminal and answer `y` to continue.
6. The script qualifies the package, creates and atomically pushes the release commit/tag, then publishes a GitHub Release.
7. GitHub Actions verifies the tag/package identity and publishes to npm through OIDC.
8. Verify the GitHub Actions run and the npm package version before starting another release.

If the script reports a failure after the release commit was created, do not rerun blindly. Inspect `git status`, `git log`, `git tag` and `gh release view vX.Y.Z` first; the tool intentionally avoids guessing which remote side effect completed.
