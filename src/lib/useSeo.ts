import { useEffect } from "react";
import { applySeo, seoForPath } from "./seo";

/** Mantém título e metadados atualizados durante a navegação no navegador. */
export function useSeo(pathname: string) {
  useEffect(() => {
    applySeo(seoForPath(pathname));
  }, [pathname]);
}
