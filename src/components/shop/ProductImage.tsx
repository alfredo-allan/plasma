"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { CATEGORY_FALLBACK_IMAGE } from "@/lib/shop/mock-data";
import { CategorySlug } from "@/lib/shop/types";

type Props = Omit<ImageProps, "src" | "onError"> & {
  src: string;
  category: CategorySlug;
};

/**
 * Wrapper de <Image> preparado pro "sistema flexível de placeholders"
 * pedido no briefing: se a foto real em `public/assets/products/**` ainda
 * não existir (404), cai automaticamente numa imagem de categoria que já
 * existe no projeto, em vez de mostrar um quadrado quebrado.
 *
 * Assim que as fotos de verdade forem adicionadas na pasta certa (ver nota
 * no fim da resposta), este componente já passa a mostrá-las sem precisar
 * mudar nada.
 */
export function ProductImage({ src, category, alt, ...props }: Props) {
  const [current, setCurrent] = useState(src);

  return (
    <Image
      {...props}
      alt={alt}
      src={current}
      onError={() => setCurrent(CATEGORY_FALLBACK_IMAGE[category])}
    />
  );
}
