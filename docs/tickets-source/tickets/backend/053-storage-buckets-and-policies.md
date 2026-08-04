---
id: "053"
title: "Storage buckets: public pet photos and private ID documents"
repo: atlure-api
epic: backend
priority: P0
size: M
serialize: "Yes"
milestone: M3
blocked_by: "048 Schema: sitter profiles / services and availability"
labels: "epic:backend; type:schema; area:storage; area:security; serialize"
---

# Storage buckets: public pet photos and private ID documents

## Context

Sitter verification requires uploading identity documents. Those are the most sensitive data in the product and must live in a **private** bucket with row-level policies, entirely separate from public pet photos. Not having to run infrastructure that touches PII and ID documents was one of the stated reasons for choosing Supabase, so getting these policies right is the whole point.

## Scope

One migration creating buckets and their `storage.objects` policies:

- `pet-photos`: public read, authenticated write, path convention `pets/<pet_id>/<uuid>.<ext>`. Insert allowed only when the authenticated user owns the pet.
- `avatars`: public read, owner-only write, path `avatars/<profile_id>/<uuid>.<ext>`.
- `sitter-documents`: **private**, no public read at all. Path `documents/<profile_id>/<uuid>.<ext>`. Select and insert allowed only for the owning profile. No policy grants read to any other user — verification review happens through the service role only.
- `message-attachments`: private, readable only by the two participants of the owning conversation, derived by parsing the path's conversation id and checking `conversation_participants`.
- `home-photos`: public read for home-boarding listings, owner-only write.
- File size limits and allowed MIME types per bucket, set in bucket config: images only for photo buckets, images plus PDF for documents.
- A `sitter_documents` metadata table recording `profile_id`, `document_kind`, `storage_path`, `review_status`, `reviewed_at`, so review state is queryable without listing the bucket.

## Out of scope

The upload UI (tickets 076 and 090). Any automated identity verification vendor. Virus scanning. Image resizing.

## Files you own

One new timestamped migration and one new pgTAP test file.

## Files you must NOT touch

Any existing migration. Do not add any policy that grants non-owner read on `sitter-documents`.

## Acceptance criteria

1. `supabase db reset` exits 0 and `supabase test db` passes.
2. An integration test with user A's session uploads to `pet-photos` for a pet A owns and succeeds; uploading for a pet B owns returns a 403.
3. An integration test asserts an **anonymous** client fetching a known `sitter-documents` object path returns 400 or 403 and never the file bytes.
4. An integration test asserts user B, authenticated, listing or downloading user A's `sitter-documents` object returns an empty result or an error, never content.
5. An integration test asserts a participant of a conversation can download a `message-attachments` object for it and a non-participant cannot.
6. A pgTAP test asserts each bucket's `public` flag matches the intent: `pet-photos`, `avatars` and `home-photos` true; `sitter-documents` and `message-attachments` false.

## Blocked by

- 048 Schema: sitter profiles / services and availability
