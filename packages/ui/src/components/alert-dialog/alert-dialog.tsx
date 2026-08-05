import { Button } from "../button/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog/dialog";
import { alertDialogConfirmVariant } from "./utils";

export interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
  isConfirmLoading?: boolean;
  className?: string;
}

export function AlertDialog({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  isDestructive = false,
  isConfirmLoading = false,
  className,
}: AlertDialogProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onCancel}
      isDismissible={false}
      accessibilityLabel={title}
      className={className}
    >
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description ? <DialogDescription>{description}</DialogDescription> : null}
      </DialogHeader>
      <DialogFooter>
        <Button label={cancelLabel} variant="outline" onPress={onCancel} />
        <Button
          label={confirmLabel}
          variant={alertDialogConfirmVariant(isDestructive)}
          isLoading={isConfirmLoading}
          onPress={onConfirm}
        />
      </DialogFooter>
    </Dialog>
  );
}
