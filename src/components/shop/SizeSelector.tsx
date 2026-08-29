"use client";

import clsx from "clsx";
import { SizeOption } from "@/lib/shop/types";

type Props = {
  sizes: SizeOption[];
  selected: string | null;
  onSelect: (label: string) => void;
};

export function SizeSelector({ sizes, selected, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-500">Tamanho</span>
        <button type="button" className="text-sm underline transition-colors hover:text-brand-plasma">
          Tabela de medidas
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-5">
        {sizes.map((size) => (
          <button
            key={size.label}
            type="button"
            disabled={!size.available}
            onClick={() => onSelect(size.label)}
            aria-pressed={selected === size.label}
            className={clsx(
              "rounded-lg border py-2.5 text-sm font-medium transition-colors",
              !size.available && "cursor-not-allowed border-stone-200 text-stone-300 line-through",
              size.available &&
                (selected === size.label
                  ? "border-black bg-black text-white"
                  : "border-stone-300 hover:border-black")
            )}
          >
            {size.label}
          </button>
        ))}
      </div>
    </div>
  );
}
