import clsx from "clsx";
import { SVGProps } from "react";
import { Logo } from "./Logo";
import { SYMBOL_VIEWBOX } from "./logoPaths";

/**
 * Só o símbolo vermelho da marca (o "asterisco" do logo Plasma), sem o
 * texto "plasma". Reaproveita o mesmo SVG do <Logo/> - apenas recorta o
 * viewBox em volta do símbolo e esconde o path do texto - pra nunca
 * existirem duas cópias do logo para manter.
 */
export function LogoMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <Logo
      viewBox={SYMBOL_VIEWBOX}
      width={undefined}
      height={undefined}
      aria-hidden
      className={clsx("[&_g>path:first-child]:hidden", className)}
      {...props}
    />
  );
}
