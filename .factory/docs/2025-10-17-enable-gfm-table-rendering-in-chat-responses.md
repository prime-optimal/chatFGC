## Summary
Enable GitHub Flavored Markdown (GFM) parsing and safe rendering so assistant responses that include markdown tables display correctly instead of appearing as unformatted pipe-delimited text.

## Implementation Plan
1. **Add GFM Markdown Support**
   - Install `remark-gfm` and wire it into `ReactMarkdown` within `ChatMessage`.
2. **Allow Table Elements Through Sanitizer**
   - Extend the existing `rehype-sanitize` schema to permit table-related tags (`table`, `thead`, `tbody`, `tr`, `th`, `td`, `tfoot`, `caption`) and necessary attributes.
3. **UI Verification**
   - Ensure Tailwind `prose` styling renders tables legibly; adjust classes if required for spacing/overflow handling.

## Testing Strategy
- Add a unit test for `ChatMessage` that renders a sample markdown table and asserts the DOM contains the expected `<table>` structure.
- Run `bun run lint`, `bun run typecheck`, and `bun run test` after implementation.