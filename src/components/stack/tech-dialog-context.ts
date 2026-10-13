import { createContext, useContext } from "react";
import type { TechId } from "../../content/technologies";

export interface TechDialogApi {
  openTech: (id: TechId, trigger?: HTMLElement | null) => void;
}

export const TechDialogContext = createContext<TechDialogApi | null>(null);

export function useTechDialog(): TechDialogApi {
  const context = useContext(TechDialogContext);
  if (!context) throw new Error("useTechDialog precisa estar dentro de <TechDialogProvider>.");
  return context;
}
