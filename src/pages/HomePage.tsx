import { Hero } from "../components/hero/Hero";
import { ProjectsSection } from "../components/projects/ProjectsSection";
import { About } from "../components/sections/About";
import { Contact } from "../components/sections/Contact";
import { Evolution } from "../components/sections/Evolution";
import { StackSection } from "../components/sections/StackSection";
import { useSeo } from "../lib/useSeo";

export function HomePage() {
  useSeo("/");
  return (
    <>
      <Hero />
      <ProjectsSection />
      <Evolution />
      <StackSection />
      <About />
      <Contact />
    </>
  );
}
