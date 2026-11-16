"use client";

import { useSyncExternalStore } from "react";
import { createPersistedStore } from "@/lib/createPersistedStore";

/**
 * Linha do carrinho - provisória. Quando portarmos os tipos do backend
 * (Flask), este shape passa a espelhar o `CartItem` da API; por enquanto só
 * `quantity` é usado (contador da navbar).
 */
export interface CartLine {
  productId: string;
  color: string;
  size: string;
  quantity: number;
  /** Preço unitário em centavos */
  priceCents: number;
}

export const cartStore = createPersistedStore<CartLine[]>("plasma:cart", []);

/** Total de itens no carrinho (soma das quantidades), lido do LocalStorage. */
export function useCartCount(): number {
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
  return items.reduce((sum, line) => sum + line.quantity, 0);
}
