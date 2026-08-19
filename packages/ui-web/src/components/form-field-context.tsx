import { createContext, useContext, type ReactNode } from 'react';

export interface FormFieldControl {
  id: string;
  labelledBy: string | undefined;
  describedBy: string | undefined;
  isInvalid: boolean;
  isDisabled: boolean;
  isRequired: boolean;
}

const FormFieldContext = createContext<FormFieldControl | undefined>(undefined);

export function FormFieldProvider({
  control,
  children,
}: {
  control: FormFieldControl;
  children: ReactNode;
}) {
  return <FormFieldContext.Provider value={control}>{children}</FormFieldContext.Provider>;
}

export function useFormFieldControl(): FormFieldControl | undefined {
  return useContext(FormFieldContext);
}

export { FormFieldContext };
