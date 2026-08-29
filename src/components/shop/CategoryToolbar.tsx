"use client";

import { ArrowUpDown, Share2, SlidersHorizontal } from "lucide-react";
import { Category, SortOption } from "@/lib/shop/types";
import { Heading } from "@/components/Heading";
import { Breadcrumbs } from "./Breadcrumbs";
import { SortDropdown } from "./SortDropdown";

type Props = {
  category: Category;
  total: number;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  onOpenFilters: () => void;
  onOpenSort: () => void;
  onShare: () => void;
};

/** Barra superior de suporte da PLP: breadcrumbs, título+contagem, compartilhar, filtros e ordenação. */
export function CategoryToolbar({
  category,
  total,
  sort,
  onSortChange,
  onOpenFilters,
  onOpenSort,
  onShare,
}: Props) {
  return (
    <div className="~mb-6/8 flex flex-col gap-4">
      <Breadcrumbs
        items={[{ label: "Página Inicial", href: "/" }, { label: category.pluralName }]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Heading as="h1" size="sm">
          {category.pluralName} ({total})
        </Heading>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={onShare}
            className="hidden items-center gap-1.5 text-sm transition-colors hover:text-brand-plasma sm:flex"
          >
            <Share2 className="size-4" /> Compartilhar
          </button>

          <button
            type="button"
            onClick={onOpenFilters}
            className="flex items-center gap-1.5 text-sm transition-colors hover:text-brand-plasma lg:hidden"
          >
            <SlidersHorizontal className="size-4" /> Filtros
          </button>

          <button
            type="button"
            onClick={onOpenSort}
            className="flex items-center gap-1.5 text-sm transition-colors hover:text-brand-plasma lg:hidden"
          >
            <ArrowUpDown className="size-4" /> Ordenar
          </button>

          <SortDropdown value={sort} onChange={onSortChange} className="hidden lg:block" />
        </div>
      </div>
    </div>
  );
}
