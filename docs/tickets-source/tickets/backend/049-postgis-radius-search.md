---
id: "049"
title: "PostGIS geography column / GiST index and the sitter radius search RPC"
repo: atlure-api
epic: backend
priority: P0
size: M
serialize: "Yes"
milestone: M3
blocked_by: "048 Schema: sitter profiles / services and availability"
labels: "epic:backend; type:schema; area:postgis; serialize"
---

# PostGIS geography column / GiST index and the sitter radius search RPC

## Context

Radius search is the core of the find-a-sitter flow and one of the main reasons Supabase was chosen over a serverless alternative. It must be `ST_DWithin` on a `geography` column with a GiST index — a naive latitude/longitude bounding box gives wrong distances across Europe and cannot be indexed usefully. The client sends metres, matching the radius slider from ticket 036.

## Scope

One migration:

- Add `location geography(Point, 4326)` to `sitter_profiles`, plus an approximate public `location_city` and `location_postcode` for display, because exact home coordinates must never be returned to a client.
- GiST index on `location`.
- A `search_sitters` SQL function (`security definer`, `stable`) taking `p_lat`, `p_lng`, `p_radius_meters`, optional `p_kinds` array, `p_species`, `p_max_rate_amount`, `p_currency`, `p_min_rating`, plus `p_cursor` and `p_limit`. It returns sitter rows with `distance_meters` computed by `ST_Distance`, filtered by `ST_DWithin(location, ST_MakePoint(p_lng,p_lat)::geography, p_radius_meters)`, ordered by distance then id, with a keyset cursor.
- The function returns `location_city` and `distance_meters` but **never** the raw `location` value.
- A separate `search_sitters_public` variant for the marketing site's indexable city pages, returning only fields safe for anonymous read.
- pgTAP tests seeding sitters at known coordinates.

## Out of scope

Availability-aware filtering by date (that is a booking-conflict query, ticket 050). The client-side search screen (ticket 071). Map rendering.

## Files you own

One new timestamped migration and one new pgTAP test file.

## Files you must NOT touch

Any existing migration. `src/` — the RPC is called directly by clients through Supabase, not proxied by Hono.

## Acceptance criteria

1. `supabase db reset` exits 0 and `select postgis_version();` returns a version.
2. A pgTAP test seeds sitters at exactly 1 km, 4 km, 6 km, 18 km and 25 km from a reference point and asserts `search_sitters` with `p_radius_meters = 5000` returns exactly the first two, and with `20000` returns exactly the first four. Exact set equality, not counts alone.
3. A pgTAP test asserts `distance_meters` for the 4 km sitter is within 50 m of 4000.
4. `explain (analyze, buffers) select * from search_sitters(...)` shows an `Index Scan` using the GiST index and no `Seq Scan` on `sitter_profiles`, asserted by a test grepping the plan text.
5. A pgTAP test asserts the returned column list of both functions does not include `location`.
6. A pgTAP test asserts paging with `p_limit = 2` and the returned cursor yields the next two rows with no duplicates and no gaps across the full result set.

## Blocked by

- 048 Schema: sitter profiles / services and availability
