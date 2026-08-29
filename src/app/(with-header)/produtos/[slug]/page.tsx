import { notFound } from "next/navigation";
import { Bounded } from "@/components/Bounded";
import { ProductDetailClient } from "@/components/shop/ProductDetailClient";
import { getProductBySlug, listProductSlugs } from "@/lib/shop/api";

type Props = { params: Promise<{ slug: string }> };

export default async function ProdutoPage({ params }: Props) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <Bounded as="main">
      <ProductDetailClient product={product} />
    </Bounded>
  );
}

export async function generateStaticParams() {
  const slugs = await listProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: `${product.name} | Plasma`,
    description: product.description,
  };
}
