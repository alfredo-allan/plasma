"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Estado sincronizado com o LocalStorage do navegador.
 *
 * Lê de forma "lúdica": no primeiro render (servidor e primeira pintura no
 * cliente) sempre usa `initialValue`, pra bater com o HTML gerado no
 * servidor - só depois de montado é que lê o valor salvo, evitando erro de
 * hidratação. `hydrated` avisa quando esse valor "de verdade" já chegou.
 */
export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setState(JSON.parse(raw) as T);
    } catch {
      // LocalStorage indisponível (aba anônima, navegação privada, etc.) - segue com o valor inicial.
    } finally {
      setHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // idem
    }
  }, [key, state, hydrated]);

  const update = useCallback((value: T | ((prev: T) => T)) => {
    setState((prev) =>
      typeof value === "function" ? (value as (p: T) => T)(prev) : value
    );
  }, []);

  return [state, update, hydrated] as const;
}
