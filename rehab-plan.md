## chatFGC Rehabilitation, Bun Migration, and Agent Integration Plan

### Guiding Goals
- Restore the TanStack AI chatbot template to a stable, Netlify-ready state that integrates cleanly with the DigitalOcean Agent.
- Migrate tooling to a Bun-first workflow while retaining npm as a fallback and properly attributing the original authors.
- Progress through phased workstreams where a phase is only complete after linting, type-checking, and tests pass.
- Evaluate legacy assets (e.g., `/convex`) and validate their integrations before deciding on retention.
- Extend the platform with deeper DigitalOcean Agent CLI/API integration for multi-industry chatbot support.

### Phase 0 – Branching & Baseline Assessment
- Create feature branch (e.g., `rehab/netlify-stability`) from `fix/netlify-deploy-issues` for isolation.
- Inventory current scripts, environment variables, Netlify configuration, and Bun assets; note npm as fallback.
- Attempt baseline commands (`bun run lint`, `bun run typecheck`, `bun run test`, `bun run build`) to expose missing scripts or failures and document findings.
- Deliverable: baseline report summarizing errors, missing tooling, and deployment blockers.
- Quality Gate: once scripts exist, ensure they execute under Bun (even if failing) to establish measurable metrics.

### Phase 1 – Bun-First Tooling & Quality Harness
- Configure ESLint (TypeScript + React rules) and expose a `bun run lint` script with npm parity.
- Add Vitest + React Testing Library with `bun test`/`bun run test` plus watch mode; ensure npm equivalents remain available.
- Add `bun run typecheck` using `tsc --noEmit`.
- Update project scripts so Bun is primary executor, documenting npm as the backup.
- Quality Gate: `bun run lint && bun run typecheck && bun run test` must pass.

### Phase 2 – Build & Deployment Diagnostics
- Reproduce Netlify builds locally via Bun (`bun run build`) and optionally `netlify build`, using DigitalOcean Agent environment values.
- Audit environment variable usage (`process.env` vs `import.meta.env`) across shared code (`genAIResponse`, Sentry bootstrap) and correct inconsistencies.
- Evaluate streaming logic, state management, and error handling for resilience against DigitalOcean Agent downtime.
- Validate the `/convex` integration path, ensure feature parity, and outline follow-up testing (Convex credentials now populated locally to enable Phase 2 experiments).
- Quality Gate: lint/typecheck/test plus `bun run build` succeed locally; log remaining runtime blockers if any.

### Phase 3 – Remediation & Hardening
- Implement fixes discovered in Phase 2 (environment handling, streaming robustness, optional integration guards, UI regressions).
- Deepen `/convex` integration with production-ready guards once Phase 2 validation completes.
- Update Netlify configuration for Bun builds and verify DigitalOcean Agent credential mapping.
- Enhance defensive logging while ensuring missing optional credentials do not break builds/runtime.
- Quality Gate: `bun run lint && bun run typecheck && bun run test && bun run build` all green; run smoke test locally or via Netlify preview.

### Phase 4 – Documentation & Deployment Readiness
- Update README and supporting docs to highlight Bun-first workflow, fallback npm commands, environment requirements, and DigitalOcean integration steps while crediting original authors.
- Produce deployment playbook covering pre-deploy checks, environment validation, and post-deploy smoke tests.
- Optionally add CI (GitHub Actions or Netlify build plugin) running Bun-based lint/typecheck/test before deploy.
- Quality Gate: final `bun run lint && bun run typecheck && bun run test && bun run build`, followed by a successful Netlify deploy using DigitalOcean Agent credentials.

### Phase 5 – Enhanced DigitalOcean Agent Integration
- Evaluate DigitalOcean Agent CLI/API capabilities for managing multiple chatbots across industries.
- Design modular configuration to support per-industry prompt sets, routing, and credential management.
- Implement integration modules, provisioning workflows, monitoring hooks, and tests.
- Update documentation with advanced DigitalOcean Agent usage patterns and operational checklists.
- Quality Gate: `bun run lint && bun run typecheck && bun run test && bun run build` remain green post-integration; perform end-to-end smoke tests for multiple agent configurations.

### Droid Roster & Responsibilities
- `bun-quality-guardian`: Establish Bun-first scripts, configure ESLint/Vitest/type-checking, and produce baseline quality reports.
- `netlify-diagnostician`: Reproduce Netlify builds, audit environment usage, and surface deployment blockers.
- `stability-remediator`: Apply code fixes, remove legacy assets, and ensure quality gates stay green.
- `docs-and-attribution-curator`: Update documentation for tooling, deployment steps, and attribution.
- `do-agent-integrator`: Lead Phase 5 DigitalOcean Agent CLI/API integration and associated testing.
- `ci-enforcer` (optional): Maintain CI pipelines executing Bun-based lint/typecheck/test suites pre-deploy.

### Exit Criteria
- All phases’ quality gates satisfied with Bun-first command suite.
- Documentation reflects tooling preference, deployment guidance, and attribution.
- Netlify deployment succeeds with DigitalOcean integration validated.
- Phase 5 delivers scalable DigitalOcean Agent workflows for multi-industry chatbots with supporting tests and docs.
- Branch ready for PR merge with summarized findings and future roadmap items.

### Phase 1 Summary – 2025-10-16
- Implemented Bun-first quality tooling by introducing a flat ESLint setup (`eslint.config.js`), Vitest configuration (`vitest.config.ts`/`vitest.setup.ts`), and aligned project scripts so `bun run lint`, `bun run typecheck`, and `bun run test` now pass on a clean workspace.
- Refined store hooks and UI components to satisfy the new lint gate (eliminated conditional React Hook usage, ensured event handlers avoid unhandled promises) while keeping Convex integration optional.
- Droid usage: the `bun-quality-guardian` droid was not invoked; tasks were completed manually, but the agent remains the owner of ongoing Bun-first quality automation.
- Challenges: conditional Convex hooks triggered strict lint failures, and Vitest initially exited with an error because no specs exist. Resolved by redesigning hook flow and adopting `vitest --passWithNoTests` until test coverage lands. NPM fallback required `--legacy-peer-deps` to reconcile the Netlify plugin’s Vite 7 peer requirement.
- Recommended adjustments: document the temporary `--passWithNoTests` flag until Phase 2 adds coverage, note the npm fallback flag in AGENTS documentation, and consider shading future lint tickets toward adding tests or pruning unused Convex assets.
