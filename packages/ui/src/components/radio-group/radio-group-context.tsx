import { createContext, useContext } from "react";

export interface RadioGroupControl {
  selectedValue: string | undefined;
  isDisabled: boolean;
  select: (value: string) => void;
  registerValue: (value: string) => () => void;
  selectAdjacent: (fromValue: string, direction: 1 | -1) => void;
}

const RadioGroupContext = createContext<RadioGroupControl | undefined>(undefined);

export function RadioGroupProvider({
  control,
  children,
}: {
  control: RadioGroupControl;
  children: React.ReactNode;
}) {
  return <RadioGroupContext.Provider value={control}>{children}</RadioGroupContext.Provider>;
}

export function useRadioGroupControl(): RadioGroupControl | undefined {
  return useContext(RadioGroupContext);
}

export { RadioGroupContext };
