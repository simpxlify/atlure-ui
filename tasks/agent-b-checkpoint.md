# Agent B — atlure-ui component wave

Started 2026-08-05. Repo: `atlure-ui` (`simpxlify/atlure-ui`).

## Assignment

Ticket sequence: 026 -> 027 -> {028, 029, 033} -> 039 -> wide batch
(030-032, 034-038, 040 native; 041-045 web).

Concurrency cap: 2-3 agents total including sub-agents. Never start
emulator / simulator / Docker / Metro.

## Status log

- [x] Read handoff, platform-arch, environment-gotchas, styling, AGENTS.md, .ai/context.md
- [x] Environment verified (corepack pnpm 11.20.0, install exits 0, baseline build/typecheck/test green at 70 tests)
- [x] 026 @atlure/icons — `packages/icons`, 12 tests, publint + attw green, pack manifest updated
- [ ] 027 Text + typography scale
- [ ] 028 Button / IconButton
- [ ] 029 Card family / Separator
- [ ] 033 Input / Textarea / Label / FormField / SearchBar
- [ ] 039 Skeleton / Spinner / EmptyState / ErrorState / ListRow
- [ ] wide batch

## Notes

### 026 findings worth carrying forward

- **lucide dropped its brand glyphs in v1.** `Chrome` and `Facebook`, which the prototype
  used for social sign-in, do not exist in `lucide-react@1.28` or `lucide-react-native@1.28`.
  The social buttons need a different icon source; that is a brand-asset call (ticket 109).
- **Icon name to module path is not mechanical.** `AlertCircle` lives in `circle-alert`,
  `Edit3` in `pen-line`, `CheckCircle` in `circle-check-big`, `HelpCircle` in
  `circle-question-mark`. The generator reads the mapping out of lucide's own barrel; a
  kebab-case heuristic would have silently produced wrong paths.
- **The native entry cannot be `import`ed in bare Node**, by any package. `lucide-react-native`
  pulls `react-native-svg`, which pulls `react-native`, whose source is Flow-typed and only
  parseable by Metro/Babel. Ticket 026 AC2 asks for both entries to load in Node without
  throwing; only the DOM entry can. Conditional *resolution* is provable and is tested.
- **Vitest externalises `lucide-react-native`**, so `resolve.alias` does not reach inside it.
  It has to be listed in `test.server.deps.inline` before any RN-facing alias applies.
- Importing the lucide barrel under vitest costs ~19s. Deep per-icon imports cut that to
  under 3s — and are required anyway, because Metro does not tree-shake the 6000-icon barrel.
