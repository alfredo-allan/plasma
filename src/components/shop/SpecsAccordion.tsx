import { Product } from "@/lib/shop/types";
import { AccordionItem } from "./Accordion";

export function SpecsAccordion({ product }: { product: Product }) {
  return (
    <div className="border-t border-stone-300">
      <AccordionItem title="Descrição" defaultOpen>
        <p className="text-sm leading-relaxed text-zinc-700">{product.description}</p>
      </AccordionItem>

      <AccordionItem title="Especificações técnicas">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          {product.specs.map((spec) => (
            <div
              key={spec.label}
              className="flex justify-between border-b border-dashed border-stone-200 py-1.5 sm:justify-start sm:gap-2"
            >
              <dt className="text-zinc-500">{spec.label}</dt>
              <dd className="font-medium">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </AccordionItem>
    </div>
  );
}
