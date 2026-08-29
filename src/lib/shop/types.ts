/**
 * Tipos do domínio da loja (categorias, produtos, filtros...).
 *
 * De propósito, eles espelham o formato que a futura API em Flask deve
 * devolver — assim, quando o backend (Flask + Flask-Migrate + SQLAlchemy +
 * SQLite) existir de verdade, a ideia é só trocar a implementação de
 * `lib/shop/api.ts` por `fetch()` reais. Os componentes não deveriam
 * precisar mudar.
 *
 * Mapeamento sugerido para os futuros models SQLAlchemy:
 *  Category        -> tabela `categories`
 *  Product          -> tabela `products`            (FK category_id)
 *  ProductVariant   -> tabela `product_variants`     (FK product_id)
 *  ProductVariant.images -> tabela `product_images`  (FK variant_id, ordem)
 *  SizeOption       -> tabela `product_sizes`        (FK variant_id)
 */

export type CategorySlug = "camisetas" | "bermudas" | "calcas" | "moletons";

export interface Category {
  slug: CategorySlug;
  /** Nome no singular - "Camiseta" */
  name: string;
  /** Nome como aparece nos títulos e menus - "Camisetas" */
  pluralName: string;
}

export type Gender = "masculino" | "feminino" | "unissex";

export interface SizeOption {
  /** "P" | "M" | "G" | "GG" ou tamanhos numéricos ("38".."46") */
  label: string;
  available: boolean;
}

export interface ProductVariant {
  id: string;
  colorName: string;
  /** Hex usado no swatch de cor */
  colorHex: string;
  /** Caminhos em `public/assets/products/...` - ver nota no fim do README de entrega */
  images: string[];
  sizes: SizeOption[];
}

export interface ProductReviewSummary {
  /** Média de 0 a 5 */
  average: number;
  count: number;
}

export interface ProductInstallments {
  times: number;
  noInterest: boolean;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  /** Por enquanto igual ao slug; no backend real vira o id numérico da tabela */
  id: string;
  slug: string;
  name: string;
  /** Subtítulo curto exibido abaixo do nome - ex: "Streetwear / Casual" */
  subtitle: string;
  category: CategorySlug;
  gender: Gender;
  /** Nome da coleção/drop, quando o produto pertence a uma - usado no filtro "Coleções" */
  collection?: string;
  description: string;
  specs: ProductSpec[];
  priceCents: number;
  /** Preço "de", quando o produto está com desconto */
  compareAtPriceCents?: number;
  installments?: ProductInstallments;
  couponCode?: string;
  reviews: ProductReviewSummary;
  variants: ProductVariant[];
  /** ISO date - usado para ordenar por "Lançamentos" */
  createdAt: string;
}

export type SortOption =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "discount-desc"
  | "rating-desc"
  | "newest";

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

/** Ids das opções selecionadas, por grupo de filtro */
export interface ActiveFilters {
  [groupId: string]: string[];
}

export interface ShippingOption {
  id: string;
  label: string;
  /** Em centavos - 0 significa frete grátis */
  price: number;
  etaDays: number;
}
