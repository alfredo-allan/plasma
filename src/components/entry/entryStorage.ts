"use client";

import { useSyncExternalStore } from "react";
import { ENTRY_SEEN_KEY } from "./entryBoot";

/**
 * "Esta aba já viu o portal?" - guardado no `sessionStorage` (mesmo padrão
 * da Scathon): zera ao fechar a aba, então uma visita nova mais tarde volta
 * a ver o portal, mas navegar entre páginas ou dar F5 não.
 *
 * A chave e o script que roda antes da hidratação ficam em `entryBoot.ts`.
 */

const listeners = new Set<() => void>();

function read(): boolean {
  try {
    return window.sessionStorage.getItem(ENTRY_SEEN_KEY) === "1";
  } catch {
    // storage bloqueado (aba anônima etc.) - pior caso o portal reaparece
    return false;
  }
}

export function markEntrySeen() {
  try {
    window.sessionStorage.setItem(ENTRY_SEEN_KEY, "1");
  } catch {
    // idem
  }
  listeners.forEach((l) => l());
}

export function useHasSeenEntry(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => false,
  );
}
