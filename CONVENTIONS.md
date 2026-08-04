# Atlure engineering conventions

Applies to every Atlure repo: `atlure-ui`, `atlure-paw`, `atlure-web`, `atlure-api`.

You are a product engineer and a frontend engineer at once — user experience, business impact and technical correctness are all in scope, all the time. Pixel-perfect implementation, meticulous requirements and clean architecture are non-negotiable.

---

## Naming

- **Files and folders: kebab-case.** `user-profile.tsx`, `use-auth.ts`, `sitter-card/index.tsx`. Group related files into folders.
- **Variables and functions: camelCase.** Clear and descriptive — never `val`, `data`, `res`, `tmp`.
- **Booleans carry a prefix** that states what kind of fact they are: `is` for state, `has` for ownership, `can` for capability, `should` for expected behavior. `isActive`, `hasAccess`, `canEdit`, `shouldRetry` — not `active`, `access`, `edit`, `retry`.
- **Components: PascalCase** in code, kebab-case on disk.
- Don't rename a default export to something different from its component name.

## Branches

| Prefix | Purpose |
|---|---|
| `feature/*` | new functionality or improvement |
| `fix/*` | bug fix (prefer this over `bugfix/*`) |
| `hotfix/*` | urgent production fix |
| `release/*` | release candidate |
| `chore/*` | maintenance, infra, CI, dependencies |
| `refactor/*` | restructuring with no behavior change |
| `docs/*` | documentation only |
| `test/*` | test additions or fixes |

`main` is production.

---

## Engineering principles

**SOLID**, read for frontend:
- *Single responsibility* — one reason to change per module, hook or component.
- *Open/closed* — extend through props and composition, not modification.
- *Liskov* — a component or hook should be substitutable without breaking callers.
- *Interface segregation* — never pass a component props it doesn't use.
- *Dependency inversion* — depend on abstractions (props, context, interfaces), not concrete implementations. This is exactly why screens talk to the data ports, never to the Supabase client directly.

**YAGNI** — don't build it until it's needed. No speculative props, no "we might want this later" APIs, no premature abstraction.

**KISS** — a clean 30-line component beats a clever 150-line one.

**One or two responsibilities per hook or interface.** If you're naming something `useFormValidationAndSubmissionAndAnalytics`, split it. Past ~80 lines, a hook is probably doing too much.

**No duplication.** Before writing a util, formatter, hook or helper, search first. If it exists, use it. If something close exists, extend it. This applies especially to data formatting, API call patterns, shared hooks, and shared types — and doubly so here, because `@atlure/tokens`, `@atlure/types` and `@atlure/ui` exist precisely so nothing gets duplicated across the mobile app and the web site.

---

## Mobile first, always

Atlure is a mobile-first product; `atlure-paw` is the primary surface. Every component works at 375px before desktop is considered. Touch targets ≥ 44px. Never rely on hover as the only affordance.

## Performance

- Avoid unnecessary re-renders; memoize selectively but *correctly* (`useMemo`, `useCallback`, `React.memo`).
- Virtualize long lists (sitter search results, message threads) — `@tanstack/react-virtual` or `FlatList` with proper `keyExtractor` and `getItemLayout`.
- Lazy-load routes and heavy components.
- Keep bundle impact visible — know what you're importing.
- Defer non-critical work off the main thread.
- Optimize images with proper loading strategies.

---

## Every state, not just the happy path

Designs show the happy path. Implementing the rest is your job, not a follow-up ticket.

| State | Required |
|---|---|
| **Loading** | skeleton or spinner while fetching |
| **Empty** | zero-results message, illustration, or a CTA |
| **Error** | user-friendly message plus retry where sensible |
| **Partial data** | long text, missing fields, nulls must not break layout |
| **Disabled** | inputs and buttons that shouldn't be interactive |

A blank screen or a crash is never acceptable. This is why the mock data adapter exposes `latencyMs` and `failureRate` — so these states are built in phase one rather than retrofitted.

---

## File organisation — UI files hold rendering only

Everything else goes in a co-located file in the same feature folder:

| What | Where |
|---|---|
| Types and interfaces | `types.ts` |
| Constants | `constants.ts` |
| Hooks | `hooks/use-xxx.ts`, one per file |
| Utils and helpers | `utils.ts` |

Create these files if they don't exist yet. Don't inline a type, constant or hook in a component just because there's no file for it — that is exactly how components grow to 600 lines. The only exception is a tiny single-use props type used by that one component.

---

## React patterns

- Composition over prop drilling — use children and slots.
- Custom hooks for stateful logic; raw `useState`/`useEffect` in components only for genuinely simple cases.
- Co-locate state as low in the tree as it can live. Don't lift unnecessarily.
- Named exports preferred; default exports only for pages and routes.
- Strict TypeScript. No `any`, no unchecked assertions.
- Early returns over nesting.
- **Never `useEffect` for derived state** — compute inline or with `useMemo`.
- Short-circuit rendering (`{isLoggedIn && <LogoutButton />}`) over ternaries for null cases.
- Always give images an `alt`.
- Destructure props and hooks; don't reach through (`props.user.name`).
- Always specify initial state in `useState`, and always give `useEffect` a dependency array.

## Accessibility

Semantic roles, `aria-label` where text isn't visible, working keyboard navigation, visible focus states. On React Native: `accessibilityRole`, `accessibilityLabel`, `accessibilityState`.

## Translations

The market is EU-wide, so **every user-facing string goes through i18n from day one** — labels, placeholders, button text, errors, success messages, empty states, tooltips. Never hardcode display text in JSX. Add missing keys following the convention in the nearest feature folder.

---

## Testing

Write tests that get straight to the point. Test what would actually break and what a user would actually notice.

**Test:** user-visible behavior, interactions (click, submit, input), API calls (endpoint, method, payload), error handling, validation, edge cases, business logic.

**Don't test:** third-party library behavior, styling, DOM structure, trivial state toggles, React internals, "renders without crashing".

Conventions:
- **Vitest + React Testing Library** for component and app packages, co-located (`sitter-card.tsx` → `sitter-card.test.tsx`).
  - *Documented exception:* `@atlure/tokens` uses Node's built-in test runner instead. It is the root of the dependency graph and is deliberately kept at near-zero dependencies; Vitest would pull `esbuild` into it. Everywhere else, use Vitest.
- Never touch the DOM directly. Use `screen.getByRole()`, `getByText()`, `findBy*()`, `queryBy*()`. Prefer `getByRole('button', { name: /submit/i })` over `getByText('Submit')`.
- File order: imports → mocks → factory functions → `describe`/`it`.
- `describe` blocks start with "When"; `it` blocks start with a verb. Arrange-Act-Assert. One behavior per test, but group related assertions about the same state in a single `it` rather than splitting into one-`expect` blocks.
- Mock with the proxy pattern whenever you need `mockReturnValue` or `mockImplementation`:

```typescript
const mockUseSitterSearch = vi.fn();
vi.mock('@/hooks/use-sitter-search', () => ({
  default: (...args) => mockUseSitterSearch(...args),
}));
```

Never inline `vi.fn()` inside `vi.mock()`, never `require()` to patch a mock, never reassign a mocked module's exports. `beforeEach`: `.mockReset()` plus default return values. `afterEach`: `.mockClear()`.

- Async: `await waitFor(...)` or `await screen.findByText(...)`. Not `act(async () => ...)`.

---

## Comments

**Default to none.** If you want to explain *what* the code does, rename things until it explains itself.

A comment is justified only for a genuinely counterintuitive *why*: a lint suppression, a workaround for a library bug, or a non-obvious business or platform rule. Those are rare — in a whole feature you should expect zero or one. **Never comment test files**; the test names are the documentation.

---

## Working a task

1. **Understand before building.** Read every requirement, constraint and edge case. Study the design for spacing, color, and all states. Cross-reference existing components to find what to reuse. Turn the requirements into an explicit checklist — that becomes the PR checklist.
2. **System design check.** Does this touch shared state, and who owns it? Does the API call already exist? Is there a component covering 80% of this? What's the data flow? Any performance implications?
3. **Present the plan and wait for a green light** before writing code. Concise but complete — files to create, components to reuse, states to handle, tests to add. This catches misunderstandings before they become diffs.
4. **Implement, narrating structural moves.** One short sentence before creating a file, adding a hook, or changing a data flow — not every line. Mobile-first, reuse first, 1–2 responsibilities per unit.
5. **Run the quality gates**: `lint`, `typecheck`, `test`, `build` — whichever exist in that repo's `package.json`. Let git hooks run. **Never `--no-verify`** to skip a failing hook; fix the cause.

## Pull requests

Always **draft**, with `@copilot` as reviewer:

```bash
gh pr create --draft --title "..." --body "..."
gh pr edit --add-reviewer @copilot
```

Never mark ready for review without explicit confirmation.

Body sections: **Summary** (2–4 sentences on product impact, not just technical change), **Changes Made** (new features / fixes / refactoring), **Testing** (unit tests yes/no with reason, manual QA, numbered steps), **Screenshots** (mandatory for any UI change, no exceptions).

If the change is genuinely breaking — removed or renamed API, changed contract, needs migration — put a breaking-change banner stating what breaks and what to do **above** the Summary, as the first thing a reviewer sees. Only when it really is breaking.

## Stacked work

For dependent changes (`main → A → B → C`), use **git worktrees**, one per change, created sequentially since each child branches off its parent. Run the install command in each worktree — `node_modules` is per-worktree. Then run one agent per worktree in parallel. Each PR targets its **parent** branch, not `main`; retarget to `main` as parents merge.

---

## Self-review before pushing

1. Does this match the design exactly — spacing, font size, color, radius, every state?
2. Is any of this logic already implemented somewhere?
3. Is each hook and component doing one thing well?
4. Does it work on mobile, and on a slow connection?
5. Did I build anything nobody asked for?
6. Any unnecessary re-renders or missing memoization?
7. Are the accessibility attributes there?
