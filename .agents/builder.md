## 2026-07-21 - Registry compatibility constraints
**Contract:** Platform support needs explicit architecture and Android API constraints when support is narrower than the OS family.
**Insight:** Registry metadata should be executable through a dependency-free validator so identity and compatibility regressions fail in CI.
**Apply when:** Adding or replacing a module with native binaries or platform-specific releases.
