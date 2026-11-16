"use client";

import clsx from "clsx";
import { ActiveFilters, FilterGroup } from "@/lib/shop/types";
import { Check } from "lucide-react";
import { AccordionItem } from "./Accordion";

type Props = {
  groups: FilterGroup[];
  active: ActiveFilters;
  onToggle: (groupId: string, optionId: string) => void;
  onClear?: () => void;
};

/**
 * Sanfona de filtros (Gênero, Tamanho, Preço, Cores, Coleções...), definida
 * em `mock-data.ts` -> `FILTER_GROUPS_BY_CATEGORY`. Renderizada tanto na
 * sidebar fixa do desktop quanto dentro do <Drawer /> no mobile - o mesmo
 * componente, só o container ao redor muda.
 */
export function FiltersPanel({ groups, active, onToggle, onClear }: Props) {
  const activeCount = Object.values(active).reduce((n, arr) => n + arr.length, 0);

  return (
    <div>
      {activeCount > 0 && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="mb-4 text-sm font-medium text-brand-plasma underline"
        >
          Limpar filtros ({activeCount})
        </button>
      )}

      {groups.map((group) => (
        <AccordionItem key={group.id} title={group.label} badge={active[group.id]?.length}>
          {group.options.length === 0 ? (
            <p className="text-sm text-zinc-400">Nenhuma opção disponível.</p>
          ) : (
            <ul className="space-y-1">
              {group.options.map((option) => {
                const checked = active[group.id]?.includes(option.id) ?? false;
                return (
                  <li key={option.id}>
                    <label className="group flex cursor-pointer items-center gap-3 py-1.5 text-sm text-zinc-700 transition-colors hover:text-black">
                      {/* Checkbox da marca: quadrado com borda preta e sombra dura
                          (mesma linguagem dos botões); marcado = vermelho plasma */}
                      <span className="relative grid size-5 shrink-0 place-items-center">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggle(group.id, option.id)}
                          className="peer size-5 cursor-pointer appearance-none border-2 border-black bg-white shadow-[2px_2px_0_#000] transition-[background-color,box-shadow,transform] duration-150 checked:bg-brand-plasma group-hover:shadow-[3px_3px_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-plasma"
                        />
                        <Check
                          aria-hidden
                          strokeWidth={3.5}
                          className="pointer-events-none absolute size-3.5 scale-50 text-white opacity-0 transition-[opacity,transform] duration-150 peer-checked:scale-100 peer-checked:opacity-100"
                        />
                      </span>
                      <span className={clsx(checked && "font-bold text-black")}>
                        {option.label}
                      </span>
                      {typeof option.count === "number" && (
                        <span className="ml-auto text-xs text-zinc-400">{option.count}</span>
                      )}
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </AccordionItem>
      ))}
    </div>
  );
}
