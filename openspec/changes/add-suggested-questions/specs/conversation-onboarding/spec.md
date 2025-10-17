## ADDED Requirements
### Requirement: Suggested Question Prompts
When the home view loads without an active conversation, the system SHALL display at least three suggested questions related to fighting game coaching topics that chatFGC understands well.

#### Scenario: Initial Welcome Suggestions
- **WHEN** the user loads the app with no current conversation
- **THEN** three or more curated FGC coaching prompts are shown below the greeting
- **AND** each prompt reflects chatFGC expertise (e.g., matchup analysis, training plans)

#### Scenario: Suggestions Hide During Active Chat
- **WHEN** the user starts or resumes a conversation
- **THEN** the suggested prompts are hidden to avoid cluttering the chat flow

#### Scenario: Rotating Suggestions
- **WHEN** the welcome screen remains idle
- **THEN** the app periodically cycles in a fresh set of suggested prompts so repeated visits are varied
- **AND** the rotation occurs without requiring a page reload.
