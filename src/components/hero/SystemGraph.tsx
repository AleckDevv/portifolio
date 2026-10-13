import { useEffect, useRef } from "react";
import { usePrefs } from "../../lib/prefs-store";

// Rede de "sistemas conectados": cada nó é um módulo, regra ou tecnologia que
// existe de verdade nos projetos. Linhas ligam nós próximos e o cursor puxa
// conexões. É decorativo (aria-hidden) e pausa fora da tela.

const LABELS = [
  "estoque",
  "compras",
  "frota",
  "abastecimento",
  "ordens de serviço",
  "fichas IA",
  "matrículas",
  "JWT",
  "Flyway",
  "MySQL",
  "Spring Boot",
  "React",
  "LocalStorage",
  "CSV",
  "Excel",
  "OpenAI",
  "Docker",
  "permissões",
  "relatórios",
  "backup JSON",
];

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  label?: string;
}

/** Gerador pseudoaleatório com semente (layout estável a cada carga). */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function SystemGraph({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { reduceMotion, lite, finePointer } = usePrefs();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const animate = !reduceMotion && !lite;
    const random = seeded(7);
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    let frame: number | null = null;
    let visible = true;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = width < 640 ? 22 : 40;
      const labelled = width < 640 ? 8 : LABELS.length;
      nodes = Array.from({ length: count }, (_, i) => ({
        x: random() * width,
        y: random() * height,
        vx: (random() - 0.5) * 0.22,
        vy: (random() - 0.5) * 0.22,
        r: i < labelled ? 3.2 : 1.6 + random() * 1.4,
        label: i < labelled ? LABELS[i] : undefined,
      }));
    };

    const linkDistance = () => Math.min(190, Math.max(120, width / 8));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const max = linkDistance();
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]!;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]!;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < max) {
            ctx.strokeStyle = `rgba(255,255,255,${0.2 * (1 - d / max)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        if (pointer.active) {
          const d = Math.hypot(a.x - pointer.x, a.y - pointer.y);
          if (d < max * 1.3) {
            ctx.strokeStyle = `rgba(227,255,59,${0.65 * (1 - d / (max * 1.3))})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }
      ctx.font = '500 11px "Martian Mono Variable", ui-monospace, monospace';
      for (const n of nodes) {
        const near = pointer.active && Math.hypot(n.x - pointer.x, n.y - pointer.y) < 110;
        ctx.fillStyle = near ? "#e3ff3b" : n.label ? "#00d1ff" : "rgba(255,255,255,0.55)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, near ? n.r + 1.5 : n.r, 0, Math.PI * 2);
        ctx.fill();
        if (n.label) {
          ctx.fillStyle = near ? "#e3ff3b" : "rgba(255,255,255,0.5)";
          ctx.fillText(n.label, n.x + 8, n.y - 7);
        }
      }
    };

    const tick = () => {
      for (const n of nodes) {
        if (pointer.active) {
          const dx = pointer.x - n.x;
          const dy = pointer.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < 160 && d > 1) {
            n.vx += (dx / d) * 0.012;
            n.vy += (dy / d) * 0.012;
          }
        }
        n.vx *= 0.985;
        n.vy *= 0.985;
        const speed = Math.hypot(n.vx, n.vy);
        if (speed < 0.06) {
          n.vx += (Math.random() - 0.5) * 0.02;
          n.vy += (Math.random() - 0.5) * 0.02;
        }
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.x = Math.min(width, Math.max(0, n.x));
        n.y = Math.min(height, Math.max(0, n.y));
      }
      draw();
      frame = visible ? requestAnimationFrame(tick) : null;
    };

    const start = () => {
      if (animate && frame === null && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
    };

    build();
    draw();

    const resizeObserver = new ResizeObserver(() => {
      build();
      draw();
    });
    resizeObserver.observe(canvas);

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) start();
      else stop();
    });
    intersection.observe(canvas);

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= rect.width && pointer.y <= rect.height;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    if (animate && finePointer) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }
    document.addEventListener("visibilitychange", onVisibility);
    // Redesenha quando a fonte mono terminar de carregar (rótulos).
    document.fonts?.ready.then(draw).catch(() => {});
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduceMotion, lite, finePointer]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
