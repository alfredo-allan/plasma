"use client";

import clsx from "clsx";
import { ActiveFilters, FilterGroup } from "@/lib/shop/types";
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
        <AccordionItem key={group.id} title={group.label}>
          {group.options.length === 0 ? (
            <p className="text-sm text-zinc-400">Nenhuma opção disponível.</p>
          ) : (
            <ul className="space-y-2.5">
              {group.options.map((option) => {
                const checked = active[group.id]?.includes(option.id) ?? false;
                return (
                  <li key={option.id}>
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-700">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggle(group.id, option.id)}
                        className="size-4 rounded-none border-zinc-400 text-brand-plasma focus:ring-brand-plasma"
                      />
                      <span className={clsx(checked && "font-bold text-black")}>
                        {option.label}
                      </span>
                      {typeof option.count === "number" && (
                        <span className="text-zinc-400">({option.count})</span>
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
