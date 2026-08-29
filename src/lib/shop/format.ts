/** Helpers puros de formatação/URL usados pela camada de dados e pelos componentes. */

export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatInstallments(cents: number, times: number): string {
  return `${times}x de ${formatBRL(Math.round(cents / times))}`;
}

/** Retorna o desconto em % (arredondado), ou 0 se não houver preço "de". */
export function discountPercent(
  priceCents: number,
  compareAtPriceCents?: number
): number {
  if (!compareAtPriceCents || compareAtPriceCents <= priceCents) return 0;
  return Math.round((1 - priceCents / compareAtPriceCents) * 100);
}

/** "Vermelho Plasma" -> "vermelho-plasma" - usado para gerar ids de filtro a partir de texto livre. */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
