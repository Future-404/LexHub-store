## 2026-07-21 - Preserve stable module identities
**Decision:** A module ID must not be reused when the upstream repository, author, and implementation all change.
**Insight:** Treat registry IDs as persistent package identities, even when the catalog has no explicit migration mechanism.
**Apply when:** Reviewing module replacements, forks, or rewrites before commit.
