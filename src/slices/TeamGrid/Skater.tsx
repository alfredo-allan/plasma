import { ButtonLink } from "@/components/ButtonLink";
import { SkaterScribble } from "./SkaterScribble";
import clsx from "clsx";
import Image from "next/image";

// Tipo baseado nos dados fixos que definimos no TeamGrid
type SocialType = {
  instagram?: string;
  twitter?: string;
};

type SkaterDataType = {
  first_name: string;
  last_name: string;
  bio?: string;
  image?: string;
  photo_background?: string;
  photo_foreground?: string;
  customizer_link?: string;
  social?: SocialType;
};

type Props = {
  skater: SkaterDataType;
  index: number;
};

// Cor do rabisco atrás da foto (mesma cor da marca em todos os cards, reforça identidade)
const SCRIBBLE_COLOR = "text-brand-plasma";

// Imagens padrão caso não existam
const DEFAULT_BACKGROUND_IMAGE = "/models/default-bg.jpg";
const DEFAULT_FOREGROUND_IMAGE = "/models/default-fg.png";

export function Skater({ skater }: Props) {
  const backgroundImage = skater.photo_background || skater.image || DEFAULT_BACKGROUND_IMAGE;
  const foregroundImage = skater.photo_foreground || skater.image || DEFAULT_FOREGROUND_IMAGE;
  const customizerLink = skater.customizer_link || "/categorias";

  return (
    <div className="skater group relative flex flex-col items-center gap-4">
      <div className="stack-layout aspect-[1128/1400] overflow-hidden">
        {/* Background Image */}
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={backgroundImage}
            width={1128}
            height={1400}
            alt=""
            className="h-full w-full scale-100 transform object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-75 group-hover:saturate-[.8]"
          />
        </div>

        {/* Scribble Effect */}
        <SkaterScribble className={clsx("relative", SCRIBBLE_COLOR)} />

        {/* Foreground Image */}
        <Image
          src={foregroundImage}
          width={1128}
          height={1400}
          alt={skater.first_name}
          className="h-full w-full scale-100 transform object-cover transition-transform duration-700 ease-out group-hover:scale-[1.18]"
        />

        {/* Gradient Overlay */}
        <div className="relative h-48 w-full place-self-end bg-gradient-to-t from-black via-transparent to-transparent"></div>

        {/* Name */}
        <h3 className="relative grid place-self-end justify-self-start p-2 font-sans text-brand-gray ~text-2xl/3xl">
          <span className="mb-[-.3em] block">{skater.first_name}</span>
          <span className="block">{skater.last_name}</span>
        </h3>
      </div>

      <ButtonLink href={customizerLink} size="sm">
        Ver categoria
      </ButtonLink>
    </div>
  );
}
