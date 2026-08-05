# Agent B2 — atlure-ui component wave (continuation)

Started 2026-08-05. Repo: `atlure-ui` (`simpxlify/atlure-ui`).
Predecessor record: `tasks/agent-b-checkpoint.md` on `feature/ds-icons-package` — read it
first, it holds every decision and trap from 026/027/016/028.

## Assignment

Pick up at 029. Sequence: 029 -> 033 -> 039 -> wide batch (030-032, 034-038, 040 native;
041/042/044/045 web). Concurrency cap 2-3 including sub-agents. Never start emulator /
simulator / Docker / Metro.

## Status log

- [x] Read agent B checkpoint, ticket 032 (029) and its audit comment, environment-gotchas
- [ ] 029 Card family / Separator — branch `feature/ds-card-and-separator`
- [ ] 033 Input / Textarea / Label / FormField / SearchBar (#36) — highest-leverage blocker
- [ ] 039 Skeleton / Spinner / EmptyState / ErrorState / ListRow (#42)
- [ ] wide batch

## 029 — Card family and Separator

### Branch base is not `main`, deliberately

`CardTitle` / `CardDescription` must use `Text` typography variants. Ticket 027 (PR #58)
**renames the whole scale**: `heading/title/subtitle/caption` on `main` become
`h1/h2/h3/body/bodySm/label/caption`. A `CardTitle` written against `main`'s `variant="title"`
would break the moment #58 merges. So this branch stacks on `feature/ds-text-typography` and
its PR targets #58 — retarget to `main` once #58 lands, exactly as #62 does.

### Audit said PARTIAL — what was actually missing

`Card`/`CardHeader`/`CardContent`/`CardFooter`/`Separator` already existed on `main` with
3 card tests. Missing: `CardTitle`, `CardDescription`, a `Separator` test, and any assertion
on the default card's classes.

### Decisions

(filled in as the work lands)
