"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

/**
 * Painel deslizante inferior, usado só em telas menores que `lg` (a sidebar
 * de filtros normal assume a partir daí). Serve tanto pra "Filtros" quanto
 * pra "Ordenar" no mobile - ver `CategoryListingClient`.
 */
export function Drawer({ open, onClose, title, children, footer }: Props) {
  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={clsx("fixed inset-0 z-[60] lg:hidden", !open && "pointer-events-none")}
    >
      <div
        onClick={onClose}
        className={clsx(
          "absolute inset-0 bg-black/50 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={clsx(
          "absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl bg-brand-gray shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-stone-300 px-5 py-4">
          <h2 className="font-sans text-lg uppercase">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-full p-1.5 hover:bg-black/5"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && <div className="border-t border-stone-300 px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}
