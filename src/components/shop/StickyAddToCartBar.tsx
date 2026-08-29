"use client";

import { ShoppingBag } from "lucide-react";
import { formatBRL } from "@/lib/shop/format";
import { ShopButton } from "./ShopButton";

type Props = {
  priceCents: number;
  onAddToCart: () => void;
};

/**
 * Barra fixa no rodapé, só no mobile - opção citada no briefing além do
 * botão "Adicionar ao carrinho" já inline na página. Se preferir só uma das
 * duas versões, é só remover esta ou trocar o `flex` inline por `hidden lg:flex`.
 */
export function StickyAddToCartBar({ priceCents, onAddToCart }: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-stone-300 bg-brand-gray/95 px-5 py-3.5 backdrop-blur lg:hidden">
      <span className="font-bold">{formatBRL(priceCents)}</span>
      <ShopButton onClick={onAddToCart} size="md" className="max-w-[240px] flex-1">
        <ShoppingBag className="size-4" /> Adicionar
      </ShopButton>
    </div>
  );
}
