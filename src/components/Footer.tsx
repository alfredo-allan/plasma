import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Logo } from "@/components/Logo";
import { Bounded } from "./Bounded";
import { FooterPhysics } from "./FooterPhysics";

// Links de navegação fixos
const NAVIGATION_ITEMS = [
  { text: "Home", href: "/" },
  { text: "Produtos", href: "/produtos" },
  { text: "Sobre", href: "/sobre" },
  { text: "Contato", href: "/contato" },
  { text: "Termos de Uso", href: "/termos" },
  { text: "Privacidade", href: "/privacidade" },
];

// 5 variações do nosso shape (mesma identidade visual do Hero) caindo no footer
const BOARD_TEXTURE_URLS = [
  "/skateboard/deck-footer-black.webp",
  "/skateboard/deck-footer-red.webp",
  "/skateboard/deck-footer-cream.webp",
  "/skateboard/deck-footer-navy.webp",
  "/skateboard/deck-footer-heartbeat.webp",
];

// Imagem de fundo do footer
const FOOTER_BACKGROUND_IMAGE = "/footer-bg.jpg";

export function Footer() {
  return (
    <footer className="bg-texture bg-zinc-900 text-white overflow-hidden">
      <div className="relative h-[75vh] ~p-10/16 md:aspect-auto">
        {/* Imagem de fundo */}
        <div className="absolute inset-0">
          <Image
            src={FOOTER_BACKGROUND_IMAGE}
            alt=""
            fill
            className="object-cover"
          />
        </div>

        {/* Física dos skates */}
        <FooterPhysics
          boardTextureURLs={BOARD_TEXTURE_URLS}
          className="absolute inset-0 overflow-hidden"
        />

        {/* Logo */}
        <Logo className="pointer-events-none relative h-20 mix-blend-exclusion md:h-28" />
      </div>

      {/* Navegação */}
      {/* pb extra: espaço pra navbar flutuante não cobrir os links */}
      <Bounded as="nav" className="!pb-32 sm:!pb-36">
        <ul className="flex flex-wrap justify-center gap-8 ~text-lg/xl">
          {NAVIGATION_ITEMS.map((item) => (
            <li key={item.text} className="hover:underline">
              <Link href={item.href}>
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </Bounded>
    </footer>
  );
}
