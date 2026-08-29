"use client";

import { ReactNode, useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

type AccordionItemProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

/**
 * Item de accordion genérico (título + chevron + painel colapsável).
 * Reaproveitado tanto pelos filtros da PLP (`FiltersPanel`) quanto pelas
 * especificações/descrição da PDP (`SpecsAccordion`).
 */
export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  className,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className={clsx("border-b border-stone-300", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-4 py-4 text-left font-sans text-sm uppercase tracking-wide transition-colors hover:text-brand-plasma"
      >
        {title}
        <ChevronDown
          className={clsx(
            "size-4 shrink-0 transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Truque com grid-template-rows pra animar altura "automática" sem medir em JS */}
      <div
        id={panelId}
        className={clsx(
          "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="min-h-0 overflow-hidden pb-4">{children}</div>
      </div>
    </div>
  );
}
