"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Heart, ShoppingBag } from "lucide-react";
import { Product } from "@/lib/shop/types";
import { CATEGORIES } from "@/lib/shop/mock-data";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { Breadcrumbs } from "./Breadcrumbs";
import { ImageGallery } from "./ImageGallery";
import { ColorSwatchSelector } from "./ColorSwatchSelector";
import { SizeSelector } from "./SizeSelector";
import { PriceBlock } from "./PriceBlock";
import { StarRating } from "./StarRating";
import { CouponTag } from "./CouponTag";
import { ShippingCalculator } from "./ShippingCalculator";
import { SpecsAccordion } from "./SpecsAccordion";
import { ShareActions } from "./ShareActions";
import { ShopButton } from "./ShopButton";
import { StickyAddToCartBar } from "./StickyAddToCartBar";

export function ProductDetailClient({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [size, setSize] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const { isFavorite, toggleFavorite, hydrated } = useFavorites();

  const variant = useMemo(
    () => product.variants.find((v) => v.id === variantId) ?? product.variants[0],
    [product.variants, variantId]
  );

  const category = CATEGORIES.find((c) => c.slug === product.category);
  const favorite = hydrated && isFavorite(product.id);

  function handleAddToCart() {
    if (!size) {
      setFeedback("Escolhe um tamanho antes, hein?");
      return;
    }
    // TODO: quando existir um carrinho global (ex: Context/reducer no
    // cliente, ou POST /api/carrinho no futuro backend Flask), despachar a
    // ação de adicionar aqui. Por enquanto só um feedback local mesmo.
    setFeedback(`Adicionado ao carrinho: ${product.name} (${variant.colorName}, tam. ${size})`);
  }

  return (
    <div className="pb-28 lg:pb-0">
      <div className="~mb-6/8">
        <Breadcrumbs
          items={[
            { label: "Página Inicial", href: "/" },
            { label: category?.pluralName ?? product.category, href: `/categorias/${product.category}` },
            { label: product.name },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr,1fr] lg:items-start">
        <ImageGallery images={variant.images} alt={product.name} category={product.category} />

        <div className="flex flex-col gap-6 lg:sticky lg:top-32">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-zinc-500">{product.subtitle}</p>
            <h1 className="font-sans uppercase leading-tight ~text-2xl/4xl">{product.name}</h1>
            <StarRating rating={product.reviews.average} count={product.reviews.count} />
          </div>

          <PriceBlock
            priceCents={product.priceCents}
            compareAtPriceCents={product.compareAtPriceCents}
            installments={product.installments}
            size="lg"
          />

          {product.couponCode && <CouponTag code={product.couponCode} />}

          <ColorSwatchSelector
            variants={product.variants}
            selectedId={variant.id}
            onSelect={(id) => {
              setVariantId(id);
              setSize(null);
            }}
          />

          <SizeSelector sizes={variant.sizes} selected={size} onSelect={setSize} />

          {feedback && (
            <p role="status" className="text-sm font-medium text-brand-plasma">
              {feedback}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <ShopButton onClick={handleAddToCart} size="lg" className="flex-1">
              <ShoppingBag className="size-5" /> Adicionar ao Carrinho
            </ShopButton>
            <ShopButton
              color="outline"
              size="lg"
              onClick={() => toggleFavorite(product.id)}
              aria-pressed={favorite}
            >
              <Heart className={clsx("size-5", favorite && "fill-brand-plasma text-brand-plasma")} />
              Favoritar
            </ShopButton>
          </div>

          <ShareActions productName={product.name} />

          <ShippingCalculator />

          <SpecsAccordion product={product} />
        </div>
      </div>

      <StickyAddToCartBar priceCents={product.priceCents} onAddToCart={handleAddToCart} />
    </div>
  );
}
