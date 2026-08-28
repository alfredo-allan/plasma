import Link from 'next/link'
import React from 'react'
import { ButtonLink } from './ButtonLink'
import { Logo } from './Logo'

// Links de navegação fixos - você pode editar aqui
const NAVIGATION_ITEMS = [
  { text: "Home", href: "/" },
  { text: "Produtos", href: "/produtos" },
  { text: "Sobre", href: "/sobre" },
  { text: "Contato", href: "/contato" },
]

export function Header() {
  return (
    <header className="header absolute left-0 right-0 top-0 z-50 ~h-32/48 ~px-4/6 ~py-4/6 hd:h-32">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[auto,auto] items-center gap-6 md:grid-cols-[1fr,auto,1fr]">

        {/* Logo */}
        <Link href="/" className="justify-self-start">
          <Logo className="w-full max-w-full h-auto md:w-[80%]" />
        </Link>

        {/* Menu de navegação */}
        <nav aria-label="Main" className="col-span-full row-start-2 md:col-span-1 md:col-start-2 md:row-start-1">
          <ul className="flex flex-wrap items-center justify-center gap-8">
            {NAVIGATION_ITEMS.map((item) => (
              <li key={item.text}>
                <Link
                  href={item.href}
                  className="~text-lg/xl hover:text-brand-plasma transition-colors"
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Botão do carrinho */}
        <div className="justify-self-end">
          <ButtonLink href="/carrinho" icon="cart" color="purple" aria-label="Cart (0)">
            <span className="md:hidden">0</span>
            <span className="hidden md:inline">Cart (0)</span>
          </ButtonLink>
        </div>
      </div>
    </header>
  )
}