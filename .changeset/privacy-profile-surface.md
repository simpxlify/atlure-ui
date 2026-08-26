---
"@atlure/types": minor
---

Add privacy-first profile fields: User.{bio, phoneCountryCode, phoneNumber} and SitterProfile.{professionalName, avatarUrl, serviceCity, serviceCountryCode}. Rename PublicSitterProfile.displayName -> professionalName so guest reads match the rewritten public_sitter_profiles view (paw #119 / api #40).
