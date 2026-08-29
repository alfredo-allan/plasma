"use client";

import { useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";

const FAVORITES_KEY = "plasma:favorites";

/**
 * Favoritos persistidos no LocalStorage do navegador - é o exemplo mais
 * direto pedido no briefing de "usar LocalStorage pra otimizar renderização
 * e lidar com interações": o coração de favorito continua marcado mesmo
 * depois de fechar a aba, sem precisar de backend/login pra isso.
 */
export function useFavorites() {
  const [ids, setIds, hydrated] = useLocalStorageState<string[]>(FAVORITES_KEY, []);

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids]);

  const toggleFavorite = useCallback(
    (id: string) => {
      setIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    },
    [setIds]
  );

  return { favoriteIds: ids, isFavorite, toggleFavorite, hydrated };
}
