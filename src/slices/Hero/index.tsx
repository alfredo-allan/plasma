import { Bounded } from "@/components/Bounded";
import { Heading } from "@/components/Heading";
import { ButtonLink } from "@/components/ButtonLink";
import { WideLogo } from "./WideLogo";
import { TallLogo } from "./TallLogo";
import { InteractiveSkateboard } from "./InteractiveSkateboard";

// Configurações padrão do skateboard
// A base (parte de baixo) do skate leva a nossa marca — a lixa (GripTape) continua neutra
const DEFAULT_DECK_TEXTURE = "/skateboard/Deck-plasma.webp";
const DEFAULT_WHEEL_TEXTURE = "/skateboard/SkateWheel-plasma.webp";
const DEFAULT_TRUCK_COLOR = "#6F6E6A";
const DEFAULT_BOLT_COLOR = "#6F6E6A";

// Textos fixos - você pode editar aqui
const HERO_TEXTS = {
  heading: "Mais sorte que juízo.",
  body: "Forjada no impacto, respeitada no asfalto. Onde a tradição encontra a marreta, a Plasma assina embaixo. Calce o peso de uma lenda nacional.",
  buttonText: "Começar Agora",
  buttonLink: "/comecar"
};

/**
 * Component for "Hero" - Seção principal da página
 */
const Hero = (): JSX.Element => {
  return (
    <Bounded className="bg-[#787676] relative h-dvh overflow-hidden text-zinc-800 bg-texture">
      {/* Logos de fundo */}
      <div className="absolute inset-0 flex items-center pt-20">
        <WideLogo className="w-[180%] hidden opacity-20 mix-blend-multiply lg:block" />
        <TallLogo className="w-full text-brand-plasma opacity-20 mix-blend-multiply lg:hidden" />
      </div>

      {/* Conteúdo principal */}
      <div className="absolute inset-0 mx-auto mt-24 grid max-w-6xl grid-rows-[1fr,auto] place-items-end px-6 ~py-10/16">

        {/* Título */}
        <Heading className="relative max-w-2xl place-self-start mt-[10px]">
          {HERO_TEXTS.heading}
        </Heading>

        {/* Descrição e Botão */}
        <div className="flex relative w-full flex-col items-center justify-between ~gap-2/4 lg:flex-row">
          <div className="max-w-[45ch] font-semibold ~text-lg/xl">
            <p>{HERO_TEXTS.body}</p>
          </div>
          <ButtonLink
            href={HERO_TEXTS.buttonLink}
            icon="skateboard"
            size="lg"
            className="z-20 mt-2 block "
          >
            {HERO_TEXTS.buttonText}
          </ButtonLink>
        </div>
      </div >

      {/* Skateboard 3D Interativo */}
      < InteractiveSkateboard
        deckTextureURL={DEFAULT_DECK_TEXTURE}
        wheelTextureURL={DEFAULT_WHEEL_TEXTURE}
        truckColor={DEFAULT_TRUCK_COLOR}
        boltColor={DEFAULT_BOLT_COLOR}
      />
    </Bounded >
  );
};

export default Hero;