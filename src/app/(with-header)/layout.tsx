import { FloatingNav } from "@/components/FloatingNav";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      {/* Fixa no rodapé; aparece com a rolagem (ver doc do componente) */}
      <FloatingNav />
    </>
  );
}
