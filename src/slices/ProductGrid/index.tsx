import type { JSX } from "react";
import { Bounded } from "@/components/Bounded";
import { Heading } from "@/components/Heading";
import { SkateboardProduct } from "./SkateboardProduct";
import { SlideIn } from "@/components/SlideIn";

// Categorias fixas - você pode editar aqui
const CATEGORY_IDS = [
  "camisetas",
  "bermudas",
  "calcas",
  "moletons"
];

// Textos fixos - você pode editar aqui
const PRODUCT_GRID_TEXTS = {
  heading: "Nossas Categorias",
  body: "Streetwear com atitude. Encontre a peça que combina com o seu estilo."
};

/**
 * Component for "ProductGrid" - Exibe uma grade de categorias
 */
const ProductGrid = (): JSX.Element => {
  return (
    <Bounded className="bg-texture bg-brand-gray">
      <SlideIn>
        <Heading className="text-center ~mb-4/6" as="h2">
          {PRODUCT_GRID_TEXTS.heading}
        </Heading>
      </SlideIn>

      <SlideIn>
        <div className="text-center ~mb-6/10">
          <p>{PRODUCT_GRID_TEXTS.body}</p>
        </div>
      </SlideIn>

      <div className="grid w-full grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
        {CATEGORY_IDS.map((id) => (
          <SkateboardProduct key={id} id={id} />
        ))}
      </div>
    </Bounded>
  );
};

export default ProductGrid;
