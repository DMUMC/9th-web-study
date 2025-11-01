export const storage = {
  get(key: string): string | null {
    try {
      if (typeof window === 'undefined') return null;
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(key, value);
      window.dispatchEvent(new CustomEvent('localStorageChange'));
    } catch {}
  },
  remove(key: string) {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.removeItem(key);
      window.dispatchEvent(new CustomEvent('localStorageChange'));
    } catch {}
  },
};