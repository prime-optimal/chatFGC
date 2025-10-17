## Why
chatFGC currently greets users with an empty input field, which can make it unclear what kinds of fighting-game coaching topics the assistant excels at.

## What Changes
- Introduce rotating suggested starter questions that surface when no conversation is active.
- Curate prompts that highlight chatFGC’s FGC training strengths and keep them fresh across visits.
- Hide suggestions once a conversation is underway so they do not distract from active chats.

## Impact
- Affected specs: conversation-onboarding/spec.md
- Affected code: `src/components/WelcomeScreen.tsx`, supporting state/store utilities for rotating prompts.
