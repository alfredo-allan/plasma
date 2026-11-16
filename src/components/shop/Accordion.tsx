"use client";

import { ReactNode, useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

type AccordionItemProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  /** Número exibido ao lado do título (ex.: filtros marcados nesse grupo) */
  badge?: number;
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
  badge,
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
        <span className="flex items-center gap-2">
          {title}
          {!!badge && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-plasma px-1.5 font-mono text-[11px] leading-none text-white">
              {badge}
            </span>
          )}
        </span>
        <ChevronDown
          className={clsx(
            "size-4 shrink-0 transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>

      {/*
        Truque com grid-template-rows pra animar altura "automática" sem medir em JS.
        IMPORTANTE: o filho direto (min-h-0) não pode ter padding - padding não
        encolhe, então com a linha em 0fr sobravam os 16px do `pb-4` mostrando a
        primeira opção cortada em cima da linha. O espaçamento fica no wrapper
        de dentro. `inert` quando fechado: as opções escondidas não recebem foco.
      */}
      <div
        id={panelId}
        inert={!open}
        className={clsx(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-5 pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
