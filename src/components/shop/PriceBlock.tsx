import clsx from "clsx";
import { discountPercent, formatBRL, formatInstallments } from "@/lib/shop/format";
import { ProductInstallments } from "@/lib/shop/types";

type Props = {
  priceCents: number;
  compareAtPriceCents?: number;
  installments?: ProductInstallments;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function PriceBlock({
  priceCents,
  compareAtPriceCents,
  installments,
  size = "md",
  className,
}: Props) {
  const discount = discountPercent(priceCents, compareAtPriceCents);

  return (
    <div className={clsx("flex flex-col gap-0.5", className)}>
      <div className="flex flex-wrap items-baseline gap-2">
        <span
          className={clsx(
            "font-bold",
            size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg"
          )}
        >
          {formatBRL(priceCents)}{" "}
          <span className="text-xs font-normal text-zinc-500">no Pix</span>
        </span>

        {compareAtPriceCents ? (
          <span className="text-sm text-zinc-400 line-through">
            {formatBRL(compareAtPriceCents)}
          </span>
        ) : null}

        {discount > 0 && (
          <span className="text-sm font-bold text-emerald-600">{discount}% off</span>
        )}
      </div>

      {installments && (
        <span className="text-xs text-zinc-500">
          ou {formatInstallments(priceCents, installments.times)}
          {installments.noInterest ? " sem juros" : ""}
        </span>
      )}
    </div>
  );
}
