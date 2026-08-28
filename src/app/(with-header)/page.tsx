import Hero from "@/slices/Hero";
import ProductGrid from "@/slices/ProductGrid";
import TeamGrid from "@/slices/TeamGrid";
import TextAndImage from "@/slices/TextAndImage";

export default async function Page() {
  return (
    <main>
      <Hero />
      <ProductGrid />
      <TextAndImage theme="Blue" variation="default" />
      <TeamGrid />
      <TextAndImage theme="Navy" variation="imageOnLeft" />
      <TextAndImage theme="Orange" variation="default" />
    </main>
  );
}

// Metadados fixos
export async function generateMetadata() {
  return {
    title: "Plasma | Streetwear com Atitude",
    description: "Camisetas, moletons, bermudas e calças com a identidade Plasma. Streetwear autêntico pra quem vive na rua e no skate.",
  };
}
