export type ErrorCode =
  | "not-found"
  | "unauthenticated"
  | "forbidden"
  | "validation-failed"
  | "conflict"
  | "rate-limited"
  | "unavailable"
  | "timed-out"
  | "cancelled"
  | "unknown";

export interface ResultError {
  code: ErrorCode;
  message: string;
  fieldErrors?: Readonly<Record<string, string>>;
}

export type Result<TValue> =
  | { readonly isOk: true; readonly value: TValue }
  | { readonly isOk: false; readonly error: ResultError };

export function errorMessageKey(code: ErrorCode): string {
  return `errors.${code}`;
}
