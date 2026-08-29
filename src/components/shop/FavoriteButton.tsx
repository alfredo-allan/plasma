"use client";

import { Heart } from "lucide-react";
import clsx from "clsx";
import { useFavorites } from "@/lib/hooks/useFavorites";

type Props = {
  productId: string;
  className?: string;
  size?: "sm" | "md";
};

export function FavoriteButton({ productId, className, size = "md" }: Props) {
  const { isFavorite, toggleFavorite, hydrated } = useFavorites();
  const active = hydrated && isFavorite(productId);

  return (
    <button
      type="button"
      onClick={(e) => {
        // Evita navegar quando o botão está dentro do <Link> do card do produto.
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(productId);
      }}
      aria-pressed={active}
      aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className={clsx(
        "flex items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-transform hover:scale-110 active:scale-95",
        size === "sm" ? "size-8" : "size-10",
        className
      )}
    >
      <Heart
        className={clsx(
          size === "sm" ? "size-4" : "size-5",
          active ? "fill-brand-plasma text-brand-plasma" : "text-zinc-700"
        )}
      />
    </button>
  );
}
