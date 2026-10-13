import { useMemo, type ReactNode } from "react";
import {
  PrefsContext,
  setMotionChoice,
  setTechMode,
  useLiteDevice,
  useMediaQuery,
  useMotionChoiceValue,
  useTechModeValue,
  type Prefs,
} from "./prefs-store";

export function PrefsProvider({ children }: { children: ReactNode }) {
  const techMode = useTechModeValue();
  const motionChoice = useMotionChoiceValue();
  const systemReduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const lite = useLiteDevice();

  const reduceMotion = motionChoice === "reduce" || (motionChoice === "system" && systemReduce);

  const value = useMemo<Prefs>(
    () => ({
      techMode,
      toggleTechMode: () => setTechMode(!techMode),
      motionChoice,
      setMotionChoice,
      reduceMotion,
      lite,
      finePointer,
    }),
    [techMode, motionChoice, reduceMotion, lite, finePointer],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}
