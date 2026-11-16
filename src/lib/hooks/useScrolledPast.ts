"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * `true` quando a página já rolou mais que `thresholdPx` (portado do
 * Scathon). Via `useSyncExternalStore`, então é SSR-safe: servidor e
 * primeiro render do cliente dizem `false`, sem "piscar" a navbar.
 */
export function useScrolledPast(thresholdPx: number): boolean {
  const subscribe = useCallback((onStoreChange: () => void) => {
    window.addEventListener("scroll", onStoreChange, { passive: true });
    window.addEventListener("resize", onStoreChange);
    return () => {
      window.removeEventListener("scroll", onStoreChange);
      window.removeEventListener("resize", onStoreChange);
    };
  }, []);

  const getSnapshot = useCallback(
    () => window.scrollY > thresholdPx,
    [thresholdPx],
  );
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
