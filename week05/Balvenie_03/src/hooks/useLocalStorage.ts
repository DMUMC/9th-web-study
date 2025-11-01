import { useEffect, useState } from 'react';

type Setter<T> = T | ((prev: T) => T);

export function useLocalStorage<T>(key: string, initialValue: T) {
  const readValue = (): T => {
    try {
      if (typeof window === 'undefined') return initialValue;

      const item = window.localStorage.getItem(key);
      if (item === null) return initialValue;

      if (typeof initialValue === 'string') {
        return item as unknown as T;
      }

      return JSON.parse(item) as T;
    } catch (e) {
      console.error('[useLocalStorage] read error:', e);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  useEffect(() => {
    setStoredValue(readValue());
  }, [key]);

  useEffect(() => {
    const onCustom = (e: Event) => {
      setStoredValue(readValue());
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) setStoredValue(readValue());
    };

    window.addEventListener('localStorageChange', onCustom as EventListener);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('localStorageChange', onCustom as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, [key]);

  const setValue = (value: Setter<T>) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        if (valueToStore === null || valueToStore === (undefined as unknown)) {
          window.localStorage.removeItem(key);
        } else if (typeof valueToStore === 'string') {
          window.localStorage.setItem(key, valueToStore);
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }

        window.dispatchEvent(new CustomEvent('localStorageChange'));
      }
    } catch (e) {
      console.error('[useLocalStorage] write error:', e);
    }
  };

  const remove = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        window.dispatchEvent(new CustomEvent('localStorageChange'));
      }
    } finally {
      setStoredValue(initialValue);
    }
  };

  return [storedValue, setValue, remove] as const;
}