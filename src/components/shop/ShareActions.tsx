"use client";

import { useState } from "react";
import { Check, Link2, MessageCircle } from "lucide-react";

export function ShareActions({ productName }: { productName: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponível (ex: contexto não seguro) - sem problema, só não copia
    }
  }

  function shareOnWhatsApp() {
    if (typeof window === "undefined") return;
    const text = `Olha que peça: ${productName} — ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <span className="text-zinc-500">Compartilhar:</span>
      <button
        type="button"
        onClick={shareOnWhatsApp}
        className="flex items-center gap-1.5 transition-colors hover:text-brand-plasma"
      >
        <MessageCircle className="size-4" /> WhatsApp
      </button>
      <button
        type="button"
        onClick={copyLink}
        className="flex items-center gap-1.5 transition-colors hover:text-brand-plasma"
      >
        {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
        {copied ? "Copiado!" : "Copiar link"}
      </button>
    </div>
  );
}
