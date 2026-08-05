import { createContext, useContext, type ReactNode } from "react";

const TextClassContext = createContext<string | undefined>(undefined);

export function TextClassProvider({
  className,
  children,
}: {
  className: string | undefined;
  children: ReactNode;
}) {
  return <TextClassContext.Provider value={className}>{children}</TextClassContext.Provider>;
}

export function useInheritedTextClassName(): string | undefined {
  return useContext(TextClassContext);
}

export { TextClassContext };
