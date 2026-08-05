import { createContext, useContext, type ReactNode } from "react";

export interface TabsTriggerLayout {
  x: number;
  width: number;
}

export interface TabsControl {
  activeValue: string;
  hasBeenActivated: (value: string) => boolean;
  select: (value: string) => void;
  triggerLayouts: ReadonlyMap<string, TabsTriggerLayout>;
  reportTriggerLayout: (value: string, layout: TabsTriggerLayout) => void;
}

const TabsContext = createContext<TabsControl | undefined>(undefined);

export function TabsProvider({
  control,
  children,
}: {
  control: TabsControl;
  children: ReactNode;
}) {
  return <TabsContext.Provider value={control}>{children}</TabsContext.Provider>;
}

export function useTabsControl(): TabsControl | undefined {
  return useContext(TabsContext);
}

export { TabsContext };
