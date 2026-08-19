import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { formFieldClassName, formFieldMessageVariants } from '../variants';
import { FormFieldProvider } from './form-field-context';
import { Input, type InputProps } from './input';
import { Label } from './label';

interface FormFieldSharedProps {
  label?: string;
  helperText?: string;
  error?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  id?: string;
  testID?: string;
}

export interface FormFieldContainerProps
  extends FormFieldSharedProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'id'> {
  variant?: 'container';
  children: ReactNode;
}

export interface FormFieldInlineProps extends FormFieldSharedProps, Omit<InputProps, 'children'> {
  variant: 'inline';
  inputClassName?: string;
  wrapperClassName?: string;
}

export type FormFieldProps = FormFieldContainerProps | FormFieldInlineProps;

const SHARED_KEYS = new Set([
  'label',
  'helperText',
  'error',
  'isRequired',
  'isDisabled',
  'id',
  'testID',
  'variant',
  'children',
  'className',
]);

export function FormField(props: FormFieldProps) {
  const {
    label,
    helperText,
    error,
    isRequired = false,
    isDisabled = false,
    id,
    testID,
  } = props;

  const generatedId = useId();
  const controlId = id ?? generatedId;
  const labelId = `${controlId}-label`;
  const isInvalid = Boolean(error);
  const message = error ?? helperText;
  const messageId = isInvalid ? `${controlId}-error` : `${controlId}-help`;
  const describedBy = message ? messageId : undefined;

  const wrapperClassName =
    props.variant === 'inline' ? props.wrapperClassName : props.className;
  const outerDivProps = props.variant === 'inline' ? undefined : extractOuterDivProps(props);

  const providedChildren =
    props.variant === 'inline' ? renderInline(props) : props.children;

  return (
    <div
      className={cn(formFieldClassName, wrapperClassName)}
      data-testid={testID}
      {...outerDivProps}
    >
      {label ? (
        <Label
          id={labelId}
          htmlFor={controlId}
          isDisabled={isDisabled}
          isInvalid={isInvalid}
          isRequired={isRequired}
        >
          {label}
        </Label>
      ) : null}
      <FormFieldProvider
        control={{
          id: controlId,
          labelledBy: label ? labelId : undefined,
          describedBy,
          isInvalid,
          isDisabled,
          isRequired,
        }}
      >
        {providedChildren}
      </FormFieldProvider>
      {message ? (
        <p
          id={messageId}
          data-testid={
            testID ? (isInvalid ? `${testID}-error` : `${testID}-help`) : undefined
          }
          role={isInvalid ? 'alert' : undefined}
          className={formFieldMessageVariants({ isInvalid })}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

function extractOuterDivProps(
  props: FormFieldContainerProps,
): Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  const divProps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (!SHARED_KEYS.has(key)) {
      divProps[key] = value;
    }
  }
  return divProps as Omit<HTMLAttributes<HTMLDivElement>, 'className'>;
}

function renderInline(props: FormFieldInlineProps) {
  const { inputClassName } = props;
  const inputProps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (!SHARED_KEYS.has(key) && key !== 'wrapperClassName' && key !== 'inputClassName') {
      inputProps[key] = value;
    }
  }
  return <Input className={inputClassName} {...(inputProps as InputProps)} />;
}
