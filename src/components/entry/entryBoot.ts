/**
 * Fica FORA de qualquer arquivo "use client" de propósito: o `app/layout.tsx`
 * (componente de servidor) precisa ler estas strings de verdade - importadas
 * de um módulo client, elas viriam como "referência de cliente", não texto.
 */

/** Chave no sessionStorage: "esta aba já viu o portal" */
export const ENTRY_SEEN_KEY = "plasma:entry-seen";

/**
 * Roda ANTES da hidratação (inline no <body>): marca o <html> com
 * `data-entry-skip` (esconde o portal na hora - sem "flash" no F5) ou
 * `data-entry-active` (trava a rolagem enquanto o portal está na tela).
 * Ver as regras em globals.css.
 */
export const ENTRY_BOOT_SCRIPT = `try{var h=document.documentElement;if(sessionStorage.getItem(${JSON.stringify(
  ENTRY_SEEN_KEY,
)})==="1"){h.setAttribute("data-entry-skip","")}else{h.setAttribute("data-entry-active","")}}catch(e){}`;
