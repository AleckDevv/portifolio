import { useLocation } from "react-router";
import { TransitionLink } from "../../lib/transition";

interface SectionLinkProps {
  id: string;
  label: string;
  className?: string;
  onNavigate?: () => void;
}

/** Na página inicial vira uma âncora nativa; nas outras, volta ao início com transição. */
export function SectionLink({ id, label, className, onNavigate }: SectionLinkProps) {
  const location = useLocation();
  if (location.pathname === "/") {
    return (
      <a href={`#${id}`} className={className} onClick={onNavigate}>
        {label}
      </a>
    );
  }
  return (
    <TransitionLink to={`/#${id}`} label={label} className={className} onClick={onNavigate}>
      {label}
    </TransitionLink>
  );
}
