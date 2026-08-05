import { useContext } from "react";

import {
  MISSING_TOAST_PROVIDER_MESSAGE,
  ToastContext,
  type ToastQueue,
} from "../components/toast/toast-context";

export function useToast(): ToastQueue {
  const queue = useContext(ToastContext);

  if (queue === null) {
    throw new Error(MISSING_TOAST_PROVIDER_MESSAGE);
  }

  return queue;
}
