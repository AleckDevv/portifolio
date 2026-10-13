import { Component, type ErrorInfo, type ReactNode } from "react";

interface State {
  error: Error | null;
}

/** Evita a tela em branco: mostra uma mensagem e permite recarregar. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Erro na interface:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className="theme-volt flex min-h-svh flex-col items-start justify-center gap-6 px-6 sm:px-14">
        <p className="label text-acid">erro de execução</p>
        <h1 className="wide text-display font-[850] uppercase">Algo quebrou.</h1>
        <p className="max-w-xl text-lead text-white">
          Esta parte da página não carregou corretamente. Recarregar costuma resolver — e o conteúdo principal continua disponível.
        </p>
        <button type="button" className="btn btn-acid" onClick={() => window.location.reload()}>
          Recarregar a página
        </button>
      </div>
    );
  }
}
