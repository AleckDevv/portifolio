import "@fontsource-variable/mona-sans/wdth.css";
import "@fontsource-variable/martian-mono/wdth.css";
import "./styles/global.css";
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./App";
import { basePath } from "./content/site";

const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <BrowserRouter basename={basePath || "/"}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Build: o HTML já vem pré-renderizado → hidrata. Desenvolvimento: renderiza do zero.
if (container.firstElementChild) {
  hydrateRoot(container, app, {
    onRecoverableError: (error) => console.warn("Hidratação recuperada:", error),
  });
} else {
  createRoot(container).render(app);
}
