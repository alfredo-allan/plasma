"use client";

import { FormEvent, useState } from "react";
import { Truck } from "lucide-react";
import { calculateShipping } from "@/lib/shop/api";
import { ShippingOption } from "@/lib/shop/types";
import { formatBRL } from "@/lib/shop/format";

type Status = "idle" | "loading" | "done" | "error";

/**
 * Simula o cálculo de frete: valida o formato do CEP e chama
 * `calculateShipping` (mockado, com latência artificial) em `lib/shop/api.ts`.
 * Quando o backend Flask tiver um endpoint real de frete, só essa função
 * muda - o componente continua igual.
 */
export function ShippingCalculator() {
  const [cep, setCep] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [options, setOptions] = useState<ShippingOption[]>([]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const result = await calculateShipping(digits);
      setOptions(result);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-3 border-t border-stone-300 pt-6">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-sans text-sm uppercase">
          <Truck className="size-4" /> Calcular frete
        </h3>
        <a href="#" className="text-sm underline transition-colors hover:text-brand-plasma">
          Frete Grátis? Simule
        </a>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2.5">
        <input
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          placeholder="00000-000"
          inputMode="numeric"
          maxLength={9}
          className="w-full max-w-[180px] rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm focus:border-brand-plasma focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full border-2 border-black px-5 text-sm font-bold transition-colors hover:bg-black hover:text-white disabled:opacity-50"
        >
          {status === "loading" ? "Calculando..." : "Calcular"}
        </button>
      </form>

      {status === "error" && (
        <p className="text-sm text-red-600">CEP inválido. Confira e tente de novo.</p>
      )}

      {status === "done" && (
        <ul className="flex flex-col gap-2 text-sm">
          {options.map((option) => (
            <li
              key={option.id}
              className="flex items-center justify-between rounded-lg bg-white/60 px-3.5 py-2.5 ring-1 ring-stone-200"
            >
              <span>
                {option.label} · até {option.etaDays} dias úteis
              </span>
              <span className="font-bold">
                {option.price === 0 ? "Grátis" : formatBRL(option.price)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="text-xs text-zinc-500">
        <a href="#" className="underline">
          Confira a nossa Política de Frete e Entregas.
        </a>{" "}
        <a href="#" className="underline">
          Não sei o CEP
        </a>
      </div>
    </div>
  );
}
