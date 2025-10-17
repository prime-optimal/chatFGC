# Vitest `vi` API Reference Snapshot

> Source: https://vitest.dev/api/vi.html (retrieved 2025-10-16)

Vitest’s `vi` helper provides utilities for mocks, spies, fake timers, and runtime tweaks. This snapshot captures the core sections for offline reference by project droids.

## Usage

```ts
import { vi } from 'vitest'
```

## Mock Modules

### `vi.mock`

- Signature: `(path: string, factory?: MockOptions | ((importOriginal: () => unknown) => unknown)) => void`
- Hoisted to top of file; supports async factories and `{ spy: true }` option.
- Only works on ESM `import` statements.
- Use `vi.hoisted` for shared variables; `vi.doMock` for non-hoisted mocks.

### `vi.doMock`

- Same as `vi.mock` but not hoisted; affects subsequent dynamic imports only.

### `vi.mocked`

- Type helper to treat a module as fully mocked.

### `vi.importActual`

- Imports the real module despite mocks.

### `vi.importMock`

- Imports a module with exports auto-mocked.

### `vi.unmock` / `vi.doUnmock`

- Remove a module from mock registry; `doUnmock` is not hoisted.

### `vi.resetModules`

- Clears module cache to force re-evaluation on next import.

### `vi.dynamicImportSettled`

- Awaits completion of pending dynamic imports.

## Mocking Functions & Objects

### `vi.fn`

- Creates a mock function capturing calls/returns.

### `vi.mockObject`

- Deeply mocks object properties (Vitest ≥3.2.0).

### `vi.isMockFunction`

- Detects whether a function is mocked.

### `vi.clearAllMocks` / `vi.resetAllMocks` / `vi.restoreAllMocks`

- Clear call history; reset implementations; restore originals.

### `vi.spyOn`

- Spy on object methods/getters/setters.

### `vi.stubEnv` / `vi.unstubAllEnvs`

- Override `process.env` / `import.meta.env`; restore later.

### `vi.stubGlobal` / `vi.unstubAllGlobals`

- Override global variables; restore later.

## Fake Timers

- `vi.advanceTimersByTime(ms)` / `vi.advanceTimersByTimeAsync(ms)`
- `vi.advanceTimersToNextTimer()` / `vi.advanceTimersToNextTimerAsync()`
- `vi.advanceTimersToNextFrame()`
- `vi.getTimerCount()`
- `vi.clearAllTimers()`
- `vi.getMockedSystemTime()` / `vi.getRealSystemTime()`
- `vi.runAllTicks()`
- `vi.runAllTimers()` / `vi.runAllTimersAsync()`
- `vi.runOnlyPendingTimers()` / `vi.runOnlyPendingTimersAsync()`
- `vi.setSystemTime(date)`
- `vi.useFakeTimers(config?)`
- `vi.isFakeTimers()`
- `vi.useRealTimers()`

## Miscellaneous

### `vi.waitFor(callback, options?)`

- Repeatedly invokes callback until it stops throwing or times out.

### `vi.waitUntil(callback, options?)`

- Similar to `waitFor`, but stops immediately on error; retries on falsy returns.

### `vi.hoisted(factory)`

- Runs logic before imports; useful for hoisting shared variables for mocks.

### `vi.setConfig` / `vi.resetConfig`

- Adjust per-file runtime config (timeouts, fake timers, etc.).
