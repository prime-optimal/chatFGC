# Project Context

## Purpose
chatFGC is a TanStack Start-based chat client that delivers streaming conversations against OpenAI-compatible chat APIs. The goal is to provide a polished, responsive UI with markdown rendering, conversation management, and flexible provider configuration for Anthropic, OpenAI, and custom backends.

## Tech Stack
- TypeScript 5
- React 19 with TanStack Start & TanStack Router
- TanStack Store for client state
- Vite/Vinxi build tooling with Bun-first workflow (npm parity maintained)
- Tailwind CSS 4 for styling and Lucide icons
- Optional Convex backend integration and Sentry monitoring

## Project Conventions

### Code Style
- eslint is configured with `@eslint/js`, `typescript-eslint`, `eslint-plugin-react`, and `eslint-plugin-react-hooks`; follow the recommended React+TS rule sets.
- TypeScript compiler runs in `strict` mode with unused symbol checks; keep imports and locals clean.
- Use React JSX runtime (`jsx: react-jsx`) and adhere to existing functional component patterns.
- Prefer Bun scripts (`bun run …`) but ensure npm scripts stay in sync when dependencies shift.

### Architecture Patterns
- TanStack Start drives routing with file-based routes in `src/routes`, anchored by `__root.tsx` layouts.
- UI is composed from reusable components in `src/components` with Tailwind utility classes.
- Client state lives in TanStack Store hooks under `src/store`; Convex integration remains optional and must gracefully handle absence of `VITE_CONVEX_URL`.
- Utility helpers (e.g., AI adapters) reside in `src/utils`; keep provider-specific logic encapsulated there.

### Testing Strategy
- Vitest (jsdom environment) runs via `bun run test`; setup lives in `vitest.setup.ts` with Testing Library matchers.
- Run the full quality gate (`bun run lint && bun run typecheck && bun run test`) before completing work; expect tests under `src/utils/__tests__/` and expand coverage alongside new utilities.

### Git Workflow
- Default branch is `main`; work happens on feature branches (e.g., `rehab/*`) with focused scopes.
- Keep both `bun.lock` and `package-lock.json` updated when dependencies change.
- Before committing, ensure lint, typecheck, and tests pass and inspect diffs for secrets per project guidelines.

## Domain Context
The app targets AI-guided conversations for fighting game coaching (FGC) scenarios, emphasizing prompt customization, history management, and markdown-rich outputs. Providers follow OpenAI-compatible chat completion semantics with streaming SSE responses.

## Important Constraints
- Do not commit API keys or secrets; `.env` remains local-only.
- Maintain compatibility with multiple chat providers and keep streaming UX responsive.
- Preserve optional Convex integration path without requiring the backend in local development.
- Respect the OpenSpec workflow for planning significant changes.

## External Dependencies
- Custom chat API endpoint (OpenAI-compatible `/api/v1/chat/completions` style).
- Anthropic and OpenAI can be configured via env vars.
- Convex database services (optional) for persistent conversation storage.
- Sentry SaaS for error and performance monitoring (optional, env-gated).
