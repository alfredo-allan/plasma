"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import clsx from "clsx";
import { CategorySlug } from "@/lib/shop/types";
import { ImageLightbox } from "./ImageLightbox";
import { ProductImage } from "./ProductImage";

type Props = {
  images: string[];
  alt: string;
  category: CategorySlug;
};

/**
 * Galeria da PDP: no mobile é um carrossel com swipe (scroll-snap nativo) e
 * bolinhas indicadoras; no desktop é imagem grande + trilha de thumbnails
 * na lateral. Os dois compartilham o mesmo estado de índice selecionado.
 *
 * Clicar/tocar na foto abre a <ImageLightbox/> (foto ampliada com zoom),
 * que também usa esse mesmo índice - fechou, a galeria está na mesma foto.
 */
export function ImageGallery({ images, alt, category }: Props) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  function goTo(nextIndex: number) {
    setIndex((nextIndex + images.length) % images.length);
  }

  function onTrackScroll() {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }

  function scrollToSlide(i: number, behavior: ScrollBehavior = "smooth") {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior });
  }

  // navegou dentro da foto ampliada -> carrossel do mobile acompanha
  function onLightboxIndexChange(i: number) {
    setIndex(i);
    scrollToSlide(i, "instant");
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row-reverse lg:gap-6">
      <div className="lg:flex-1">
        {/* Carrossel com swipe - só mobile/tablet */}
        <div className="relative lg:hidden">
        <div
          ref={trackRef}
          onScroll={onTrackScroll}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-2xl bg-white ring-1 ring-stone-200 lg:hidden [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label={`Ampliar foto ${i + 1}`}
              className="relative aspect-square w-full shrink-0 snap-center"
            >
              <ProductImage
                category={category}
                src={src}
                alt={`${alt} - foto ${i + 1}`}
                fill
                sizes="100vw"
                className="object-contain p-6"
              />
            </button>
          ))}
        </div>
          {/* dica de "toque pra ampliar" */}
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-black/70 text-white"
          >
            <Expand className="size-4" />
          </span>
        </div>

        {images.length > 1 && (
          <div className="mt-3 flex items-center justify-center gap-1.5 lg:hidden">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ver foto ${i + 1}`}
                onClick={() => scrollToSlide(i)}
                className={clsx(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-6 bg-brand-plasma" : "w-1.5 bg-stone-300"
                )}
              />
            ))}
          </div>
        )}

        {/* Imagem grande - só desktop */}
        <div className="group relative hidden aspect-square overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200 lg:block">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="Ampliar foto"
            className="absolute inset-0 cursor-zoom-in"
          >
            <ProductImage
              category={category}
              src={images[index]}
              alt={alt}
              fill
              sizes="(min-width:1024px) 55vw, 100vw"
              className="object-contain p-10 transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </button>

          {/* dica de "ampliar" */}
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Expand className="size-3.5" /> Ampliar
          </span>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                aria-label="Foto anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow transition-transform hover:scale-110"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                aria-label="Próxima foto"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow transition-transform hover:scale-110"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {images.length > 1 && (
        <div className="hidden shrink-0 gap-3 lg:flex lg:w-24 lg:flex-col">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Selecionar foto ${i + 1}`}
              aria-current={i === index}
              className={clsx(
                "relative aspect-square overflow-hidden rounded-xl bg-white ring-1 transition-all",
                i === index ? "ring-2 ring-brand-plasma" : "ring-stone-200 hover:ring-stone-400"
              )}
            >
              <ProductImage category={category} src={src} alt="" fill sizes="96px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}

      <ImageLightbox
        open={lightboxOpen}
        images={images}
        index={index}
        alt={alt}
        category={category}
        onIndexChange={onLightboxIndexChange}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
