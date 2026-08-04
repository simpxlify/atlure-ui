import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import {
  inputErrorClassName,
  inputHintClassName,
  inputLabelClassName,
  inputVariants,
  type InputVariantProps,
} from '../variants';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    Omit<InputVariantProps, 'isInvalid'> {
  label?: string;
  hint?: string;
  errorMessage?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, controlSize, label, hint, errorMessage, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const hasError = Boolean(errorMessage);
  const hasVisibleHint = Boolean(hint) && !hasError;
  const describedBy = [hasVisibleHint ? hintId : null, hasError ? errorId : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="flex flex-col gap-xs">
      {label && (
        <label htmlFor={inputId} className={inputLabelClassName}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy || undefined}
        className={cn(inputVariants({ controlSize, isInvalid: hasError }), className)}
        {...props}
      />
      {hasVisibleHint && (
        <p id={hintId} className={inputHintClassName}>
          {hint}
        </p>
      )}
      {hasError && (
        <p id={errorId} role="alert" className={inputErrorClassName}>
          {errorMessage}
        </p>
      )}
    </div>
  );
});
