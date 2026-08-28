// Desativado junto com a rota /build (customizador de skate) — ver page.tsx.
// Mantido só porque não posso apagar arquivos remotamente nessa sessão.
import type { ReactNode } from "react";

export function CustomizerControlsProvider({
  children,
}: {
  children?: ReactNode;
}) {
  return children ?? null;
}
