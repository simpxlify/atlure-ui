---
"@atlure/tokens": patch
---

Make the generated-artifact checksum guard actually guard. `pnpm --filter @atlure/tokens test` ran `generate` first, which rewrote every artifact **and** `checksum.json` before the comparison, so a hand-edit was silently regenerated away and the test could never fail. It now compiles the test sources only and compares the committed artifacts against the committed checksum.
