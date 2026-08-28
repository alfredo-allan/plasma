import { Bounded } from "@/components/Bounded";
import { Heading } from "@/components/Heading";
import React, { type JSX } from "react";
import { Skater } from "./Skater";
import { SlideIn } from "@/components/SlideIn";

// Dados fixos dos skaters - você pode editar aqui
const SKATERS_DATA = [
  {
    first_name: "Tony",
    last_name: "Hawk",
    photo_background: "/skaters/tony-bg.jpg",
    photo_foreground: "/skaters/tony-fg.png",
    customizer_link: "/customize/tony-hawk"
  },
  {
    first_name: "Nyjah",
    last_name: "Huston",
    photo_background: "/skaters/nyjah-bg.jpg",
    photo_foreground: "/skaters/nyjah-fg.png",
    customizer_link: "/customize/nyjah-huston"
  },
  {
    first_name: "Leticia",
    last_name: "Bufoni",
    photo_background: "/skaters/leticia-bg.jpg",
    photo_foreground: "/skaters/leticia-fg.png",
    customizer_link: "/customize/leticia-bufoni"
  },
  {
    first_name: "Shane",
    last_name: "O'Neill",
    photo_background: "/skaters/shane-bg.jpg",
    photo_foreground: "/skaters/shane-fg.png",
    customizer_link: "/customize/shane-oneill"
  }
];

const TEAM_GRID_TEXTS = {
  heading: "Nossa Equipe"
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