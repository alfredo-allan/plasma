"use client";

import { useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { useOnClickOutside } from "@/lib/hooks/useOnClickOutside";
import { SortOption } from "@/lib/shop/types";

export const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "relevance", label: "Mais relevantes" },
  { id: "newest", label: "Lançamentos" },
  { id: "discount-desc", label: "Maior desconto" },
  { id: "price-asc", label: "Menor preço" },
  { id: "price-desc", label: "Maior preço" },
  { id: "rating-desc", label: "Melhor avaliação" },
];

type Props = {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
};

/** Dropdown "Ordenar por" - versão desktop, inline no topo da listagem. */
export function SortDropdown({ value, onChange, className }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setOpen(false));

  const current = SORT_OPTIONS.find((o) => o.id === value);

  return (
    <div ref={ref} className={clsx("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand-plasma"
      >
        Ordenar por: <span className="font-bold">{current?.label}</span>
        <ChevronDown className={clsx("size-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-lg border border-stone-300 bg-brand-gray shadow-xl"
        >
          {SORT_OPTIONS.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                role="option"
                aria-selected={option.id === value}
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                className={clsx(
                  "flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm hover:bg-black/5",
                  option.id === value && "font-bold text-brand-plasma"
                )}
              >
                {option.label}
                {option.id === value && <Check className="size-4" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Mesma lista de opções, sem o botão de abrir/fechar - usada dentro do Drawer mobile. */
export function SortOptionsList({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  return (
    <ul className="flex flex-col gap-1">
      {SORT_OPTIONS.map((option) => (
        <li key={option.id}>
          <button
            type="button"
            onClick={() => onChange(option.id)}
            className={clsx(
              "flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm",
              option.id === value
                ? "bg-brand-plasma/10 font-bold text-brand-plasma"
                : "hover:bg-black/5"
            )}
          >
            {option.label}
            {option.id === value && <Check className="size-4" />}
          </button>
        </li>
      ))}
    </ul>
  );
}
