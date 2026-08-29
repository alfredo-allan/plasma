"use client";

import { useMemo, useState } from "react";
import { ActiveFilters, Category, FilterGroup, Product, SortOption } from "@/lib/shop/types";
import { applyFiltersAndSort } from "@/lib/shop/api";
import { CategoryToolbar } from "./CategoryToolbar";
import { FiltersPanel } from "./FiltersPanel";
import { ProductGrid } from "./ProductGrid";
import { Drawer } from "./Drawer";
import { SortOptionsList } from "./SortDropdown";
import { ShopButton } from "./ShopButton";

type Props = {
  category: Category;
  initialProducts: Product[];
  filterGroups: FilterGroup[];
};

type OpenDrawer = "filters" | "sort" | null;

/**
 * Orquestra a página de listagem por categoria (PLP): estado dos filtros
 * ativos, ordenação escolhida e qual drawer mobile está aberto. Os dados
 * iniciais (`initialProducts`, `filterGroups`) já chegam prontos do server
 * component da rota - ver `app/(with-header)/categorias/[categoria]/page.tsx`.
 */
export function CategoryListingClient({ category, initialProducts, filterGroups }: Props) {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [sort, setSort] = useState<SortOption>("relevance");
  const [openDrawer, setOpenDrawer] = useState<OpenDrawer>(null);

  const products = useMemo(
    () => applyFiltersAndSort(initialProducts, activeFilters, sort),
    [initialProducts, activeFilters, sort]
  );

  function toggleFilter(groupId: string, optionId: string) {
    setActiveFilters((prev) => {
      const current = prev[groupId] ?? [];
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { ...prev, [groupId]: next };
    });
  }

  function clearFilters() {
    setActiveFilters({});
  }

  async function handleShare() {
    if (typeof window === "undefined") return;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: category.pluralName, url });
      } catch {
        // usuário cancelou o share nativo - sem problema
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
  }

  return (
    <div className="~pb-16/24">
      <CategoryToolbar
        category={category}
        total={products.length}
        sort={sort}
        onSortChange={setSort}
        onOpenFilters={() => setOpenDrawer("filters")}
        onOpenSort={() => setOpenDrawer("sort")}
        onShare={handleShare}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px,1fr]">
        <aside className="hidden lg:block">
          <FiltersPanel
            groups={filterGroups}
            active={activeFilters}
            onToggle={toggleFilter}
            onClear={clearFilters}
          />
        </aside>

        <ProductGrid products={products} />
      </div>

      <Drawer
        open={openDrawer === "filters"}
        onClose={() => setOpenDrawer(null)}
        title="Filtros"
        footer={
          <ShopButton onClick={() => setOpenDrawer(null)} className="w-full" size="md">
            Ver {products.length} resultado{products.length === 1 ? "" : "s"}
          </ShopButton>
        }
      >
        <FiltersPanel
          groups={filterGroups}
          active={activeFilters}
          onToggle={toggleFilter}
          onClear={clearFilters}
        />
      </Drawer>

      <Drawer open={openDrawer === "sort"} onClose={() => setOpenDrawer(null)} title="Ordenar por">
        <SortOptionsList
          value={sort}
          onChange={(value) => {
            setSort(value);
            setOpenDrawer(null);
          }}
        />
      </Drawer>
    </div>
  );
}
