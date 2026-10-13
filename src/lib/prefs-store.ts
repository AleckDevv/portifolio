import { createContext, useContext, useSyncExternalStore } from "react";

// Preferências do visitante, guardadas só neste navegador.
// Fonte única: os atributos data-tech e data-motion do <html>, aplicados pelo
// script de index.html antes da primeira pintura (o CSS também os usa).
// O React lê esses valores com useSyncExternalStore: na pré-renderização e na
// hidratação vale o padrão; logo depois, o valor real — sem divergências.

export type MotionChoice = "system" | "reduce" | "full";

const TECH_KEY = "aleckdevv:tech";
const MOTION_KEY = "aleckdevv:motion";

const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
function emit() {
  for (const listener of listeners) listener();
}

function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Armazenamento indisponível (modo privado, bloqueio): a preferência vale só nesta visita.
  }
}

export function useTechModeValue(): boolean {
  return useSyncExternalStore(subscribe, () => document.documentElement.dataset.tech === "on", () => false);
}

export function setTechMode(on: boolean) {
  document.documentElement.dataset.tech = on ? "on" : "off";
  writeStorage(TECH_KEY, on ? "on" : "off");
  emit();
}

export function useMotionChoiceValue(): MotionChoice {
  return useSyncExternalStore(
    subscribe,
    () => {
      const value = document.documentElement.dataset.motion;
      return value === "reduce" || value === "full" ? value : "system";
    },
    () => "system" as const,
  );
}

export function setMotionChoice(choice: MotionChoice) {
  if (choice === "system") delete document.documentElement.dataset.motion;
  else document.documentElement.dataset.motion = choice;
  writeStorage(MOTION_KEY, choice);
  emit();
}

/** Acompanha uma media query (false na pré-renderização e na hidratação). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

interface NavigatorHints {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
}

let liteCache: boolean | null = null;
function detectLite(): boolean {
  if (liteCache === null) {
    const nav = navigator as Navigator & NavigatorHints;
    const saveData = nav.connection?.saveData === true;
    const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2;
    const fewCores = typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2;
    liteCache = saveData || lowMemory || fewCores;
  }
  return liteCache;
}

/** Dispositivo com poucos recursos ou economia de dados ativa. */
export function useLiteDevice(): boolean {
  return useSyncExternalStore(
    () => () => {},
    detectLite,
    () => false,
  );
}

export interface Prefs {
  techMode: boolean;
  toggleTechMode: () => void;
  motionChoice: MotionChoice;
  setMotionChoice: (choice: MotionChoice) => void;
  /** true quando as animações devem ser reduzidas (sistema ou escolha no site). */
  reduceMotion: boolean;
  /** Dispositivo com poucos recursos ou economia de dados: desliga efeitos pesados. */
  lite: boolean;
  /** Mouse/trackpad com hover (efeitos que seguem o cursor). */
  finePointer: boolean;
}

export const PrefsContext = createContext<Prefs | null>(null);

export function usePrefs(): Prefs {
  const context = useContext(PrefsContext);
  if (!context) throw new Error("usePrefs precisa estar dentro de <PrefsProvider>.");
  return context;
}

/** Efeitos que seguem o cursor só rodam com mouse, sem movimento reduzido e fora do modo leve. */
export function useCursorEffects(): boolean {
  const { finePointer, reduceMotion, lite } = usePrefs();
  return finePointer && !reduceMotion && !lite;
}
