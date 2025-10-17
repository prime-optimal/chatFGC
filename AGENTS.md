<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# AGENTS Roster & Usage Notes

## Core Droids

### `bun-quality-guardian`
- **Mission:** Maintain Bun-first tooling (lint, typecheck, test). Ensures `bun run lint && bun run typecheck && bun run test` stay green.
- **When to Invoke:** Any time we adjust lint configs, add new tests, or change TypeScript settings. Also responsible for syncing npm fallback scripts.
- **Tooling Notes:** Prefer `bun add` for dependencies. When npm parity is required, run `npm install --legacy-peer-deps` to appease `@netlify/vite-plugin-tanstack-start`’s Vite 7 peer requirement.

### `netlify-diagnostician`
- **Mission:** Mirror Netlify builds locally, audit environment usage, and uncover deployment blockers.
- **When to Invoke:** During Phase 2 diagnostics or when Netlify deploys diverge from local results.
- **Tooling Notes:** Use `bun run build` first; fall back to `netlify build` with DigitalOcean Agent env vars as needed.

### `stability-remediator`
- **Mission:** Address defects uncovered in diagnostics, prune legacy assets (e.g., `/convex`), and keep quality gates passing.
- **When to Invoke:** Phases 2–3 once blockers are identified.

### `docs-and-attribution-curator`
- **Mission:** Update README/docs, track Bun-first workflow details, and attribute original authors.
- **When to Invoke:** Phase 4 documentation efforts.

### `do-agent-integrator`
- **Mission:** Extend DigitalOcean Agent integrations, support multi-industry prompt sets, and add monitoring hooks.
- **When to Invoke:** Phase 5 feature work.

### `ci-enforcer` (optional)
- **Mission:** Manage CI pipelines to run Bun lint/typecheck/test prior to deploys.
- **When to Invoke:** If/when we add CI automation.

## Operational Conventions
- **Primary Runtime:** Bun (`bun run …`). Maintain npm scripts for parity but expect to invoke Bun first.
- **Testing:** Until specs exist, run `bun run test` (configured with `--passWithNoTests`). Remove the flag once Vitest suites are added.
- **Convex Integration:** Hooks now default to local state when `VITE_CONVEX_URL` is unset. Any droid touching Convex must ensure the optional path remains safe.
- **Environment Files:** Never commit secrets. Reference `.env.example` for required keys.
- **Lockfiles:** Keep both `bun.lock` and `package-lock.json` in sync when dependencies change.

## Phase 1 Status Snapshot
- Bun-first scripts added and passing (`bun run lint`, `bun run typecheck`, `bun run test`).
- Lint configuration hardened; Convex hooks refactored to satisfy React rules.
- Vitest configured with jsdom environment and global setup.
- `bun-quality-guardian` not invoked during Phase 1; tasks executed manually but future automation remains under its purview.
