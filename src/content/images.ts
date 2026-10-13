// Acesso tipado ao manifesto gerado por scripts/optimize-images.mjs.
// Os IDs ("<slug>/<nome>") são verificados pelo TypeScript: referenciar uma
// imagem inexistente em projects.ts gera erro de compilação.
import manifest from "./images.generated.json";

export type ImageId = keyof typeof manifest;

interface RawEntry {
  w: number;
  h: number;
  o: "demo" | "repo";
  c: string;
  s: number[];
}

export interface ImageEntry {
  width: number;
  height: number;
  /** "demo": capturada na demonstração publicada; "repo": já existia no repositório. */
  origin: "demo" | "repo";
  /** Cor dominante, usada como fundo enquanto a imagem carrega. */
  color: string;
  /** [largura, caminho relativo a public/] */
  avif: Array<[number, string]>;
  webp: Array<[number, string]>;
}

const raw = manifest as unknown as Record<ImageId, RawEntry>;

export function getImage(id: ImageId): ImageEntry {
  const entry = raw[id];
  const list = (format: "avif" | "webp") => entry.s.map((width): [number, string] => [width, `images/${id}-${width}.${format}`]);
  return { width: entry.w, height: entry.h, origin: entry.o, color: entry.c, avif: list("avif"), webp: list("webp") };
}

export function hasImage(id: string): id is ImageId {
  return id in raw;
}
