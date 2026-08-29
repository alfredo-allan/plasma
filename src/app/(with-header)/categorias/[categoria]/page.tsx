import { notFound } from "next/navigation";
import { Bounded } from "@/components/Bounded";
import { CategoryListingClient } from "@/components/shop/CategoryListingClient";
import {
  getCategory,
  getFilterGroups,
  getProductsByCategory,
  listCategorySlugs,
} from "@/lib/shop/api";

type Props = { params: Promise<{ categoria: string }> };

export default async function CategoriaPage({ params }: Props) {
  const { categoria } = await params;

  const category = await getCategory(categoria);
  if (!category) notFound();

  const [products, filterGroups] = await Promise.all([
    getProductsByCategory(categoria),
    getFilterGroups(categoria),
  ]);

  return (
    <Bounded as="main">
      <CategoryListingClient
        category={category}
        initialProducts={products}
        filterGroups={filterGroups}
      />
    </Bounded>
  );
}

export async function generateStaticParams() {
  const slugs = await listCategorySlugs();
  return slugs.map((categoria) => ({ categoria }));
}

export async function generateMetadata({ params }: Props) {
  const { categoria } = await params;
  const category = await getCategory(categoria);
  if (!category) return {};

  return {
    title: `${category.pluralName} | Plasma`,
    description: `Confira nossa coleção de ${category.pluralName.toLowerCase()} Plasma.`,
  };
}
