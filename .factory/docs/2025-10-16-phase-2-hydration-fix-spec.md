## Core Diagnosis
- `hydrateRoot(document, ...)` is correct for TanStack Start’s full-document SSR, but wrapping `<StartClient>` with `Sentry.withErrorBoundary` injects extra DOM, causing the white screen.
- Client bootstrap also reads `process.env.SENTRY_DSN` instead of the Bun/Vite `import.meta.env.VITE_*`, drifting from the rest of the codebase.
- No `errorComponent` on the root route, so hydration errors become opaque.

## Primary Remediation Plan
1. **Client Entry Cleanup**
   - Remove the Sentry error-boundary wrapper; render `<StartClient router={router} />` directly.
   - Switch all DSN checks in `client.tsx` to `import.meta.env.VITE_SENTRY_DSN` and rely on `initSentry()` for instrumentation.
2. **Root-Level Error Boundary**
   - Add a `RootError` component in `__root.tsx` (simple fallback UI + optional Sentry capture) and wire it via `errorComponent` to improve diagnostics if hydration still fails.
3. **Verification**
   - Run `bun run lint`, `bun run typecheck`, `bun run test`, and `bun run build` after changes to confirm stability.

## Contingency Path (timeboxed)
- If the DOM errors persist after the wrapper removal, immediately try disabling Sentry for Phase 2 by no-oping `initSentry()` (guarded export) and removing its usage in both client and SSR entries.
- If disabling Sentry still fails or unblocks too slowly, revert `client.tsx`/`ssr.tsx` to the last known-good commit (`b0bb44e`) and repeat verification, then plan a safer re-introduction later.

## Assumptions
- TanStack Start full-document hydration remains the target.
- Disabling Sentry keeps its imports available for future reinstatement without breaking build tooling.
- Revert path will be coordinated via git only if both primary and contingency fixes fail quickly.