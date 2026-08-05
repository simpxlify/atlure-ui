import type { ButtonVariant } from "../button/types";

export function alertDialogConfirmVariant(isDestructive: boolean): ButtonVariant {
  return isDestructive ? "destructive" : "primary";
}
