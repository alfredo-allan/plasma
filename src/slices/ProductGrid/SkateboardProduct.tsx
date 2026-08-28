import { ButtonLink } from "@/components/ButtonLink";
import { HorizontalLine, VerticalLine } from "@/components/Line";
import clsx from "clsx";
import { Scribble } from "./Scribble";
import Image from "next/image";

// Dados fixos das categorias - você pode editar aqui
const CATEGORIES_DATA: Record<string, {
  name: string;
  image: string;
  categoryLink: string;
}> = {
  camisetas: {
    name: "Camisetas",
    image: "/category/camiseta.webp",
    categoryLink: "/categorias/camisetas"
  },
  bermudas: {
    name: "Bermudas",
    image: "/category/bermuda.webp",
    categoryLink: "/categorias/bermudas"
  },
  calcas: {
    name: "Calças",
    image: "/category/calca.webp",
    categoryLink: "/categorias/calcas"
  },
  moletons: {
    name: "Blusas de Moletom",
    image: "/category/blusa.webp",
    categoryLink: "/categorias/moletons"
  }
};

// Cor do rabisco atrás da foto (mesma cor da marca em todas, pra reforçar identidade)
const SCRIBBLE_COLOR = "#DD3726";

const VERTICAL_LINE_CLASSES =
  "absolute top-0 h-full stroke-2 text-stone-300 transition-colors group-hover:text-stone-400";

const HORIZONTAL_LINE_CLASSES =
  "-mx-8 stroke-2 text-stone-300 transition-colors group-hover:text-stone-400";

type Props = {
  id: string;
};

export async function SkateboardProduct({ id }: Props) {
  // Busca os dados da categoria pelo ID
  const category = CATEGORIES_DATA[id];

  // Se a categoria não existir, não renderiza
  if (!category) return null;

  return (
    <div className="group relative mx-auto w-full max-w-md px-8 pt-6 sm:max-w-lg">
      <VerticalLine className={clsx(VERTICAL_LINE_CLASSES, "left-4")} />
      <VerticalLine className={clsx(VERTICAL_LINE_CLASSES, "right-4")} />
      <HorizontalLine className={HORIZONTAL_LINE_CLASSES} />

      <div className="-mb-1 overflow-hidden py-6">
        <Scribble
          className="absolute inset-0 h-full w-full"
          color={SCRIBBLE_COLOR}
        />
        <Image
          alt={category.name}
          src={category.image}
          width={400}
          height={400}
          className="mx-auto w-[76%] origin-top transform-gpu transition-transform duration-500 ease-in-out group-hover:scale-125"
        />
      </div>

      <HorizontalLine className={HORIZONTAL_LINE_CLASSES} />

      <h3 className="my-3 text-center font-sans leading-tight ~text-xl/2xl">
        {category.name}
      </h3>

      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <ButtonLink href={category.categoryLink}>Ver categoria</ButtonLink>
      </div>
    </div>
  );
}
