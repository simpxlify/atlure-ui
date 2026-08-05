import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface PortalRegistry {
  activeOverlayId: string | null;
  requestSlot: (id: string) => void;
  releaseSlot: (id: string) => void;
}

const PortalContext = createContext<PortalRegistry | null>(null);

const MISSING_HOST_MESSAGE =
  "No <PortalHost> found. Render <PortalHost> once at the app root, above the navigator, so overlays can queue and paint above the tab bar.";

export function PortalHost({ children }: { children: ReactNode }) {
  const [queuedIds, setQueuedIds] = useState<string[]>([]);

  const requestSlot = useCallback((id: string) => {
    setQueuedIds((currentIds) => (currentIds.includes(id) ? currentIds : [...currentIds, id]));
  }, []);

  const releaseSlot = useCallback((id: string) => {
    setQueuedIds((currentIds) => currentIds.filter((queuedId) => queuedId !== id));
  }, []);

  const registry = useMemo(
    () => ({ activeOverlayId: queuedIds[0] ?? null, requestSlot, releaseSlot }),
    [queuedIds, requestSlot, releaseSlot],
  );

  return <PortalContext.Provider value={registry}>{children}</PortalContext.Provider>;
}

export function usePortalRegistry(): PortalRegistry {
  const registry = useContext(PortalContext);

  if (registry === null) {
    throw new Error(MISSING_HOST_MESSAGE);
  }

  return registry;
}

export function Portal({ children }: { children: ReactNode }) {
  usePortalRegistry();

  return <>{children}</>;
}
