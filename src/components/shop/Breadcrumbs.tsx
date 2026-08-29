import Link from "next/link";
import { Fragment } from "react";
import { ChevronRight } from "lucide-react";

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-zinc-500">
      {items.map((item, index) => (
        <Fragment key={item.label}>
          {index > 0 && <ChevronRight className="size-3.5 text-zinc-400" />}
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-brand-plasma">
              {item.label}
            </Link>
          ) : (
            <span className="text-zinc-800">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
