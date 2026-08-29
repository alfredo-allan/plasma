import Link from "next/link";
import clsx from "clsx";
import { Product } from "@/lib/shop/types";
import { discountPercent } from "@/lib/shop/format";
import { ProductImage } from "./ProductImage";
import { FavoriteButton } from "./FavoriteButton";
import { StarRating } from "./StarRating";
import { PriceBlock } from "./PriceBlock";
import { CouponTag } from "./CouponTag";

type Props = { product: Product; className?: string };

/** Card de produto usado na grade da PLP. Leva pra PDP em `/produtos/[slug]`. */
export function ProductCard({ product, className }: Props) {
  const cover = product.variants[0];
  const hoverImage = cover.images[1] ?? cover.images[0];
  const discount = discountPercent(product.priceCents, product.compareAtPriceCents);

  return (
    <Link
      href={`/produtos/${product.slug}`}
      className={clsx("group relative flex flex-col", className)}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200 transition-shadow duration-300 group-hover:shadow-xl group-hover:ring-brand-plasma/40">
        <FavoriteButton
          productId={product.id}
          className="absolute right-3 top-3 z-10"
          size="sm"
        />

        {discount > 0 && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-brand-plasma px-2.5 py-1 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}

        <ProductImage
          category={product.category}
          src={cover.images[0]}
          alt={product.name}
          fill
          sizes="(min-width:1024px) 31vw, 46vw"
          className="object-contain p-6 transition-opacity duration-500 group-hover:opacity-0"
        />
        <ProductImage
          category={product.category}
          src={hoverImage}
          alt=""
          fill
          sizes="(min-width:1024px) 31vw, 46vw"
          className="object-contain p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </div>

      <div className="~mt-3/4 flex flex-1 flex-col gap-1.5">
        <h3 className="line-clamp-2 font-sans text-sm leading-snug ~text-sm/base">
          {product.name}
        </h3>
        <p className="text-xs text-zinc-500">{product.subtitle}</p>
        <StarRating rating={product.reviews.average} count={product.reviews.count} />
        <PriceBlock
          priceCents={product.priceCents}
          compareAtPriceCents={product.compareAtPriceCents}
          size="sm"
        />
        {product.couponCode && <CouponTag code={product.couponCode} />}
      </div>
    </Link>
  );
}
