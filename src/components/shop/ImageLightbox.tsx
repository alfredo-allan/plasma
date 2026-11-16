"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import clsx from "clsx";
import { CategorySlug } from "@/lib/shop/types";
import { ProductImage } from "./ProductImage";

type Props = {
  open: boolean;
  images: string[];
  index: number;
  alt: string;
  category: CategorySlug;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

const ZOOM = 2.2;
/** px de arrasto horizontal pra contar como swipe */
const SWIPE_THRESHOLD = 50;

/**
 * Visualização ampliada da foto do produto (todas as telas).
 *
 * - Fundo escuro com desfoque; a foto ocupa quase a tela toda.
 * - Navegação: setas, teclado (← → Esc), swipe no celular e miniaturas.
 * - Zoom: clique/toque na foto aproxima no ponto clicado; com zoom, mover
 *   o mouse (ou arrastar o dedo) passeia pela foto - bom pra ver estampa e
 *   costura. Outro clique/toque volta ao normal.
 * - Fecha com X, Esc ou clique no fundo. Trava a rolagem da página e
 *   devolve o foco pra onde estava ao fechar.
 *
 * Renderizado via portal no <body> pra ficar acima de tudo (header,
 * navbar flutuante, gavetas).
 */
export function ImageLightbox({ open, images, index, alt, category, onIndexChange, onClose }: Props) {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const closeRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number; moved: boolean } | null>(null);

  const total = images.length;
  const go = (delta: number) => {
    if (total < 2) return;
    setZoomed(false);
    onIndexChange((index + delta + total) % total);
  };

  // refs com a versão mais recente das ações, pro listener de teclado
  const goRef = useRef(go);
  goRef.current = go;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // abriu: trava rolagem, foca o "fechar"; fechou: devolve o foco
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCloseRef.current();
      if (e.key === "ArrowRight") goRef.current(1);
      if (e.key === "ArrowLeft") goRef.current(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      previousFocus?.focus?.();
    };
  }, [open]);

  // ao fechar, sempre volta sem zoom
  useEffect(() => {
    if (!open) setZoomed(false);
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  function originFrom(e: React.PointerEvent) {
    const rect = stageRef.current!.getBoundingClientRect();
    return {
      x: Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)),
      y: Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100)),
    };
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} - foto ampliada`}
      className="lightbox-in fixed inset-0 z-[80] flex flex-col bg-black/85 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* topo: contador + ações */}
      <div className="pointer-events-none flex items-center justify-between px-4 py-3 text-white sm:px-6 sm:py-4">
        <span className="font-mono text-sm tabular-nums text-white/70">
          {index + 1} / {total}
        </span>
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoomed((z) => !z)}
            aria-label={zoomed ? "Diminuir zoom" : "Aumentar zoom"}
            className="grid size-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
          >
            {zoomed ? <ZoomOut className="size-5" /> : <ZoomIn className="size-5" />}
          </button>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="grid size-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* foto */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          ref={stageRef}
          className={clsx(
            "lightbox-img-in relative h-full max-h-[min(85dvh,1100px)] w-full max-w-5xl overflow-hidden rounded-xl bg-white",
            zoomed ? "cursor-zoom-out touch-none" : "cursor-zoom-in",
          )}
          onPointerDown={(e) => {
            swipe.current = { x: e.clientX, y: e.clientY, moved: false };
          }}
          onPointerMove={(e) => {
            const s = swipe.current;
            if (s && (Math.abs(e.clientX - s.x) > 8 || Math.abs(e.clientY - s.y) > 8)) s.moved = true;
            // com zoom: mouse passeando (ou dedo arrastando) move o ponto de foco
            if (zoomed && (e.pointerType === "mouse" || s)) setOrigin(originFrom(e));
          }}
          onPointerUp={(e) => {
            const s = swipe.current;
            swipe.current = null;
            if (!s) return;
            const dx = e.clientX - s.x;
            if (!zoomed && total > 1 && Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(e.clientY - s.y)) {
              go(dx < 0 ? 1 : -1);
              return;
            }
            if (!s.moved) {
              // toque/clique simples: liga/desliga zoom no ponto tocado
              setOrigin(originFrom(e));
              setZoomed((z) => !z);
            }
          }}
          onPointerCancel={() => (swipe.current = null)}
        >
          <div
            className="absolute inset-0 transition-transform duration-300 ease-out"
            style={{
              transform: `scale(${zoomed ? ZOOM : 1})`,
              transformOrigin: `${origin.x}% ${origin.y}%`,
            }}
          >
            <ProductImage
              key={images[index]}
              category={category}
              src={images[index]}
              alt={`${alt} - foto ${index + 1}`}
              fill
              sizes="(min-width:1024px) 1024px, 100vw"
              quality={90}
              draggable={false}
              className="select-none object-contain p-4 sm:p-8"
              priority
            />
          </div>
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 hidden -translate-y-1/2 place-items-center rounded-full bg-white p-3 text-black shadow-lg transition-transform hover:scale-110 sm:grid"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Próxima foto"
              className="absolute right-2 top-1/2 hidden -translate-y-1/2 place-items-center rounded-full bg-white p-3 text-black shadow-lg transition-transform hover:scale-110 sm:grid"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
      </div>

      {/* miniaturas */}
      {total > 1 && (
        <div className="flex justify-center gap-2 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3 sm:gap-3 sm:pb-6">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => {
                setZoomed(false);
                onIndexChange(i);
              }}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === index}
              className={clsx(
                "relative size-12 overflow-hidden rounded-lg bg-white transition-all sm:size-16",
                i === index ? "ring-2 ring-brand-plasma ring-offset-2 ring-offset-black" : "opacity-50 hover:opacity-100",
              )}
            >
              <ProductImage category={category} src={src} alt="" fill sizes="64px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}
