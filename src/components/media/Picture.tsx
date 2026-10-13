import { useEffect, useRef, useState, type CSSProperties } from "react";
import { getImage, type ImageId } from "../../content/images";
import { asset } from "../../content/site";

interface PictureProps {
  id: ImageId;
  alt: string;
  /** Atributo sizes (ex.: "(min-width: 1024px) 60vw, 100vw"). */
  sizes: string;
  /** Imagem acima da dobra: carregamento imediato e prioridade alta. */
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  imgStyle?: CSSProperties;
}

function srcSet(list: Array<[number, string]>): string {
  return list.map(([width, path]) => `${asset(path)} ${width}w`).join(", ");
}

/** Imagem responsiva (AVIF + WebP) com dimensões explícitas e cor de fundo enquanto carrega. */
export function Picture({ id, alt, sizes, priority = false, className, imgClassName, imgStyle }: PictureProps) {
  const image = getImage(id);
  const imgRef = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  // Erros que acontecem antes da hidratação não disparam onError no React.
  useEffect(() => {
    const element = imgRef.current;
    if (element && element.complete && element.naturalWidth === 0) setFailed(true);
  }, []);

  const fallback = image.webp[Math.min(1, image.webp.length - 1)]!;

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-paper-deep p-6 text-center ${className ?? ""}`}
        style={{ aspectRatio: `${image.width} / ${image.height}` }}
      >
        <span className="label text-ink-soft">Imagem indisponível no momento</span>
      </div>
    );
  }

  return (
    <picture className={className} style={{ display: "block", backgroundColor: image.color }}>
      <source type="image/avif" srcSet={srcSet(image.avif)} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(image.webp)} sizes={sizes} />
      <img
        ref={imgRef}
        src={asset(fallback[1])}
        alt={alt}
        width={image.width}
        height={image.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onError={() => setFailed(true)}
        className={imgClassName ?? "h-auto w-full"}
        style={imgStyle}
      />
    </picture>
  );
}
