---
id: "012"
title: Create the Vercel project and wire www.atlure.com
repo: admin
epic: decommission
priority: P1
size: S
serialize: "No"
milestone: M0
blocked_by: "002 Create and clone the four atlure repos"
labels: "epic:decommission; type:manual; blocked:waiting-on-external; needs:david; area:vercel"
---

# Create the Vercel project and wire www.atlure.com

## Context

`atlure-web` is the Next.js marketing site and the only public web surface. The canonical host is `www.atlure.com`, with the apex `atlure.com` issuing a 308 redirect to it. Canonical-host choice affects every SEO canonical tag, sitemap entry and OG URL, so it must be settled before any marketing page ships.

## Scope

**This ticket requires David.** Vercel project creation, domain purchase/DNS and git-integration authorisation are all browser-interactive.

- Create a Vercel project linked to `simpxlify/atlure-web`.
- Add both `atlure.com` and `www.atlure.com`, set `www` as primary, apex redirecting 308 to `www`.
- Set the Vercel env var `NEXT_PUBLIC_SITE_URL=https://www.atlure.com` for production.
- Note: this PC ships as the `simpxlify` GitHub account; the commit author must match or Vercel blocks the deploy.

## Out of scope

Any page content, sitemap, robots.txt or SEO metadata — epic `web-marketing`.

## Files you own

None in the repo.

## Files you must NOT touch

`atlure-web/next.config.ts` — owned by ticket 095.

## Acceptance criteria

1. `curl -sI https://www.atlure.com` returns a `200`.
2. `curl -sI https://atlure.com` returns `308` with a `location` header of `https://www.atlure.com/`.
3. `vercel env ls production` for the project lists `NEXT_PUBLIC_SITE_URL`.

## Blocked by

- 002 Create and clone the four atlure repos
