"use client";

import clsx from "clsx";
import { ProductVariant } from "@/lib/shop/types";

type Props = {
  variants: ProductVariant[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function ColorSwatchSelector({ variants, selectedId, onSelect }: Props) {
  const selected = variants.find((v) => v.id === selectedId);

  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-sm text-zinc-500">
        Cor: <span className="font-bold text-black">{selected?.colorName}</span>
      </span>
      <div className="flex flex-wrap gap-2.5">
        {variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => onSelect(variant.id)}
            aria-label={variant.colorName}
            aria-pressed={variant.id === selectedId}
            className={clsx(
              "size-10 rounded-full ring-2 ring-offset-2 transition-transform hover:scale-110",
              variant.id === selectedId ? "ring-brand-plasma" : "ring-transparent"
            )}
            style={{ backgroundColor: variant.colorHex }}
          />
        ))}
      </div>
    </div>
  );
}
