/**
 * Camada de acesso a dados da loja.
 *
 * Hoje tudo é servido a partir de `mock-data.ts`, mas cada função aqui é
 * `async` e passa por `networkDelay()` de propósito: é o "setup lúdico"
 * simulando os futuros round-trips pra uma API em Flask, algo como:
 *   GET /api/categorias/:slug
 *   GET /api/categorias/:slug/produtos
 *   GET /api/produtos/:slug
 *   GET /api/frete?cep=...
 *
 * Quando o backend em Flask + SQLAlchemy existir, o plano é trocar só o
 * corpo destas funções por `fetch()` reais - as assinaturas (e os tipos em
 * `types.ts`) já foram pensadas pra não precisarem mudar.
 */
import {
  CATEGORIES,
  FILTER_GROUPS_BY_CATEGORY,
  MOCK_PRODUCTS,
} from "./mock-data";
import { discountPercent, slugify } from "./format";
import {
  ActiveFilters,
  Category,
  CategorySlug,
  FilterGroup,
  Product,
  ShippingOption,
  SortOption,
} from "./types";

function networkDelay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isCategorySlug(value: string): value is CategorySlug {
  return CATEGORIES.some((c) => c.slug === value);
}

export async function listCategorySlugs(): Promise<CategorySlug[]> {
  await networkDelay(50);
  return CATEGORIES.map((c) => c.slug);
}

export async function getCategory(slug: string): Promise<Category | null> {
  await networkDelay(150);
  if (!isCategorySlug(slug)) return null;
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export async function getFilterGroups(
  categorySlug: string
): Promise<FilterGroup[]> {
  await networkDelay(150);
  if (!isCategorySlug(categorySlug)) return [];
  return FILTER_GROUPS_BY_CATEGORY[categorySlug] ?? [];
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  await networkDelay(400);
  if (!isCategorySlug(categorySlug)) return [];
  return MOCK_PRODUCTS.filter((p) => p.category === categorySlug);
}

export async function listProductSlugs(): Promise<string[]> {
  await networkDelay(50);
  return MOCK_PRODUCTS.map((p) => p.slug);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await networkDelay(300);
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  await networkDelay(250);
  return MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, limit);
}

/** CEP fake -> opções de frete. Determinístico (mesmo CEP sempre dá o mesmo resultado), só pra parecer real. */
export async function calculateShipping(cep: string): Promise<ShippingOption[]> {
  await networkDelay(600);
  const seed = cep.split("").reduce((sum, digit) => sum + Number(digit), 0);
  const freeShipping = seed % 3 === 0;

  return [
    {
      id: "pac",
      label: "PAC",
      price: freeShipping ? 0 : 1490 + (seed % 5) * 100,
      etaDays: 7 + (seed % 4),
    },
    {
      id: "sedex",
      label: "SEDEX",
      price: 2990 + (seed % 7) * 100,
      etaDays: 2 + (seed % 3),
    },
  ];
}

/**
 * Filtra e ordena uma lista de produtos já carregada.
 *
 * É síncrona e roda no cliente de propósito: assim que a listagem inicial
 * chega do servidor, marcar/desmarcar filtros ou trocar a ordenação não
 * precisa de uma nova ida à "API" - só faz sentido mover isso pro backend
 * quando os filtros virarem de fato querystring de uma rota real
 * (ex: GET /api/produtos?categoria=...&cor=...&tamanho=...).
 */
export function applyFiltersAndSort(
  products: Product[],
  filters: ActiveFilters,
  sort: SortOption
): Product[] {
  let result = products;

  for (const [groupId, selected] of Object.entries(filters)) {
    if (selected.length === 0) continue;
    result = result.filter((product) =>
      matchesFilterGroup(product, groupId, selected)
    );
  }

  return [...result].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.priceCents - b.priceCents;
      case "price-desc":
        return b.priceCents - a.priceCents;
      case "discount-desc":
        return (
          discountPercent(b.priceCents, b.compareAtPriceCents) -
          discountPercent(a.priceCents, a.compareAtPriceCents)
        );
      case "rating-desc":
        return b.reviews.average - a.reviews.average;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "relevance":
      default:
        return 0;
    }
  });
}

function matchesFilterGroup(
  product: Product,
  groupId: string,
  selected: string[]
): boolean {
  switch (groupId) {
    case "genero":
      return selected.includes(product.gender);
    // Não usado nas páginas de categoria atuais (cada uma já é uma
    // categoria só), mas fica pronto pra uma eventual listagem
    // multi-categoria (ex: "/ofertas" ou busca).
    case "categoria":
      return selected.includes(product.category);
    case "colecao":
      return !!product.collection && selected.includes(slugify(product.collection));
    case "cor":
      return product.variants.some((v) => selected.includes(slugify(v.colorName)));
    case "tamanho":
      return product.variants.some((v) =>
        v.sizes.some((s) => s.available && selected.includes(s.label))
      );
    case "preco":
      return selected.some((rangeId) => isInPriceRange(product.priceCents, rangeId));
    default:
      return true;
  }
}

function isInPriceRange(priceCents: number, rangeId: string): boolean {
  const price = priceCents / 100;
  switch (rangeId) {
    case "ate-150":
      return price <= 150;
    case "150-250":
      return price > 150 && price <= 250;
    case "250-350":
      return price > 250 && price <= 350;
    case "acima-350":
      return price > 350;
    default:
      return true;
  }
}
