import type { Metadata } from "next";
import { Bowlby_One_SC, DM_Mono } from "next/font/google";

import "./globals.css";  // ← CORRETO
import { SVGFilters } from "@/components/SVGFilters";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${bowlby.variable} ${dmMono.variable} antialiased font-mono font-medium text-zinc-800`}
      >
        <main>{children}</main>
        <SVGFilters />
      </body>
    </html>
  );
}