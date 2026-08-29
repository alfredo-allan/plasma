import { Star } from "lucide-react";
import clsx from "clsx";

type Props = {
  /** 0 a 5 */
  rating: number;
  count?: number;
  className?: string;
};

export function StarRating({ rating, count, className }: Props) {
  return (
    <div className={clsx("flex items-center gap-1.5", className)}>
      <div className="flex" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = rating >= i + 1;
          const half = !filled && rating > i && rating < i + 1;
          return (
            <Star
              key={i}
              className={clsx(
                "size-3.5",
                filled
                  ? "fill-current text-amber-500"
                  : half
                  ? "fill-current text-amber-500/50"
                  : "text-zinc-300"
              )}
            />
          );
        })}
      </div>
      <span className="rounded border border-zinc-300 px-1.5 text-xs font-medium text-zinc-600">
        {rating.toFixed(1)}
      </span>
      {typeof count === "number" && (
        <span className="text-xs text-zinc-500">({count})</span>
      )}
    </div>
  );
}
