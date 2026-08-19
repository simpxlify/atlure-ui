import {
  forwardRef,
  type ChangeEvent,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '../lib/cn';
import {
  inputVariants,
  textareaVariants,
  type InputVariantProps,
  type TextareaRows,
} from '../variants';
import { useFormFieldControl } from './form-field-context';

type NativeTextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'disabled' | 'required' | 'aria-invalid' | 'aria-labelledby' | 'aria-describedby'
>;

export interface TextareaProps
  extends NativeTextareaProps,
    Pick<InputVariantProps, 'size'> {
  rows?: TextareaRows;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  onChangeText?: (value: string) => void;
  accessibilityLabel?: string;
  testID?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    className,
    size = 'lg',
    rows = 3,
    isDisabled,
    isInvalid,
    isRequired,
    onChange,
    onChangeText,
    accessibilityLabel,
    'aria-label': ariaLabel,
    testID,
    id,
    ...rest
  },
  ref,
) {
  const field = useFormFieldControl();
  const resolvedDisabled = isDisabled ?? field?.isDisabled ?? false;
  const resolvedInvalid = isInvalid ?? field?.isInvalid ?? false;
  const resolvedRequired = isRequired ?? field?.isRequired ?? false;
  const resolvedId = id ?? field?.id;

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChangeText?.(event.target.value);
    onChange?.(event);
  }

  return (
    <textarea
      ref={ref}
      id={resolvedId}
      rows={rows}
      disabled={resolvedDisabled}
      aria-disabled={resolvedDisabled || undefined}
      aria-invalid={resolvedInvalid || undefined}
      aria-required={resolvedRequired || undefined}
      aria-label={ariaLabel ?? accessibilityLabel}
      aria-labelledby={field?.labelledBy}
      aria-describedby={field?.describedBy}
      data-testid={testID}
      onChange={handleChange}
      className={cn(
        inputVariants({ size, isInvalid: resolvedInvalid }),
        textareaVariants({ rows }),
        className,
      )}
      {...rest}
    />
  );
});
