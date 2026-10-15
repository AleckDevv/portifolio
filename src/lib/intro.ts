// Estado da abertura (src/components/intro/Intro.tsx).
//
// O script inline de index.html decide antes da primeira pintura, no atributo
// data-intro do <html>:
//   "play" → abertura tocando (cada entrada ou recarregamento da página inicial,
//            que também volta ao topo e descarta a âncora do endereço)
//   "skip" → sem abertura (outra página, voltar/avançar no histórico ou
//            movimento reduzido)
//   "done" → abertura terminou (definido pelo componente)
// Sem JavaScript, o atributo não existe e a página aparece direto.

/** Disparado quando a cortina da abertura termina de subir (natural ou pulada). */
export const INTRO_REVEAL = "aleckdevv:intro-reveal";

/** true enquanto a abertura toca nesta carga da página. */
export function introPlaying(): boolean {
  return typeof document !== "undefined" && document.documentElement.dataset.intro === "play";
}
