"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Info, Shirt, ShoppingCart, type LucideIcon } from "lucide-react";

import { useScrolledPast } from "@/lib/hooks/useScrolledPast";
import { FLOATING_NAV_SCROLL_THRESHOLD } from "@/lib/layoutConstants";
import { useCartCount } from "@/lib/shop/cart";
import { Logo } from "./Logo";
import { LogoMark } from "./LogoMark";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Rotas que também deixam este item "ativo" */
  match: (pathname: string) => boolean;
};

// Mesmos links do <Header/>
const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: House, match: (p) => p === "/" },
  {
    label: "Produtos",
    href: "/produtos",
    icon: Shirt,
    match: (p) => p.startsWith("/produtos") || p.startsWith("/categorias"),
  },
  { label: "Sobre", href: "/sobre", icon: Info, match: (p) => p.startsWith("/sobre") },
  // Contato removido da navbar. Pra voltar: importe `MessageCircle` do lucide-react e descomente.
  // { label: "Contato", href: "/contato", icon: MessageCircle, match: (p) => p.startsWith("/contato") },
];

const CART_HREF = "/carrinho";

/**
 * Navbar flutuante INFERIOR, estilo app Android moderno (Material 3), com o
 * mesmo conteúdo do <Header/>: logo, links e carrinho.
 *
 * Comportamento herdado do FloatingDock do Scathon: fica escondida no topo
 * da página e "sobe" assim que a rolagem passa de
 * FLOATING_NAV_SCROLL_THRESHOLD (quando o header do topo já saiu da tela).
 *
 *  - Mobile (< sm): barra de abas uniforme - TODOS os itens (inclusive o
 *    carrinho) têm o mesmo formato: ícone dentro da "pílula" + rótulo
 *    embaixo. Só o item ativo ganha a pílula vermelha, então nunca há dois
 *    itens parecendo selecionados ao mesmo tempo, e tudo fica alinhado na
 *    mesma linha. O símbolo da marca faz as vezes do ícone de Home.
 *  - Tablet/Desktop (sm+): logo completo à esquerda, links em linha (ícone +
 *    texto) no meio e o botão vermelho "Cart (N)" à direita.
 *
 * Nas páginas de produto, no mobile, ela some: ali a <StickyAddToCartBar/>
 * ocupa o rodapé (mesmo padrão dos apps de loja nativos).
 */
export function FloatingNav() {
  const pathname = usePathname() ?? "/";
  const isVisible = useScrolledPast(FLOATING_NAV_SCROLL_THRESHOLD);
  const cartCount = useCartCount();
  const isProductPage = /^\/produtos\/[^/]+/.test(pathname);
  const cartLabel = `Carrinho, ${cartCount} ${cartCount === 1 ? "item" : "itens"}`;

  return (
    <nav
      aria-label="Navegação rápida"
      aria-hidden={!isVisible}
      // `inert` tira tudo de dentro do foco/clique enquanto está escondida
      inert={!isVisible}
      className={clsx(
        "fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 transition-[transform,opacity] duration-300 ease-out",
        "pb-[calc(env(safe-area-inset-bottom)+0.75rem)] sm:px-6 sm:pb-[calc(env(safe-area-inset-bottom)+1.25rem)]",
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[130%] opacity-0",
        isProductPage && "max-lg:hidden",
      )}
    >
      <div className="flex w-full max-w-md items-center rounded-[1.75rem] border-2 border-black bg-brand-gray/95 px-1 py-2 shadow-[5px_5px_0_#000] backdrop-blur-md sm:max-w-3xl sm:gap-2 sm:rounded-full sm:py-2 sm:pl-5 sm:pr-2">
        {/* Logo completo - só tablet/desktop */}
        <Link href="/" aria-label="Plasma - página inicial" className="hidden shrink-0 sm:block">
          <Logo className="h-7 w-auto lg:h-8" />
        </Link>

        <ul className="flex flex-1 items-start justify-around sm:items-center sm:justify-center sm:gap-1 lg:gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavTab key={item.href} href={item.href} label={item.label} active={item.match(pathname)}>
                {item.href === "/" ? (
                  <>
                    {/* Mobile: símbolo da marca no lugar da casinha */}
                    <LogoMark
                      className={clsx("size-6 sm:hidden", item.match(pathname) && "[&_path]:fill-current")}
                    />
                    <Icon className="hidden size-5 sm:block" strokeWidth={2} />
                  </>
                ) : (
                  <Icon className="size-5" strokeWidth={2} />
                )}
              </NavTab>
            );
          })}

          {/* Carrinho como aba comum - só mobile */}
          <NavTab
            href={CART_HREF}
            label="Carrinho"
            ariaLabel={cartLabel}
            active={pathname.startsWith(CART_HREF)}
            className="sm:hidden"
          >
            <span className="relative">
              <ShoppingCart className="size-5" strokeWidth={2} />
              <CartBadge count={cartCount} />
            </span>
          </NavTab>
        </ul>

        {/* Carrinho em destaque - só tablet/desktop */}
        <Link
          href={CART_HREF}
          aria-label={cartLabel}
          className="group hidden shrink-0 items-center gap-2 rounded-full border-2 border-black bg-gradient-to-b from-brand-plasma to-brand-secondary-orange px-5 py-2.5 font-bold text-white transition-transform active:scale-95 sm:flex"
        >
          <ShoppingCart className="size-5 transition-transform group-hover:-rotate-[20deg]" strokeWidth={2.25} />
          <span>Cart ({cartCount})</span>
        </Link>
      </div>
    </nav>
  );
}

type NavTabProps = {
  href: string;
  label: string;
  active: boolean;
  ariaLabel?: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * Uma aba da navbar. No mobile: pílula do ícone (h-8 w-14, igual ao
 * Material 3) + rótulo embaixo - toda aba tem exatamente essa mesma caixa,
 * por isso ficam alinhadas. No sm+: vira um link em linha (ícone + texto),
 * e o item ativo vira a pílula vermelha inteira.
 */
function NavTab({ href, label, active, ariaLabel, className, children }: NavTabProps) {
  return (
    <li className={clsx("flex flex-1 sm:flex-none", className)}>
      <Link
        href={href}
        aria-label={ariaLabel}
        aria-current={active ? "page" : undefined}
        className={clsx(
          "group flex flex-1 flex-col items-center gap-1 text-zinc-800 transition-colors",
          // sem o "flash" azul/cinza de toque do navegador no Android
          "[-webkit-tap-highlight-color:transparent]",
          "sm:flex-row sm:gap-2 sm:rounded-full sm:px-4 sm:py-2",
          active ? "sm:bg-brand-plasma sm:text-white" : "sm:hover:bg-black/5 sm:hover:text-brand-plasma",
        )}
      >
        <span
          className={clsx(
            "flex h-8 w-14 items-center justify-center rounded-full transition-colors duration-200",
            "sm:h-auto sm:w-auto sm:bg-transparent sm:text-inherit",
            active ? "bg-brand-plasma text-white" : "group-active:bg-black/10",
          )}
        >
          {children}
        </span>
        <span
          className={clsx(
            "text-[11px] leading-none tracking-wide sm:text-sm lg:text-base",
            active && "font-bold",
          )}
        >
          {label}
        </span>
      </Link>
    </li>
  );
}

function CartBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full border border-black bg-brand-plasma px-1 text-[9px] font-bold leading-none text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}
