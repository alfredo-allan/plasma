import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: "orange" | "purple" | "lime" | "outline";
  size?: "sm" | "md" | "lg";
};

/**
 * Mesma linguagem visual do <ButtonLink /> (recorte "button-cutout" +
 * gradiente que "vira" no hover), só que como <button> de verdade - pra
 * ações como "Adicionar ao carrinho", "Calcular frete" ou fechar um drawer,
 * que disparam uma função em vez de navegar pra uma rota.
 */
export function ShopButton({
  color = "purple",
  size = "md",
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      className={clsx(
        "button-cutout inline-flex items-center justify-center gap-2.5 bg-[length:100%_400%] bg-top font-bold transition-[filter,background-position] duration-300 hover:bg-bottom disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" && "px-4 py-2 text-sm",
        size === "md" && "px-5 py-3 text-base",
        size === "lg" && "px-6 py-3.5 text-lg",
        color === "orange" &&
          "bg-gradient-to-b from-brand-orange to-brand-secondary-orange text-black",
        color === "purple" &&
          "bg-gradient-to-b from-brand-plasma to-brand-secondary-orange text-white hover:text-black",
        color === "lime" &&
          "bg-gradient-to-b from-brand-secondary-orange to-brand-orange text-black",
        color === "outline" &&
          "border-2 border-black bg-brand-gray text-black hover:bg-black hover:text-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
