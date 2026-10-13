import { Route, Routes, useLocation } from "react-router";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";
import { SiteFooter } from "./components/layout/SiteFooter";
import { SiteHeader } from "./components/layout/SiteHeader";
import { TechDialogProvider } from "./components/stack/TechDialog";
import { PrefsProvider } from "./lib/prefs";
import { RouteAnnouncer, ScrollManager, TransitionProvider } from "./lib/transition";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProjectPage } from "./pages/ProjectPage";

function AppRoutes() {
  const location = useLocation();
  return (
    // A chave reinicia o tratamento de erro ao trocar de página.
    <ErrorBoundary key={location.pathname}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projetos/:slug" element={<ProjectPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export function App() {
  return (
    <PrefsProvider>
      <TransitionProvider>
        <TechDialogProvider>
          <a
            href="#conteudo"
            className="btn btn-acid sr-only fixed top-3 left-3 z-100 focus:not-sr-only focus:[--focus:var(--color-ink)]"
          >
            Pular para o conteúdo
          </a>
          <SiteHeader />
          <ScrollManager />
          <RouteAnnouncer />
          <main id="conteudo" tabIndex={-1} className="outline-none">
            <AppRoutes />
          </main>
          <SiteFooter />
        </TechDialogProvider>
      </TransitionProvider>
    </PrefsProvider>
  );
}
