/**
 * Store externo mínimo que espelha um valor no LocalStorage e avisa quem
 * estiver inscrito quando ele muda. Feito pra ser lido com o
 * `useSyncExternalStore` do React (portado do projeto Scathon).
 *
 * `getServerSnapshot` sempre devolve `defaultValue`, então o HTML do
 * servidor bate com o primeiro render do cliente - sem erro de hidratação.
 */
export function createPersistedStore<T>(key: string, defaultValue: T) {
  let currentValue = defaultValue;
  let hasHydrated = false;
  const listeners = new Set<() => void>();

  function readFromStorage(): T {
    if (typeof window === "undefined") return defaultValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? (JSON.parse(raw) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  function getSnapshot(): T {
    if (!hasHydrated) {
      currentValue = readFromStorage();
      hasHydrated = true;
    }
    return currentValue;
  }

  function getServerSnapshot(): T {
    return defaultValue;
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);

    // Mantém abas diferentes sincronizadas (ex: adicionou no carrinho em
    // outra aba -> o contador desta também atualiza).
    function onStorage(event: StorageEvent) {
      if (event.key !== key) return;
      currentValue = readFromStorage();
      listener();
    }
    window.addEventListener("storage", onStorage);

    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function setValue(next: T | ((prev: T) => T)) {
    const resolved =
      typeof next === "function"
        ? (next as (prev: T) => T)(getSnapshot())
        : next;
    currentValue = resolved;
    hasHydrated = true;
    try {
      window.localStorage.setItem(key, JSON.stringify(resolved));
    } catch {
      // storage cheio/indisponível - mantém só o valor em memória
    }
    listeners.forEach((listener) => listener());
  }

  return { getSnapshot, getServerSnapshot, subscribe, setValue };
}
