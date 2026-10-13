import { useEffect, useLayoutEffect, useSyncExternalStore } from "react";

/** useLayoutEffect no navegador, useEffect no servidor (sem avisos na pré-renderização). */
export const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const noSubscription = () => () => {};

/** false na pré-renderização e na hidratação; true logo depois, no navegador. */
export function useMounted(): boolean {
  return useSyncExternalStore(noSubscription, () => true, () => false);
}

export function isModifiedClick(event: React.MouseEvent): boolean {
  return event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}
