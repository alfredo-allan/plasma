import { Category, CategorySlug, FilterGroup, Product } from "./types";
import { slugify } from "./format";

export const CATEGORIES: Category[] = [
  { slug: "camisetas", name: "Camiseta", pluralName: "Camisetas" },
  { slug: "bermudas", name: "Bermuda", pluralName: "Bermudas" },
  { slug: "calcas", name: "Calça", pluralName: "Calças" },
  { slug: "moletons", name: "Blusa de Frio", pluralName: "Blusas de Frio" },
];

/**
 * Enquanto as fotos reais em `public/assets/products/**` não existirem,
 * <ProductImage> cai (via onError) numa dessas imagens - que já existem
 * no projeto - em vez de mostrar um quadrado quebrado.
 * Ver a nota sobre pastas de imagem no fim da resposta.
 */
export const CATEGORY_FALLBACK_IMAGE: Record<CategorySlug, string> = {
  camisetas: "/models/camiseta-bg.webp",
  bermudas: "/models/bermuda-bg.webp",
  calcas: "/models/calca-bg.webp",
  moletons: "/models/moletom-bg.webp",
};

const LETTER_SIZES = ["P", "M", "G", "GG"] as const;
const WAIST_SIZES = ["38", "40", "42", "44", "46"] as const;

function letterSizes(unavailable: string[] = []) {
  return LETTER_SIZES.map((label) => ({
    label,
    available: !unavailable.includes(label),
  }));
}

function waistSizes(unavailable: string[] = []) {
  return WAIST_SIZES.map((label) => ({
    label,
    available: !unavailable.includes(label),
  }));
}

type ProductSeed = {
  slug: string;
  name: string;
  subtitle: string;
  category: CategorySlug;
  gender: Product["gender"];
  collection?: string;
  description: string;
  specs: { label: string; value: string }[];
  priceCents: number;
  compareAtPriceCents?: number;
  couponCode?: string;
  reviews: { average: number; count: number };
  createdAt: string;
  sizeKind: "letter" | "waist";
  colors: {
    name: string;
    hex: string;
    images: [string, string];
    unavailableSizes?: string[];
  }[];
};

function buildProduct(seed: ProductSeed): Product {
  const sizeFn = seed.sizeKind === "letter" ? letterSizes : waistSizes;

  return {
    id: seed.slug,
    slug: seed.slug,
    name: seed.name,
    subtitle: seed.subtitle,
    category: seed.category,
    gender: seed.gender,
    collection: seed.collection,
    description: seed.description,
    specs: seed.specs,
    priceCents: seed.priceCents,
    compareAtPriceCents: seed.compareAtPriceCents,
    installments: { times: 6, noInterest: true },
    couponCode: seed.couponCode,
    reviews: seed.reviews,
    createdAt: seed.createdAt,
    variants: seed.colors.map((color) => ({
      id: `${seed.slug}-${slugify(color.name)}`,
      colorName: color.name,
      colorHex: color.hex,
      // Estrutura real esperada: public/assets/products/<categoria>/<slug>/0N.webp
      images: color.images.map(
        (file) => `/assets/products/${seed.category}/${seed.slug}/${file}`
      ),
      sizes: sizeFn(color.unavailableSizes),
    })),
  };
}

const PRODUCT_SEEDS: ProductSeed[] = [
  // ---------- Camisetas ----------
  {
    slug: "camiseta-plasma-concreto",
    name: "Camiseta Plasma Concreto",
    subtitle: "Streetwear / Casual",
    category: "camisetas",
    gender: "unissex",
    collection: "Concreto SP",
    description:
      "Camiseta 100% algodão penteado, corte reto e estampa inspirada no asfalto da cidade. Feita pra andar de skate e circular pela rua sem perder a atitude.",
    specs: [
      { label: "Material", value: "100% algodão penteado 30.1" },
      { label: "Modelagem", value: "Reta / Unissex" },
      { label: "Estampa", value: "Silk screen" },
      { label: "Origem", value: "Feito em São Paulo" },
    ],
    priceCents: 12990,
    compareAtPriceCents: 16990,
    couponCode: "PLASMA10",
    reviews: { average: 4.7, count: 58 },
    createdAt: "2026-06-01",
    sizeKind: "letter",
    colors: [
      { name: "Preto", hex: "#111111", images: ["01.webp", "02.webp"] },
      {
        name: "Cru",
        hex: "#F3EEE2",
        images: ["01.webp", "02.webp"],
        unavailableSizes: ["P"],
      },
    ],
  },
  {
    slug: "camiseta-plasma-viela",
    name: "Camiseta Plasma Viela",
    subtitle: "Streetwear / Regata",
    category: "camisetas",
    gender: "masculino",
    collection: "Concreto SP",
    description:
      "Regata leve pra rachas de verão, com gola careca reforçada e estampa nas costas em referência às vielas do centro. Tecido que não gruda mesmo suado.",
    specs: [
      { label: "Material", value: "100% algodão fio 30" },
      { label: "Modelagem", value: "Reta / Masculina" },
      { label: "Gola", value: "Careca reforçada" },
    ],
    priceCents: 10990,
    reviews: { average: 4.5, count: 31 },
    createdAt: "2026-04-12",
    sizeKind: "letter",
    colors: [
      { name: "Branco", hex: "#FAFAF7", images: ["01.webp", "02.webp"] },
      {
        name: "Vermelho Plasma",
        hex: "#DD3726",
        images: ["01.webp", "02.webp"],
        unavailableSizes: ["GG"],
      },
    ],
  },
  {
    slug: "camiseta-plasma-corre-sp",
    name: "Camiseta Plasma Corre SP",
    subtitle: "Streetwear / Oversized",
    category: "camisetas",
    gender: "unissex",
    description:
      "Corte oversized, ombro caído e malha mais encorpada - a camiseta que acompanha o corre do dia a dia sem perder o caimento no skate.",
    specs: [
      { label: "Material", value: "100% algodão penteado 24.1" },
      { label: "Modelagem", value: "Oversized" },
      { label: "Estampa", value: "Bordado no peito" },
    ],
    priceCents: 13990,
    reviews: { average: 4.8, count: 76 },
    createdAt: "2026-07-20",
    sizeKind: "letter",
    colors: [
      { name: "Preto", hex: "#111111", images: ["01.webp", "02.webp"] },
      { name: "Azul Plasma", hex: "#2e3192", images: ["01.webp", "02.webp"] },
    ],
  },

  // ---------- Bermudas ----------
  {
    slug: "bermuda-plasma-asfalto",
    name: "Bermuda Plasma Asfalto",
    subtitle: "Skate / Cargo",
    category: "bermudas",
    gender: "masculino",
    collection: "Concreto SP",
    description:
      "Bermuda cargo com bolsos reforçados nas laterais e cós ajustável, pensada pra quem carrega chave allen, celular e ainda quer sobrar espaço pro shape.",
    specs: [
      { label: "Material", value: "Sarja 100% algodão" },
      { label: "Modelagem", value: "Cargo / Reta" },
      { label: "Fechamento", value: "Botão + zíper, cós ajustável" },
    ],
    priceCents: 18990,
    compareAtPriceCents: 22990,
    couponCode: "SPSTREET",
    reviews: { average: 4.6, count: 44 },
    createdAt: "2026-05-02",
    sizeKind: "waist",
    colors: [
      { name: "Preto", hex: "#111111", images: ["01.webp", "02.webp"] },
      {
        name: "Bege",
        hex: "#D8CBB0",
        images: ["01.webp", "02.webp"],
        unavailableSizes: ["38", "46"],
      },
    ],
  },
  {
    slug: "bermuda-plasma-beco",
    name: "Bermuda Plasma Beco",
    subtitle: "Skate / Casual",
    category: "bermudas",
    gender: "masculino",
    description:
      "Bermuda de sarja leve, comprimento no joelho e caimento solto pra não travar o pedal nem o ollie. Básica, com os detalhes Plasma no bolso traseiro.",
    specs: [
      { label: "Material", value: "Sarja leve" },
      { label: "Modelagem", value: "Solta / Comprimento no joelho" },
    ],
    priceCents: 15990,
    reviews: { average: 4.4, count: 22 },
    createdAt: "2026-03-18",
    sizeKind: "waist",
    colors: [
      { name: "Cinza Chumbo", hex: "#4B4B4B", images: ["01.webp", "02.webp"] },
    ],
  },
  {
    slug: "bermuda-plasma-marginal",
    name: "Bermuda Plasma Marginal",
    subtitle: "Skate / Wide",
    category: "bermudas",
    gender: "unissex",
    collection: "Inverno Viaduto",
    description:
      "Modelagem wide inspirada nas curvas da marginal, com abertura maior na barra pra não incomodar o tornozelo em cima do shape.",
    specs: [
      { label: "Material", value: "Sarja 100% algodão" },
      { label: "Modelagem", value: "Wide" },
    ],
    priceCents: 17990,
    reviews: { average: 4.9, count: 63 },
    createdAt: "2026-08-05",
    sizeKind: "waist",
    colors: [
      { name: "Preto", hex: "#111111", images: ["01.webp", "02.webp"] },
      { name: "Cru", hex: "#F3EEE2", images: ["01.webp", "02.webp"] },
    ],
  },

  // ---------- Calças ----------
  {
    slug: "calca-plasma-minhocao",
    name: "Calça Plasma Cargo Minhocão",
    subtitle: "Skate / Cargo",
    category: "calcas",
    gender: "masculino",
    collection: "Concreto SP",
    description:
      "Calça cargo pesada, com reforço interno no joelho pra aguentar queda de flip errado. Referência direta ao minhocão fechado pro lazer aos domingos.",
    specs: [
      { label: "Material", value: "Sarja 100% algodão reforçada" },
      { label: "Modelagem", value: "Cargo / Reta" },
      { label: "Detalhe", value: "Reforço interno no joelho" },
    ],
    priceCents: 24990,
    compareAtPriceCents: 28990,
    couponCode: "PLASMA10",
    reviews: { average: 4.7, count: 39 },
    createdAt: "2026-06-28",
    sizeKind: "waist",
    colors: [
      { name: "Preto", hex: "#111111", images: ["01.webp", "02.webp"] },
      {
        name: "Verde Musgo",
        hex: "#4B5A3C",
        images: ["01.webp", "02.webp"],
        unavailableSizes: ["44", "46"],
      },
    ],
  },
  {
    slug: "calca-plasma-reta-centro",
    name: "Calça Plasma Reta Centro",
    subtitle: "Streetwear / Reta",
    category: "calcas",
    gender: "unissex",
    description:
      "Calça de sarja reta, sem exageros - pensada pra ir do rolê no centro direto pra pista sem trocar de roupa.",
    specs: [
      { label: "Material", value: "Sarja 100% algodão" },
      { label: "Modelagem", value: "Reta" },
    ],
    priceCents: 19990,
    reviews: { average: 4.5, count: 27 },
    createdAt: "2026-02-14",
    sizeKind: "waist",
    colors: [
      { name: "Azul Plasma", hex: "#2e3192", images: ["01.webp", "02.webp"] },
    ],
  },
  {
    slug: "calca-plasma-wide-sp",
    name: "Calça Plasma Wide SP",
    subtitle: "Skate / Wide",
    category: "calcas",
    gender: "unissex",
    collection: "Inverno Viaduto",
    description:
      "Wide fit de cintura média com elástico interno no cós, feita pra acompanhar o giro do corpo em qualquer manobra sem apertar.",
    specs: [
      { label: "Material", value: "Sarja com leve elastano" },
      { label: "Modelagem", value: "Wide / Cintura média" },
    ],
    priceCents: 26990,
    reviews: { average: 4.8, count: 51 },
    createdAt: "2026-07-30",
    sizeKind: "waist",
    colors: [
      { name: "Preto", hex: "#111111", images: ["01.webp", "02.webp"] },
      { name: "Cinza Chumbo", hex: "#4B4B4B", images: ["01.webp", "02.webp"] },
    ],
  },

  // ---------- Moletons / Blusas de frio ----------
  {
    slug: "moletom-plasma-neblina",
    name: "Moletom Plasma Neblina",
    subtitle: "Blusa de Frio / Capuz",
    category: "moletons",
    gender: "unissex",
    collection: "Inverno Viaduto",
    description:
      "Moletom flanelado com capuz forrado, pensado pras madrugadas frias de skate na rua. Peso certo pra esquentar sem pesar no ombro.",
    specs: [
      { label: "Material", value: "Moletom flanelado 320g" },
      { label: "Capuz", value: "Forrado, com cordão" },
      { label: "Bolso", value: "Canguru frontal" },
    ],
    priceCents: 29990,
    compareAtPriceCents: 34990,
    couponCode: "SPSTREET",
    reviews: { average: 4.9, count: 84 },
    createdAt: "2026-06-15",
    sizeKind: "letter",
    colors: [
      { name: "Preto", hex: "#111111", images: ["01.webp", "02.webp"] },
      {
        name: "Cinza Mescla",
        hex: "#B9B9B4",
        images: ["01.webp", "02.webp"],
        unavailableSizes: ["GG"],
      },
    ],
  },
  {
    slug: "moletom-plasma-madrugada",
    name: "Moletom Plasma Madrugada",
    subtitle: "Blusa de Frio / Careca",
    category: "moletons",
    gender: "masculino",
    description:
      "Careca básico de moletom encorpado, gola careca reforçada e ribana nos punhos. Aquele que não sai do guarda-roupa no inverno de São Paulo.",
    specs: [
      { label: "Material", value: "Moletom 280g" },
      { label: "Gola", value: "Careca reforçada" },
    ],
    priceCents: 24990,
    reviews: { average: 4.6, count: 35 },
    createdAt: "2026-05-22",
    sizeKind: "letter",
    colors: [
      { name: "Vermelho Plasma", hex: "#DD3726", images: ["01.webp", "02.webp"] },
    ],
  },
  {
    slug: "moletom-plasma-viaduto",
    name: "Moletom Plasma Viaduto",
    subtitle: "Blusa de Frio / Zíper",
    category: "moletons",
    gender: "unissex",
    collection: "Inverno Viaduto",
    description:
      "Moletom com zíper frontal e bolsos laterais, fácil de tirar e colocar entre uma manobra e outra sem desarrumar o boné.",
    specs: [
      { label: "Material", value: "Moletom flanelado 300g" },
      { label: "Fechamento", value: "Zíper frontal" },
    ],
    priceCents: 27990,
    reviews: { average: 4.5, count: 19 },
    createdAt: "2026-08-10",
    sizeKind: "letter",
    colors: [
      { name: "Cru", hex: "#F3EEE2", images: ["01.webp", "02.webp"] },
      {
        name: "Preto",
        hex: "#111111",
        images: ["01.webp", "02.webp"],
        unavailableSizes: ["P"],
      },
    ],
  },
];

export const MOCK_PRODUCTS: Product[] = PRODUCT_SEEDS.map(buildProduct);

/**
 * Grupos de filtro por categoria. Cada grupo vira um accordion na sidebar
 * (desktop) e no drawer (mobile) - ver <FiltersPanel />. Pra adicionar,
 * remover ou renomear um filtro, mexa só aqui: `FiltersPanel` e
 * `applyFiltersAndSort` (em `api.ts`) leem tudo por `group.id`.
 *
 * Nota: no briefing original (baseado numa referência de loja de tênis) os
 * grupos incluíam "Esportes" e "Marca" - como a Plasma é uma marca única de
 * streetwear (sem multimarcas nem modalidades esportivas), esses dois foram
 * substituídos por "Coleções" (os drops/temáticas, ex: "Concreto SP") e o
 * grupo "Categorias" foi omitido aqui pois cada página já é uma categoria.
 */
function collectionOptions(category: CategorySlug) {
  const names = new Set(
    MOCK_PRODUCTS.filter((p) => p.category === category && p.collection).map(
      (p) => p.collection as string
    )
  );
  return Array.from(names).map((name) => ({ id: slugify(name), label: name }));
}

function colorOptions(category: CategorySlug) {
  const names = new Set(
    MOCK_PRODUCTS.filter((p) => p.category === category).flatMap((p) =>
      p.variants.map((v) => v.colorName)
    )
  );
  return Array.from(names).map((name) => ({ id: slugify(name), label: name }));
}

function buildFilterGroups(
  category: CategorySlug,
  sizeKind: "letter" | "waist"
): FilterGroup[] {
  return [
    {
      id: "genero",
      label: "Gênero",
      options: [
        { id: "masculino", label: "Masculino" },
        { id: "feminino", label: "Feminino" },
        { id: "unissex", label: "Unissex" },
      ],
    },
    {
      id: "tamanho",
      label: "Tamanho",
      options: (sizeKind === "letter" ? LETTER_SIZES : WAIST_SIZES).map(
        (label) => ({ id: label, label })
      ),
    },
    {
      id: "preco",
      label: "Preço",
      options: [
        { id: "ate-150", label: "Até R$ 150" },
        { id: "150-250", label: "R$ 150 a R$ 250" },
        { id: "250-350", label: "R$ 250 a R$ 350" },
        { id: "acima-350", label: "Acima de R$ 350" },
      ],
    },
    { id: "cor", label: "Cores", options: colorOptions(category) },
    { id: "colecao", label: "Coleções", options: collectionOptions(category) },
  ];
}

export const FILTER_GROUPS_BY_CATEGORY: Record<CategorySlug, FilterGroup[]> = {
  camisetas: buildFilterGroups("camisetas", "letter"),
  bermudas: buildFilterGroups("bermudas", "waist"),
  calcas: buildFilterGroups("calcas", "waist"),
  moletons: buildFilterGroups("moletons", "letter"),
};
