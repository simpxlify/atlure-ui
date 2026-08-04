const MAX_INITIALS = 2;

export function toInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter((namePart) => namePart.length > 0)
    .slice(0, MAX_INITIALS)
    .map((namePart) => namePart[0] ?? "")
    .join("")
    .toUpperCase();
}
