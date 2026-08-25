/**
 * Tiny localStorage-backed external store, read via React's
 * useSyncExternalStore — the store (not a useState+useEffect pair) is the
 * source of truth, so there's no "hydrate from localStorage" effect that
 * calls setState synchronously on mount (a pattern the project's
 * react-hooks lint rule now flags). getServerSnapshot returns the fallback
 * so server-rendered HTML and the pre-hydration client render agree; the
 * real value appears on the client's next paint once React resolves the
 * store snapshot, same timing as the old effect-based approach.
 */
export function createLocalStore<T>(key: string, fallback: T) {
  let value: T = fallback;
  let hydrated = false;
  const listeners = new Set<() => void>();

  function hydrate() {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) value = JSON.parse(raw) as T;
    } catch {
      // corrupt or unavailable storage — keep the fallback, not fatal
    }
  }

  function set(next: T) {
    value = next;
    hydrated = true;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // storage unavailable (private browsing, quota) — in-memory only
    }
    listeners.forEach((l) => l());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function getSnapshot(): T {
    hydrate();
    return value;
  }

  function getServerSnapshot(): T {
    return fallback;
  }

  return { set, subscribe, getSnapshot, getServerSnapshot };
}
