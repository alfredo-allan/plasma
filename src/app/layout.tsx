import type { Metadata, Viewport } from "next";
import { Bowlby_One_SC, DM_Mono } from "next/font/google";

import "./globals.css";  // ← CORRETO
import { SVGFilters } from "@/components/SVGFilters";
import { EntryGate } from "@/components/entry/EntryGate";
import { ENTRY_BOOT_SCRIPT } from "@/components/entry/entryBoot";

const bowlby = Bowlby_One_SC({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bowlby-sc",
  weight: "400",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-mono",
  weight: "500",
});

// Metadados fixos - você pode editar aqui
export const metadata: Metadata = {
  title: "Plasma Footwear",
  description: "O autêntico streetwear de São Paulo feito por e para skatistas. Vestuário, estilo e atitude !",
  openGraph: {
    title: "Skateboards Store",
    description: "Personalize seu skate e domine as pistas!",
    images: ["/og-image.jpg"],
  },
};

// `viewport-fit=cover` libera o `env(safe-area-inset-bottom)` usado pela
// navbar flutuante (não fica embaixo da barra de gestos do Android/iOS).
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#DD3726",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: o script do portal marca o <html> antes do React hidratar
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${bowlby.variable} ${dmMono.variable} antialiased font-mono font-medium text-zinc-800`}
      >
        {/* Antes de tudo: decide se o portal aparece (sem "flash" no F5) */}
        <script dangerouslySetInnerHTML={{ __html: ENTRY_BOOT_SCRIPT }} />
        <main>{children}</main>
        {/* Portal "Drop In" - por cima do site, uma vez por aba */}
        <EntryGate />
        <SVGFilters />
      </body>
    </html>
  );
}