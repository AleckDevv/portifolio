import { useEffect, useLayoutEffect, useState, useSyncExternalStore } from "react";

/** useLayoutEffect no navegador, useEffect no servidor (sem avisos na pré-renderização). */
export const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const noSubscription = () => () => {};

/** false na pré-renderização e na hidratação; true logo depois, no navegador. */
export function useMounted(): boolean {
  return useSyncExternalStore(noSubscription, () => true, () => false);
}

let initialRenderDone = false;

/**
 * false para componentes da primeira renderização da página — hidratando o HTML
 * pré-renderizado ou, no `npm run dev`, renderizando do zero —; true para os
 * montados depois (navegação interna, abas abertas). Diferente de useMounted,
 * não depende de haver hidratação.
 */
export function useBornAfterInitialRender(): boolean {
  const [born] = useState(() => initialRenderDone);
  useEffect(() => {
    initialRenderDone = true;
  }, []);
  return born;
}

export function isModifiedClick(event: React.MouseEvent): boolean {
  return event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}
