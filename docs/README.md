# Board population

`tickets-source/` holds the 113 authored tickets (10 epics) and `MANIFEST.csv`, the machine-readable
index that drives issue creation.

`populate-board.mjs` creates every issue, adds it to the project board, and sets its field values in
one pass. It is written in Node with no external dependencies, because neither `pnpm` nor `jq` were
present on the primary dev machine and a shell script depending on them failed at runtime.

## Prerequisite

The `gh` token needs the **project** scope. `repo` covers repositories and issues but not Projects v2,
so the board is unreachable without it:

```
gh auth refresh -s project
```

The script refuses to start without it rather than creating issues it cannot place on the board.

## Running it

```
node docs/populate-board.mjs              # dry run, creates nothing
DRY_RUN=0 node docs/populate-board.mjs    # apply
```

It is **resumable**. Every created issue is recorded in `tickets-source/.created-issues.tsv` with its
URL and board item id, and recorded ids are skipped on a re-run, so an interruption partway through
113 issues is safe to re-run.

## What it does

1. Verifies the project scope and reads the board's existing fields, printing them before changing
   anything.
2. Creates only the missing fields — `Epic`, `Repo`, `Priority`, `Size`, `Serialize`,
   `Milestone Phase`. It never touches `Status`, since that field usually already exists with the
   project's own option set.
3. Creates labels per repo, idempotently. 82 distinct labels across the four repos.
4. Creates each issue in its target repo, strips the YAML frontmatter from the body, adds it to the
   board, and sets all six field values.

Tickets whose `repo` is `admin` or `all` are not code work — 18 of them, covering the npm org, the
Supabase project, store reservations, archiving the old Pawlii repos, brand assets and the legal
entity. They are created in `atlure-ui` as the hub repo and tagged `ops`.

## Afterwards

Set `Status` from the board. Leave anything with an unmet blocker in `Backlog` and move only tickets
whose blockers are `Done` into `Ready` — otherwise an agent will claim blocked work. Keep concurrent
work in flight to roughly six; review capacity is the bottleneck, not agent availability.
