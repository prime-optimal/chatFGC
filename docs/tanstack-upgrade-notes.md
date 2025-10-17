# TanStack upgrade attempts (October 17, 2025)

## Goal

Bring the project’s TanStack dependencies up to the current stable 1.133.x line so the Netlify build no longer complains about missing exports.

## What we tried

1. **Upgrade after lifting Bun’s release-age gate**
   - Bumped `@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/router-generator`, `@tanstack/router-plugin`, `@tanstack/router-devtools`, and related packages to the latest (1.133.x).
   - Discovered `@tanstack/react-start-plugin` only has releases up to **1.131.50**, so the expected `createTanStackStartPlugin` export is missing.
   - Added `patch-package` and a patch file to inject defaults in `@tanstack/react-start-config`, but the build still failed because the upstream plugin simply lacks the symbol.

2. **Install missing peer tooling**
   - Added `@tanstack/start-plugin-core` and tried several `patch-package` versions to reconcile mismatched exports.
   - Chasing this resulted in additional build failures (`createTanStackConfig` missing), confirming the plugin mismatch.

3. **Rollback plan**
   - Re-pinned the full TanStack suite (`react-start`, router packages, plugin, generator, devtools) to **1.131.50**.
   - This is the last cohesive release family where the exported APIs (`createTanStackStartPlugin`, `createTanStackConfig`, etc.) still match the consuming code.

## Where we stopped

- `package.json` now reflects the 1.131.50 pins, but the lockfile still needs a clean reinstall (`bun install`) and a fresh `bun run build` / lint / typecheck / test pass to verify the downgrade.
- The earlier patch file under `patches/@tanstack+react-start-config+1.120.20.patch` is now redundant and can be removed once the downgrade is confirmed.

## Next steps for whoever picks this up

1. Run `bun install` (or `npm install`) to sync `bun.lock` / `package-lock.json` with the 1.131.50 versions.
2. Execute the quality gates: `bun run build`, `bun run lint`, `bun run typecheck`, and `bun run test`.
3. If everything is green, delete the old patch file before committing so we aren’t carrying useless overrides.
4. If the project still needs features from 1.133.x, wait for `@tanstack/react-start-plugin` to publish a matching release (or evaluate replacing the plugin usage altogether).

This should give the next person enough context to continue either the downgrade validation or a future re-upgrade once the missing pieces ship.
