import type { JSX } from "react";
import clsx from "clsx";

import { Bounded } from "@/components/Bounded";
import { ButtonLink } from "@/components/ButtonLink";
import { Heading } from "@/components/Heading";
import { SlideIn } from "@/components/SlideIn";
import { ParallaxImage } from "./ParallaxImage";

declare module "react" {
  interface CSSProperties {
    "--index"?: number;
  }
}

// Tipos baseados nos mocks
type ImageType = {
  url: string;
  alt: string | null;
  width: number;
  height: number;
  credits: string | null;
  thumbnails?: Record<string, unknown>;
};

type ThemeType = "Blue" | "Orange" | "Navy" | "Lime";

type TextAndImageProps = {
  theme?: ThemeType;
  variation?: "default" | "imageOnLeft";
  index?: number;
  heading?: string;
  body?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: ImageType;
  foregroundImage?: ImageType;
};

// Dados padrão para cada tema
const THEME_DEFAULTS: Record<ThemeType, TextAndImageProps> = {
  Blue: {
    heading: "Inovação em Cada Peça",
    body: "Skates desenvolvidos com tecnologia de ponta para máxima performance e durabilidade.",
    buttonText: "Saiba Mais",
    buttonLink: "/inovacao"
  },
  Orange: {
    heading: "Estilo que Impressiona",
    body: "Design único e cores vibrantes para você se destacar nas pistas.",
    buttonText: "Ver Modelos",
    buttonLink: "/estilos"
  },
  Navy: {
    heading: "Performance Radical",
    body: "Skates projetados para manobras extremas e alta resistência.",
    buttonText: "Explore Agora",
    buttonLink: "/performance"
  },
  Lime: {
    heading: "Energia e Movimento",
    body: "Sinta a adrenalina com nossos skates de alta velocidade.",
    buttonText: "Comprar",
    buttonLink: "/produtos"
  }
};

/**
 * Component for "TextAndImage" - Seção com texto e imagem parallax
 */
const TextAndImage = ({
  theme = "Blue",
  variation = "default",
  index = 0,
  heading,
  body,
  buttonText,
  buttonLink,
  backgroundImage,
  foregroundImage
}: TextAndImageProps): JSX.Element => {

  const defaults = THEME_DEFAULTS[theme as ThemeType] || THEME_DEFAULTS.Blue;

  const finalHeading = heading || defaults.heading;
  const finalBody = body || defaults.body;
  const finalButtonText = buttonText || defaults.buttonText;
  const finalButtonLink = buttonLink || defaults.buttonLink;
  const buttonColor = theme === "Lime" ? "orange" : "lime";

  return (
    <Bounded
      className={clsx(
        "sticky top-[calc(var(--index)*2rem)]",
        theme === "Blue" && "bg-texture bg-brand-blue text-white",
        theme === "Orange" && "bg-texture bg-brand-orange text-white",
        theme === "Navy" && "bg-texture bg-brand-navy text-white",
        theme === "Lime" && "bg-texture bg-brand-secondary-orange"
      )}
      style={{ "--index": index }}
    >
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-24">
        <div
          className={clsx(
            "flex flex-col items-center gap-8 text-center md:items-start md:text-left",
            variation === "imageOnLeft" && "md:order-2"
          )}
        >
          <SlideIn>
            <Heading size="lg" as="h2">
              {finalHeading}
            </Heading>
          </SlideIn>

          <SlideIn>
            <div className="max-w-md text-lg leading-relaxed">
              <p>{finalBody}</p>
            </div>
          </SlideIn>

          <SlideIn>
            <ButtonLink
              href={finalButtonLink}
              color={buttonColor}
            >
              {finalButtonText}
            </ButtonLink>
          </SlideIn>
        </div>

        <ParallaxImage
          foregroundImage={foregroundImage}
          backgroundImage={backgroundImage}
        />
      </div>
    </Bounded>
  );
};

export default TextAndImage;