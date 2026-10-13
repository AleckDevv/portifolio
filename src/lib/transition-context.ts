import { createContext, useContext } from "react";

export interface TransitionApi {
  /** Navega com a transição de página (cortina). */
  go: (to: string, label?: string) => void;
}

export const TransitionContext = createContext<TransitionApi | null>(null);

export function useTransitionNav(): TransitionApi {
  const context = useContext(TransitionContext);
  if (!context) throw new Error("useTransitionNav precisa estar dentro de <TransitionProvider>.");
  return context;
}
