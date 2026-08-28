import { Bounded } from "@/components/Bounded";
import { Heading } from "@/components/Heading";
import React from "react";
import { Skater } from "./Skater";
import { SlideIn } from "@/components/SlideIn";

// Cenas lifestyle com modelos usando as peças Plasma em movimento
const SKATERS_DATA = [
  {
    first_name: "Moletom",
    last_name: "Kickflip",
    photo_background: "/models/moletom-bg.webp",
    photo_foreground: "/models/moletom-fg.webp",
    customizer_link: "/categorias/moletons"
  },
  {
    first_name: "Camiseta",
    last_name: "Boardslide",
    photo_background: "/models/camiseta-bg.webp",
    photo_foreground: "/models/camiseta-fg.webp",
    customizer_link: "/categorias/camisetas"
  },
  {
    first_name: "Bermuda",
    last_name: "Nose Grab",
    photo_background: "/models/bermuda-bg.webp",
    photo_foreground: "/models/bermuda-fg.webp",
    customizer_link: "/categorias/bermudas"
  },
  {
    first_name: "Calça",
    last_name: "Freeride",
    photo_background: "/models/calca-bg.webp",
    photo_foreground: "/models/calca-fg.webp",
    customizer_link: "/categorias/calcas"
  }
];

const TEAM_GRID_TEXTS = {
  heading: "Vista o Movimento"
};

const TeamGrid = (): JSX.Element => {
  return (
    <Bounded className="bg-texture bg-brand-navy">
      <SlideIn>
        <Heading as="h2" size="lg" className="mb-8 text-center text-white">
          {TEAM_GRID_TEXTS.heading}
        </Heading>
      </SlideIn>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {SKATERS_DATA.map((skater, index) => (
          <React.Fragment key={index}>
            {skater.first_name && (
              <SlideIn>
                <Skater index={index} skater={skater} />
              </SlideIn>
            )}
          </React.Fragment>
        ))}
      </div>
    </Bounded>
  );
};

export default TeamGrid;
