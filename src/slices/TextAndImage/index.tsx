import clsx from "clsx";

import { Bounded } from "@/components/Bounded";
import { ButtonLink } from "@/components/ButtonLink";
import { Heading } from "@/components/Heading";
import { SlideIn } from "@/components/SlideIn";
import { ParallaxImage } from "./ParallaxImage";

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
  heading?: string;
  body?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: ImageType;
  foregroundImage?: ImageType;
};

// Dados padrão para cada tema — adaptados pra streetwear (a loja não vende mais shapes avulsos)
const THEME_DEFAULTS: Record<ThemeType, TextAndImageProps> = {
  Blue: {
    heading: "Inovação em Cada Peça",
    body: "Cada peça Plasma une conforto, durabilidade e a identidade visual que é a nossa cara.",
    buttonText: "Saiba Mais",
    buttonLink: "/categorias/moletons",
    foregroundImage: {
      url: "/category/blusa.webp",
      alt: "Blusa de moletom Plasma",
      width: 1600,
      height: 1600,
      credits: null
    }
  },
  Orange: {
    heading: "Estilo que Impressiona",
    body: "Streetwear autêntico com atitude urbana pra você se destacar onde for parar.",
    buttonText: "Ver Categorias",
    buttonLink: "/categorias/camisetas",
    foregroundImage: {
      url: "/category/camiseta.webp",
      alt: "Camiseta Plasma",
      width: 1600,
      height: 1600,
      credits: null
    }
  },
  Navy: {
    heading: "Feito Pra Aguentar o Impacto",
    body: "Tecidos e costuras pensados pro seu dia a dia — do skatepark à rua, sem perder a forma.",
    buttonText: "Explorar",
    buttonLink: "/categorias/bermudas",
    foregroundImage: {
      url: "/category/bermuda.webp",
      alt: "Bermuda Plasma",
      width: 1600,
      height: 1600,
      credits: null
    }
  },
  Lime: {
    heading: "Energia e Movimento",
    body: "Peças versáteis feitas pra acompanhar seu ritmo, dentro e fora da pista.",
    buttonText: "Comprar",
    buttonLink: "/categorias/calcas",
    foregroundImage: {
      url: "/category/calca.webp",
      alt: "Calça Plasma",
      width: 1600,
      height: 1600,
      credits: null
    }
  }
};

/**
 * Component for "TextAndImage" - Seção com texto e imagem parallax
 */
const TextAndImage = ({
  theme = "Blue",
  variation = "default",
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
  const finalBackgroundImage = backgroundImage || defaults.backgroundImage;
  const finalForegroundImage = foregroundImage || defaults.foregroundImage;
  const buttonColor = theme === "Lime" ? "orange" : "lime";

  return (
    <Bounded
      className={clsx(
        theme === "Blue" && "bg-texture bg-brand-blue text-white",
        theme === "Orange" && "bg-texture bg-brand-orange text-white",
        theme === "Navy" && "bg-texture bg-brand-navy text-white",
        theme === "Lime" && "bg-texture bg-brand-secondary-orange"
      )}
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
          foregroundImage={finalForegroundImage}
          backgroundImage={finalBackgroundImage}
        />
      </div>
    </Bounded>
  );
};

export default TextAndImage;
